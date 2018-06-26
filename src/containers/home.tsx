import { ChangeEvent } from "react";
import * as React from "react";
import * as toastr from 'toastr';
import { connect } from "react-redux";

import logo from '../logo.svg';
import { ITask, TasksModel } from "../models/todo";
import { createTask, toggleTask } from "../processes/tasks";
import { Optional } from "../utility/optional";

interface IHomeProps {
  currentTaskId?: number
  tasks?: ITask[]
  currentTask?: ITask
}

interface IHomeState {
  taskName: string
}

class HomeContainerComponent extends React.PureComponent<IHomeProps, IHomeState> {
  public state: IHomeState = {
    taskName: ''
  };

  public setNewTaskName = (event: ChangeEvent<HTMLInputElement>) => {
    this.setState({ taskName: event.target.value })
  };

  public createTask = () => {
    createTask(this.state.taskName)
      .then(() => this.setState({ taskName: '' }))
      .catch(error => toastr.error(error, 'OTR'));
  };

  public render() {
    const { tasks } = this.props;
    const count = Optional.of(tasks).orElse([]).length;
    return (
      <div className="App">
        <header className="App-header">
          <img src={ logo } className="App-logo" alt="logo"/>
          <h1 className="App-title">Welcome to React ({ count })</h1>
        </header>
        <p className="App-intro">
          To get started, edit <code>src/App.tsx</code> and save to reload.
        </p>
        <div>
          <input type="text" onChange={ this.setNewTaskName } value={ this.state.taskName }/>
          <button onClick={ this.createTask }>Create</button>
        </div>
        <ul>{ this.renderTasks() }</ul>
      </div>
    );
  }

  private toggleTask = (event: ChangeEvent<HTMLInputElement>) => {
    const taskId = Number.parseInt(event.target.value);
    toggleTask(taskId)
      .catch(error => toastr.error(error));
  };

  private renderTasks() {
    const { tasks } = this.props;
    return Optional.of(tasks).orElse([])
      .map((task: ITask) => <li key={ task.id }>
        <input type="checkbox" checked={ task.done } onChange={ this.toggleTask } value={ task.id }/>
        <span>{ task.name }</span>
      </li>);
  }
}

const mapStateToProps = (state: any, props: IHomeProps): IHomeProps => {

  const currentTask = Optional.of(props.currentTaskId)
    .map(taskId => TasksModel.selectors.getTask(taskId)(state))
    .orElse(null);

  return {
    currentTask,
    tasks: TasksModel.selectors.allTasks(state),
    ...props
  };
};

export const HomeContainer = connect(mapStateToProps)(HomeContainerComponent);