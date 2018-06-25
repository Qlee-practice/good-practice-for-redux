import * as TasksApi from '../api/tasks';
import { TasksModel } from "../models/todo";
import { storeService } from "../services/store-service";
import { Optional } from "../utility/optional";

export const createTask = async (taskName: string) => {
  const name = taskName.trim();
  if (!name) throw new Error('Name can not is empty');
  const createdTask = await TasksApi.create(taskName);
  return TasksModel.actions.create(createdTask);
};

export const toggleTask = async (taskId: number, done?: boolean) => {
  const taskDone = Optional.of(done)
    .orElseGet(() => {
      const task = storeService.select(TasksModel.selectors.getTask(taskId));
      return Optional.of(task)
        .map(t => !t.done)
        .orElseThrow(() => new Error(`Task ${taskId} is not existed`));
    });
  await TasksApi.toggle(taskId, taskDone);
  return TasksModel.actions.toggleDone({ id: taskId, done: taskDone });
};

