import { createContext, type Dispatch } from 'react';
import type { TaskStateModel } from '../../models/TaskStateModel';
import type { TaskActionModel } from './taskActions';
import { initialTaskState } from './initialTaskState';

type TaskContextProps = {
  state: TaskStateModel;
  dispatch: Dispatch<TaskActionModel>;
};

const initialContextValue = {
  state: initialTaskState,
  dispatch: () => {},
};

export const TaskContext = createContext<TaskContextProps>(initialContextValue);