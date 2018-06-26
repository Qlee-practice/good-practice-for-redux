import * as TasksApi from '../api/tasks';
import { TasksModel } from "../models/todo";
import { storeService } from "../services/store-service";
import { Optional } from "../utility/optional";

interface IProcessEvent {
  name: string,
  error: string | null,
  args?: any[]
}

const report = (event: IProcessEvent) => {
  console.log(`call ${event.name} ${event.error ? `fail: ${event.error}` : 'success'}`);
  console.log(`With [ ${event.args} ]`);
};

const Process = {
  create<K extends (...args: any[]) => any>(fn: K, name: string): K {
    const wrappedFn = async (...args: any[]) => {
      const event: IProcessEvent = { name, error: null, args };
      let value = null;
      try {
        console.log(`<${name} with=[${args}]>`);
        value = await fn.apply(null, args);
        // report(event);
      } catch (e) {
        console.log('Error: ', e.message);
        event.error = e.message;
        // report(event);
        throw e;
      }finally {
        console.log(`</${name}>`);
      }
      return value;
    };
    return wrappedFn as K;
  }
};


export const createTask = Process.create(async (taskName: string) => {
  const name = taskName.trim();
  if (!name) throw new Error('Name can not is empty');

  const createdTask = await TasksApi.create(taskName);

  await TasksModel.actions.create(createdTask);

  return toggleTask(createdTask.id);
}, 'CreateTask');


export const toggleTask = Process.create(async (taskId: number, done?: boolean) => {
  const taskDone = Optional.of(done)
    .orElseGet(() => {
      const task = storeService.select(TasksModel.selectors.getTask(taskId));
      return Optional.of(task)
        .map(t => !t.done)
        .orElseThrow(() => new Error(`Task ${taskId} is not existed`));
    });

  await TasksApi.toggle(taskId, taskDone);
  return TasksModel.actions.patch({ id: taskId, done: taskDone });
}, 'ToggleTask');

