import { TasksModel } from "../todo";
import { storeService } from "../../services/store-service";
import { combineReducers, createStore, Store } from "redux";

describe('Model - TasksModel', () => {

  describe('#Create', () => {

    let store: Store;

    beforeEach(() => {
      store = createStore(combineReducers({ [TasksModel.name]: TasksModel.reducers }));
      storeService.setStore(store);
    });

    it('should add the task to list when a task is created', () => {
      const task = { id: 666, name: 'Todo', done: false };
      TasksModel.actions.create(task);

      expect(store.getState()[TasksModel.name].list).toEqual([666]);

      const tasks = storeService.select(TasksModel.selectors.allTasks);
      expect(tasks).toEqual([task]);
    });

    it('should get the task by id when a ask is created', () => {
      const task = { id: 666, name: 'Todo', done: false };
      TasksModel.actions.create(task);

      expect(store.getState()[TasksModel.name].data).toEqual({ 666: task });

      const storeTask = storeService.select(TasksModel.selectors.getTask(666));
      expect(storeTask).toEqual(task);
    });

  });

});