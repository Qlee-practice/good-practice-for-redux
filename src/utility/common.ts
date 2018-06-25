import { Reducer } from "redux";

export interface IAction<T> {
  type: string,
  payload: T
}

export interface IDict<T> {
  [key: string]: T,

  [key: number]: T,
}

export interface IResource<ID extends (string | number), T> {
  data: IDict<T>,
  list: ID[],
}

export type Handler<K, U> = (state: K, action: IAction<U>) => K

export interface IModel<A, S> {
  name: string,
  actions: A,
  reducers: Reducer<any, any>,
  selectors: S
}

export interface IResourceAction {
  CREATE: string,
  UPDATE: string,
  DELETE: string,
  PATCH: string,
}

export const RESOURCE_ACTIONS: IResourceAction = {
  CREATE: 'CREATE',
  DELETE: 'DELETE',
  PATCH: 'PATCH',
  UPDATE: 'UPDATE',
};

export const toHandler = (reducerDict: IDict<Handler<any, any>>, initialData: any): Reducer<any, any> =>
  (state: any = initialData, action: IAction<any>) => {
    const handler = reducerDict[action.type];
    return handler ? handler(state, action) : state;
  };

export const createNamespace = (prefix: string) => (actionType: string) => `${prefix}--${actionType}`;

