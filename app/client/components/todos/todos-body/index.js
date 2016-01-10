import style from './style.css';
import React from 'react';

class TodosBody extends React.Component {
  static propTypes = {
    todos: React.PropTypes.array.isRequired,
    removeTodo: React.PropTypes.func.isRequired,
    completeTodo: React.PropTypes.func.isRequired
  };

  _renderTodos() {
    return this.props.todos.map((todo, index) => {
      const text = todo.complete ? <s>{todo.text}</s> : <span>{todo.text}</span>;

      return (
        <tr key={index}>
          <td><span>{index + 1}</span></td>
          <td>{text}</td>
          <td>
            <button type='button' className='btn btn-xs btn-success' onClick={this.props.completeTodo.bind(null, index)}>
              <i className='fa fa-check'></i>
            </button>
          </td>
          <td>
            <button type='button' className='btn btn-xs btn-danger' onClick={this.props.removeTodo.bind(null, index)}>
              <i className='fa fa-remove'></i>
            </button>
          </td>
        </tr>
      );
    });
  }

  render() {
    return (
      <div className={`col-md-12 ${style.container}`}>
        <table className='table'>
          <tbody>
            {this._renderTodos()}
          </tbody>
        </table>
      </div>
    );
  }
}

export default TodosBody;
