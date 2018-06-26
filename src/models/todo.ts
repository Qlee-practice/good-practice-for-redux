import { combineReducers } from "redux";
import { storeService } from "../services/store-service";
import { createNamespace, IAction, IDict, IModel, IResource, RESOURCE_ACTIONS, toHandler } from "../utility/common";

export interface ITask {
  id?: any,
  name?: string,
  done?: boolean,
}


export interface ITasks extends IResource<string, ITask> {}

const TASK_NAMESPACE = 'tasks';

// types,
const createActionType = createNamespace(TASK_NAMESPACE);

const TODO_ACTION_TYPES = {
  CREATE: createActionType(RESOURCE_ACTIONS.CREATE),
  UPDATE: createActionType(RESOURCE_ACTIONS.UPDATE),
  PATCH: createActionType(RESOURCE_ACTIONS.PATCH),
  DELETE: createActionType(RESOURCE_ACTIONS.DELETE),
};

// actions,
const createAction = <T>(actionType: any) => (payload: T) => storeService.dispatch({
  type: actionType,
  payload,
});

interface ITasksAction {
  create: (task: ITask) => Promise<ITask>,
  patch: (payload: ITask) => void,
}

const tasksActions: ITasksAction = {
  create: createAction(TODO_ACTION_TYPES.CREATE),
  patch: createAction(TODO_ACTION_TYPES.PATCH),
};

// reducers,

const list = toHandler({
  [TODO_ACTION_TYPES.CREATE](state, { payload: task }: IAction<ITask>): number[] {
    return [...state, task.id];
  }
}, []);

const data = toHandler({
  [TODO_ACTION_TYPES.CREATE](state, { payload: task }: IAction<ITask>): number[] {
    return { ...state, [task.id]: task };
  },
  [TODO_ACTION_TYPES.PATCH](state, { payload: task }: { payload: ITask }): ITasks {
    const originTask = state[task.id];
    return { ...state, [task.id]: { ...originTask, ...task } };
  }
}, {});

const tasksReducers = combineReducers({ list, data });

// selector

interface ITaskSelector {
  allTasks: (rootState: any) => ITask[]

  getTask(taskId: number): (rootState: any) => ITask;
}

const tasksSelectors: ITaskSelector = {
  allTasks: (rootState: IDict<any>) => {
    const state = rootState[TASK_NAMESPACE];
    return state.list.map((id: any) => state.data[id]);
  },

  getTask: (taskId: number) => (rootState: any): ITask => {
    const state = rootState[TASK_NAMESPACE];
    return state.data[taskId];
  }
};


// Model
export const TasksModel: IModel<ITasksAction, ITaskSelector> = {
  name: TASK_NAMESPACE,
  actions: tasksActions,
  reducers: tasksReducers,
  selectors: tasksSelectors,
};

