import React from 'react';
import { combineReducers, createStore } from 'redux';
import './App.css';
import TodoApp from './components/TodoApp.jsx';
import PropTypes from 'prop-types';

//TODO handle store structure
const todo = (state, action) => {
  switch (action.type) {
    case 'ADD_TODO':
      return {
        id: action.id,
        text: action.text,
        completed: false
      }

    case 'TOGGLE_TODO':
      if (state.id !== action.id) {
        return state;
      }
      return {
        ...state,
        completed: !state.completed
      };
    default:
      return state;
  }

}

const todos = (state = [], action) => {
  switch (action.type) {
    case 'ADD_TODO':
      return [
        ...state,
        todo(undefined, action)
      ];
    case 'TOGGLE_TODO':
      return state.map(t => todo(t, action))
    default:
      return state;
  }
}

const visibilityFilter = (state = 'SHOW_ALL', action) => {
  switch (action.type) {
    case 'SET_VISIBILITY_FILTER':
      return action.filter;
    default:
      return state;
  }

}

const todoApp = combineReducers({
  todos,
  visibilityFilter
});

class Provider extends React.Component {
  getChildContext() {
    return {
      store: this.props.store
    };
  }
  render() {
    return this.props.children;
  }
}

Provider.childContextTypes = {
  store: PropTypes.object
};

function App() {
  return (
    <div className="App">
      <Provider store={createStore(todoApp)}>
        <TodoApp />
      </Provider>
    </div>
  );
}

export default App;
