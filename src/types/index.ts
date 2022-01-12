export type UserType = {
    email: string;
};

export type RefreshTokenResType = {
    data: {
        token: string;
    };
    message: string;
    success: boolean;
};

export type AuthResType = {
    data: {
        token: string;
        refreshToken: string;
    };
    message: string;
    success: boolean;
};

export type AuthErrorType = {
    response: {
        data: {
            success: boolean;
            message: string | any;
            type:
                | 'email'
                | 'password'
                | 'confirmPassword'
                | 'token'
                | 'refreshToken'
                | 'server';
        };
        status: number;
    };
};

export type TodoType = {
    content: string;
    isCompleted: boolean;
    _id: string;
};

export type GetTodoResType = {
    data: {
        todos: TodoType[];
    };
    success: boolean;
};

export type AddTodoResType = {
    data: {
        todoId: string;
    };
    success: boolean;
};
