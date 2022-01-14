import { AxiosResponse } from 'axios';
import { FormEvent, useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import SingleTodo from '../components/SingleTodo';

import TodoService from '../services/TodoService';
import { AddTodoResType, GetTodoResType, TodoType } from '../types';

type FilterByType = 'all' | 'doing' | 'completed';

const Todo = () => {
    const navigate = useNavigate();
    const [todo, setTodo] = useState('');
    const [todos, setTodos] = useState([] as TodoType[]);
    const [filteredTodos, setFilteredTodos] = useState([] as TodoType[]);
    const [filterBy, setFilterBy] = useState('all' as FilterByType);
    const [isFilting, setIsFilting] = useState(false);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        async function fetchAllTodo() {
            try {
                const res =
                    (await TodoService.getAllTodo()) as AxiosResponse<any>;

                const { success, data } = res.data as GetTodoResType;

                if (success) {
                    setTodos(data.todos.reverse());
                    setIsLoading(false);
                }
            } catch (error) {
                console.log('fetch error: ' + error);
            }
        }

        fetchAllTodo();
    }, []);

    async function handleAddTodo(e: FormEvent) {
        try {
            e.preventDefault();

            const res = (await TodoService.addTodo(todo)) as AxiosResponse<any>;

            const { success, data } = res.data as AddTodoResType;

            if (success) {
                const newTodo = {
                    _id: data.todoId,
                    content: todo,
                    isCompleted: false,
                } as TodoType;

                const newTodos = [...todos];
                newTodos.unshift(newTodo);
                setTodos(newTodos);

                setTodo('');
            }
        } catch (error) {
            console.log('add error: ' + error);
        }
    }

    async function handleDeleteTodo(todoId: string) {
        try {
            (await TodoService.deleteTodo(todoId)) as AxiosResponse<any>;

            const newTodos = [...todos]
                .filter((todo) => todo._id !== todoId)
                .map((todo) => todo);

            setTodos(newTodos);
        } catch (error) {
            console.log('delete error: ' + error);
        }
    }

    async function handleUpdateTodoState(todoId: string) {
        try {
            (await TodoService.updateTodoState(todoId)) as AxiosResponse<any>;

            const newTodos = [...todos].map((todo) => {
                if (todo._id === todoId) todo.isCompleted = !todo.isCompleted;

                return todo;
            });

            setTodos(newTodos);
        } catch (error) {
            console.log('delete error: ' + error);
        }
    }

    async function handleUpdateTodoContent(todoId: string, content: string) {
        try {
            (await TodoService.updateTodoContent(
                todoId,
                content,
            )) as AxiosResponse<any>;

            const newTodos = [...todos].map((todo) => {
                if (todo._id === todoId) todo.content = content;
                return todo;
            });

            setTodos(newTodos);
        } catch (error) {
            console.log('delete error: ' + error);
        }
    }

    // filter

    function handleFilterTodos() {
        if (filterBy === 'all') {
            setIsFilting(false);
        }

        if (filterBy === 'doing') {
            setIsFilting(true);
            setFilteredTodos(
                [...todos]
                    .filter((todo) => !todo.isCompleted)
                    .map((todo) => todo),
            );
        }
        if (filterBy === 'completed') {
            setIsFilting(true);
            setIsFilting(true);
            setFilteredTodos(
                [...todos]
                    .filter((todo) => todo.isCompleted)
                    .map((todo) => todo),
            );
        }
    }

    //

    useEffect(() => {
        handleFilterTodos();
    }, [filterBy, todos]);

    return (
        <div
            className='container mx-auto d-flex flex-column gap-3'
            style={{ maxWidth: '500px' }}>
            <button
                onClick={() => {
                    localStorage.clear();
                    navigate('/sign-in');
                }}
                className='btn btn-outline-primary position-fixed'
                style={{ top: '5px', right: '5px' }}>
                Sign out
            </button>

            <h1 className='text-center'>Todo</h1>

            <form className='d-flex gap-2' onSubmit={handleAddTodo}>
                <input
                    value={todo}
                    onChange={(e) => setTodo(e.target.value)}
                    type='text'
                    className='form-control'
                    id='todo'
                    placeholder='Add a new todo ...'
                />

                <button
                    className='btn btn-primary fw-bold'
                    style={{ width: '50px' }}>
                    +
                </button>
            </form>

            <div className='d-flex gap-3'>
                <span className='fw-bold'>Filters:</span>

                <div className='form-check'>
                    <input
                        className='form-check-input'
                        type='radio'
                        name='sortBy'
                        id='all'
                        role='button'
                        defaultChecked
                        onClick={() => setFilterBy('all')}
                    />
                    <label className='form-check-label' htmlFor='all'>
                        All
                    </label>
                </div>
                <div className='form-check'>
                    <input
                        className='form-check-input'
                        type='radio'
                        name='sortBy'
                        id='doing'
                        role='button'
                        onClick={() => setFilterBy('doing')}
                    />
                    <label className='form-check-label' htmlFor='doing'>
                        Doing
                    </label>
                </div>
                <div className='form-check'>
                    <input
                        className='form-check-input'
                        type='radio'
                        name='sortBy'
                        id='completed'
                        role='button'
                        onClick={() => setFilterBy('completed')}
                    />
                    <label className='form-check-label' htmlFor='completed'>
                        Completed
                    </label>
                </div>
            </div>

            <div className='d-flex flex-column gap-2'>
                {isLoading && (
                    <span
                        className='spinner-border mx-auto text-primary'
                        role='status'
                        aria-hidden='true'></span>
                )}

                {!isLoading && (
                    <>
                        {!isFilting &&
                            todos &&
                            todos.length > 0 &&
                            todos.map((todo) => (
                                <SingleTodo
                                    todo={todo}
                                    handleDeleteTodo={handleDeleteTodo}
                                    handleUpdateTodoState={
                                        handleUpdateTodoState
                                    }
                                    handleUpdateTodoContent={
                                        handleUpdateTodoContent
                                    }
                                />
                            ))}
                        {isFilting &&
                            filteredTodos.map((todo) => (
                                <SingleTodo
                                    todo={todo}
                                    handleDeleteTodo={handleDeleteTodo}
                                    handleUpdateTodoState={
                                        handleUpdateTodoState
                                    }
                                    handleUpdateTodoContent={
                                        handleUpdateTodoContent
                                    }
                                />
                            ))}
                    </>
                )}
            </div>
        </div>
    );
};

export default Todo;
