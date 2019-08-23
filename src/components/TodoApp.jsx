import React from 'react';
import Todo from './Todo';
import { connect } from 'react-redux'


//actions component
let nextTodoId = 0;
const addTodo = (text) => {
    return {
        type: 'ADD_TODO',
        id: nextTodoId++,
        text
    }
};

const setVisibilityFilter = (filter) => {
    return {
        type: 'SET_VISIBILITY_FILTER',
        filter
    }
};
const toggleTodo = (id) => {
    return {
        type: 'TOGGLE_TODO',
        id
    }
};

const Link = ({ active, children, onClick }) => {
    if (active) {
        return <span>{children}</span>
    }
    return (
        <a href="" onClick={e => {
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

const mapStateToLinkProps = (state, ownProps) => {
    return {
        active: ownProps.filter === state.visibilityFilter
    }

}

const mapDispatchToLinkProps = (dispatch, ownProps) => {
    return {
        onClick: () => {
            dispatch(setVisibilityFilter(ownProps.filter))
        }
    }
}

const FilterLink = connect(
    mapStateToLinkProps,
    mapDispatchToLinkProps
)(Link)


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




let AddTodo = ({ dispatch }) => {
    let input;
    return (
        <div>
            <input ref={node => { input = node; }} />
            <button onClick={() => {
                dispatch(addTodo(input.value));
                input.value = '';
            }}>Add Todo</button>
        </div>
    );
}
AddTodo = connect(
    null,
    dispatch => {
        return { dispatch };
    }
)(AddTodo);


const masStateToTodoListProps = (state) => {
    return {
        todos: getVisibleTodos(
            state.todos,
            state.visibilityFilter
        )
    }
};

const mapDispatchToTodoListProps = (dispatch) => {
    return {
        onTodoClick: id => dispatch(toggleTodo(id));
    }
}
const VisibleTodoList = connect(
    masStateToTodoListProps,
    mapDispatchToTodoListProps
)(TodoList);


const TodoApp = () => {
    return (
        <div>
            <AddTodo />
            <VisibleTodoList />
            <Footer />
        </div>
    );
}


export default TodoApp;