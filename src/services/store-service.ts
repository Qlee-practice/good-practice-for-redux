import { Store } from "redux";

let store: Store;

export const storeService = {
  setStore(appStore: Store) {
    return store = appStore;
  },
  getStore() {
    return store;
  },
  select<T>(fn: (state: any) => T): T {
    return fn(store.getState());
  },
  dispatch(action: any) {
    return store.dispatch(action);
  }
};