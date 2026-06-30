import { useEffect, useReducer, useRef } from 'react';
import { initialTaskState } from './initialTaskState';
import { taskReducer } from './taskReducer';
import { TaskContext } from './TaskContext';
import { TimerWorkerManager } from '../../workers/TimerWorkerManager';
import { TaskActionTypes } from './taskActions';
import { loadBeep } from '../../utils/loadBeep';
import type { TaskStateModel } from '../../models/TaskStateModel';

type TaskContextProviderProps = {
  children: React.ReactNode;
};

export function TaskContextProvider({ children }: TaskContextProviderProps) {
  const [state, dispatch] = useReducer(taskReducer, initialTaskState, () => {
    const storageState = localStorage.getItem('state');
    if (storageState === null) return initialTaskState;
    const parsedStorageState = JSON.parse(storageState) as TaskStateModel;
    return {
      ...parsedStorageState,
      activeTask: null,
      secondsRemaining: 0,
      formattedSecondsRemaining: '00:00',
    };
  });

  const playBeepRef = useRef<ReturnType<typeof loadBeep> | null>(null);
  // Guarda a referência da activeTask para não recriar o worker desnecessariamente
  const activeTaskRef = useRef(state.activeTask);

  useEffect(() => {
    activeTaskRef.current = state.activeTask;
  }, [state.activeTask]);

  // Salva no localStorage e atualiza o título sempre que o estado mudar
  useEffect(() => {
    localStorage.setItem('state', JSON.stringify(state));
    document.title = `${state.formattedSecondsRemaining} - Chronos Pomodoro`;
  }, [state]);

  // Inicia o worker apenas quando a activeTask muda (nova tarefa ou interrupção)
  useEffect(() => {
    const worker = TimerWorkerManager.getInstance();

    if (!state.activeTask) {
      worker.terminate();
      return;
    }

    // Registra o handler de mensagens do worker
    worker.onmessage(e => {
      const countDownSeconds = e.data;

      if (countDownSeconds <= 0) {
        if (playBeepRef.current) {
          playBeepRef.current();
          playBeepRef.current = null;
        }
        dispatch({ type: TaskActionTypes.COMPLETE_TASK });
        TimerWorkerManager.getInstance().terminate();
      } else {
        dispatch({
          type: TaskActionTypes.COUNT_DOWN,
          payload: { secondsRemaining: countDownSeconds },
        });
      }
    });

    // Envia o estado inicial para o worker iniciar a contagem
    worker.postMessage(state);

  // Só roda quando a activeTask muda, não a cada COUNT_DOWN
  }, [state.activeTask]); // eslint-disable-line react-hooks/exhaustive-deps

  // Carrega o beep quando uma nova tarefa começa
  useEffect(() => {
    if (state.activeTask && playBeepRef.current === null) {
      playBeepRef.current = loadBeep();
    } else if (!state.activeTask) {
      playBeepRef.current = null;
    }
  }, [state.activeTask]);

  return (
    <TaskContext.Provider value={{ state, dispatch }}>
      {children}
    </TaskContext.Provider>
  );
}