import * as React from 'react';
import './App.css';
import { applyMiddleware, combineReducers, createStore, Store } from "redux";
import { HomeContainer } from "./containers/home";
import { Provider } from 'react-redux';
import { createLogger } from 'redux-logger';
import { composeWithDevTools } from 'redux-devtools-extension';

import { TasksModel } from "./models/todo";
import { makePromise } from "./redux-middlewares/make-promise";
import { storeService } from "./services/store-service";
import 'toastr/build/toastr.css';


const reducers = combineReducers({
  [TasksModel.name]: TasksModel.reducers
});

const logger = createLogger({
  collapsed: true
});
const store: Store = createStore(reducers, composeWithDevTools(applyMiddleware(logger, makePromise)));
storeService.setStore(store);

class App extends React.Component {
  public render() {
    return <Provider store={ store }>
      <HomeContainer currentTaskId={ 1 }/>
    </Provider>;
  }
}

export default App;
