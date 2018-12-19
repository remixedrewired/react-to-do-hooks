import React, { useState, Component } from "react";
import ReactCSSTransitionGroup from 'react-addons-css-transition-group';
import "./App.css";

import { getItems, addItem, updateItem, deleteItem } from '../services/firebaseFunctions';

function Todo({ todo, completeToDo, deleteItem }) {
  const { key } = todo;
  return (
    <div 
      className="todo"
      style={{ textDecoration: todo.isCompleted ? "line-through" : ""}}
    >
      {todo.message}
      <div>
        <button onClick={() => completeToDo(key)}>Complete</button>
        <button onClick={() => deleteItem(key)}>X</button>
      </div>
    </div>
  )
}

function TodoForm({ addItem }) {
  const [value, setValue] = useState("");

  const handleSubmit = e => {
    e.preventDefault();
    if (!value) return;

    const newItem = {
      text: value,
      isCompleted: false,
    }

    const newItemJSON = JSON.stringify(newItem);
    addItem(newItemJSON);
    setValue("");
  }

  return (
    <form 
      className="form"
      onSubmit={handleSubmit}>
      <input
        type="text"
        className="input"
        value={value}
        onChange={e => setValue(e.target.value)}
      />
    </form>
  );
}

class App extends Component {
  state = {
    items: [],
  }

  async componentDidMount() {
    await this.fetchItems();
  }

  fetchItems = async () => {
    try {
      const result = await getItems();
      if (result && result.status === 200) {
        const { data } = result;
        this.setState({ items: data });
      }
    } catch(e) {
      console.log(e);
    }
  }

  addItem = async (item) => {
    try {
      const result = await addItem(item);
      if(!result) {
        throw new Error();
      }
      this.fetchItems();
    } catch(e) {
      console.warn(e);
    }
  }

  completeToDo = async (key) => {
    try {
      const isCompleted = true;
      const result = await updateItem(key, { isCompleted })
      if(!result || result.status !== 201) {
        throw new Error();
      }
      this.fetchItems();
    } catch(e) {
      console.warn(e);
    }
  }

  deleteItem = async (key) => {
    try {
      const result = await deleteItem(key)
      if(!result || result.status !== 201) {
        throw new Error();
      }
      this.fetchItems();
    } catch(e) {
      console.warn(e);
    }
  }

  render() {
    return (
      <div className="app">
        <div className="todo-list">
          <h3>ENTER NAME OF THE TASK</h3>
          <TodoForm addItem={this.addItem} />
          <ReactCSSTransitionGroup transitionName="example" transitionEnterTimeout={700} transitionLeaveTimeout={700}>
            {this.state.items.length > 0 && this.state.items.map((item, index) => {
              return <Todo
                key={index}
                todo={item}
                completeToDo={this.completeToDo}
                deleteItem={this.deleteItem}
              />
            })}
          </ReactCSSTransitionGroup>
        </div>
      </div>
    ) 
  }
}

export default App;