import { storeService } from "../../services/store-service";
import { combineReducers, createStore, Store } from "redux";
import { TasksModel } from '../../models/todo';
import { createTask } from "../tasks";
import * as TaskApi from '../../api/tasks';
import Mock = jest.Mock;

jest.mock('../../api/tasks');

describe('Process -- tasks', () => {

  describe('#createTask', () => {

    let store: Store;

    beforeEach(() => {
      (TaskApi.create as Mock).mockClear();
      store = createStore(combineReducers({ [TasksModel.name]: TasksModel.reducers }));
      storeService.setStore(store);
    });

    it('should add the task to list when a task is created', async () => {
      (TaskApi.create as Mock).mockImplementation(async (name: string) => ({ id: 1, name, done: false }))
      const taskName = 'Todo';

      await createTask(taskName);

      expect(TaskApi.create).toBeCalledWith(taskName);

      const tasks = storeService.select(TasksModel.selectors.allTasks);
      expect(tasks).toEqual([{ id: 1, name: taskName, done: false }]);
    });


    it('should throw error when task name is blank', () => {
      return createTask('  ').catch((error: Error) => {
        expect(error.message).toEqual('Name can not is empty');
      });
    });
  });
});