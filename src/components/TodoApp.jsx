import React from 'react';
import Todo from './Todo';
import PropTypes from 'prop-types';

const Link = ({ active, children, onClick }) => {
    if (active) {
        return <span>{children}</span>
    }
    return (
        <a href="#" onClick={e => {
            e.preventDefault();
            onClick();
        }}>{children}</a>
    );
}

const TodoList = ({ todos, onTodoClick }) => {
    return (
        <ul>
            {todos.map(todo =>
                <Todo
                    key={todo.id}
                    {...todo}
                    onClick={() => onTodoClick(todo.id)}
                />
            )}
        </ul>
    )
}

const getVisibleTodos = (todos, filter) => {
    switch (filter) {
        case 'SHOW_ALL':
            return todos;

        case 'SHOW_COMPLETED':
            return todos.filter(t => t.completed);
        case 'SHOW_ACTIVE':
            return todos.filter(t => !t.completed);

        default:
            return todos;

    }
}

class FilterLink extends React.Component {
    componentDidMount() {
        const { store } = this.context;
        store.subscribe(() => {
            this.forceUpdate()
        });
    }

    componentWillUnmount() {
        this.unsubscribe();
    }

    render() {
        const props = this.props;
        const { store } = this.context;
        const state = store.getState();

        return (
            <Link
                active={props.filter === state.visibilityFilter}
                onClick={() =>
                    store.dispatch({
                        type: 'SET_VISIBILITY_FILTER',
                        filter: props.filter
                    })
                }
            >
                {props.children}
            </Link>
        )
    }
}

FilterLink.contextTypes = {
    store: PropTypes.object
};

const Footer = () => {
    return (
        <p>
            Show:
            {' '}
            <FilterLink filter='SHOW_ALL' > All </FilterLink>
            {' '}
            <FilterLink filter='SHOW_ACTIVE'> Active </FilterLink>
            {' '}
            <FilterLink filter='SHOW_COMPLETED'> Completed </FilterLink>
        </p>
    );
}

let nextTodoId = 0;
const AddTodo = (props, {store}) => {
    let input;
    return (
        <div>
            <input ref={node => { input = node; }} />
            <button onClick={() => {
                store.dispatch({ type: 'ADD_TODO', id: nextTodoId++, text: input.value });
                input.value = '';
            }}>Add Todo</button>
        </div>
    );
}

AddTodo.contextTypes = {
    store: PropTypes.object
};

class VisibleTodoList extends React.Component {
    componentDidMount() {
        const { store } = this.context;
        store.subscribe(() => {
            this.forceUpdate()
        });
    }

    componentWillUnmount() {
        this.unsubscribe();
    }

    render() {
        const props = this.props;
        const { store } = this.context;
        const state = store.getState();

        return (
            <TodoList
                todos={getVisibleTodos(state.todos, state.visibilityFilter)}
                onTodoClick={id => store.dispatch({ type: 'TOGGLE_TODO', id })}
            />
        );
    }
}
VisibleTodoList.contextTypes = {
    store: PropTypes.object
};

const TodoApp = () => {
    return (
        <div>
            <AddTodo/>
            <VisibleTodoList />
            <Footer />
        </div>
    );
}


export default TodoApp;