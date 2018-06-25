import { ITask } from "../models/todo";

let id = 1;

const getId = () => id++;

export const create = async (taskName: string): Promise<ITask> => {
  return {
    id: getId(),
    name: taskName,
    done: false,
  };
};

export const toggle = async (taskId: number, done: boolean): Promise<any> => {
  console.log('Server toggle', taskId, done);
  // throw new Error('Toggle failed for ' + taskId);
  return null;
};