import { FormEvent, MutableRefObject, useRef, useState } from 'react';
import { TodoType } from '../types';

interface SingleTodoProps {
    todo: TodoType;
    handleDeleteTodo: (todoId: string) => Promise<void>;
    handleUpdateTodoState: (todoId: string) => Promise<void>;
    handleUpdateTodoContent: (todoId: string, content: string) => Promise<void>;
}

const SingleTodo = ({
    todo,
    handleDeleteTodo,
    handleUpdateTodoState,
    handleUpdateTodoContent,
}: SingleTodoProps) => {
    const { _id, isCompleted, content } = todo;

    const [currentContent, setCurrentContent] = useState(content);
    const [prevContent, setPrevContent] = useState('');
    const [isEditable, setIsEditable] = useState(false);

    async function handleEdit() {
        if (!currentContent) {
            setCurrentContent(prevContent);
        } else if (currentContent !== content) {
            await handleUpdateTodoContent(_id, currentContent);
        }

        setIsEditable(false);
    }

    return (
        <div
            key={_id}
            className='d-flex p-1'
            style={{ background: isCompleted ? '#c2c2c2' : '' }}>
            <div>
                <input
                    className='form-check-input me-3'
                    type='checkbox'
                    role='button'
                    checked={isCompleted}
                    onClick={() => handleUpdateTodoState(_id)}
                />
            </div>

            <form
                className={`flex-grow-1 text-truncate pe-1 ${
                    isCompleted && 'text-decoration-line-through'
                }`}
                onSubmit={(e) => {
                    e.preventDefault();
                    handleEdit();
                }}>
                {isEditable ? (
                    <input
                        className='w-100'
                        type='text'
                        value={currentContent}
                        onChange={(e) => setCurrentContent(e.target.value)}
                        onBlur={handleEdit}
                        autoFocus
                    />
                ) : (
                    content
                )}
            </form>

            <div className='d-flex gap-1'>
                <span
                    className='material-icons'
                    role='button'
                    onClick={() => {
                        setIsEditable(true);
                        setPrevContent(content);
                    }}>
                    edit
                </span>
                <span
                    className='material-icons'
                    role='button'
                    onClick={() => handleDeleteTodo(_id)}>
                    delete
                </span>
            </div>
        </div>
    );
};

export default SingleTodo;
