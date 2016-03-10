import { assert } from 'chai';
import sinon from 'sinon';
import React from 'react';
import { shallow } from 'enzyme';
import { Todos } from './todos';
import TodosHeader from './../todos/todos-header';
import TodosAdd from './../todos/todos-add';
import TodosBody from './../todos/todos-body';

describe('Component: Todos', () => {
  const todos = [
    { text: 'Todo 1', complete: false },
    { text: 'Todo 2', complete: false },
    { text: 'Todo 3', complete: false },
    { text: 'Todo 4', complete: false },
  ];
  let actions;
  let component;

  beforeEach(() => {
    actions = {
      addTodo: sinon.spy(),
      removeTodo: sinon.spy(),
      completeTodo: sinon.spy(),
    };
    component = shallow(<Todos todos={todos} actions={actions} />);
  });

  it(`should have 'TodosHeader' component`, () => {
    assert.ok(component.find(TodosHeader).node);
  });

  it(`should have 'TodosAdd' component`, () => {
    assert.ok(component.find(TodosAdd).node);
  });

  it(`should have 'TodosBody' component`, () => {
    assert.ok(component.find(TodosBody).node);
  });
});
