import axios from 'axios';
import dayjs from 'dayjs';
import jwtDecode from 'jwt-decode';
import { RefreshTokenResType } from '../types';
import AuthService from './AuthService';

const axiosInstance = axios.create({
    baseURL: import.meta.env.VITE_TODO,
});

axiosInstance.interceptors.request.use(
    async (config) => {
        // Do something before request is sent

        const token = localStorage.getItem('token') || '';

        let headers = null;

        if (token) {
            headers = { Authorization: 'Bearer ' + token };
        }

        if (headers) {
            config.headers = headers;
        }

        const user = jwtDecode(token) as any;
        const isExpired = dayjs.unix(user.exp).diff(dayjs()) < 1;

        if (!isExpired) return config;

        const response = await AuthService.getRefreshToken();

        const { data } = response.data as RefreshTokenResType;

        const newToken = data.token;

        config.headers = { Authorization: 'Bearer ' + newToken };

        return config;
    },
    (error) => {
        // Do something with request error

        return Promise.reject(error);
    },
);

axios.interceptors.response.use(
    (response) => {
        return response;
    },
    function (error) {
        localStorage.clear();
        window.location.replace('/sign-in');
        return Promise.reject(error);
    },
);

export default class TodoService {
    static getAllTodo = () => {
        return axiosInstance({
            method: 'get',
            url: '/',
        });
    };

    static addTodo = (content: string) => {
        return axiosInstance({
            method: 'post',
            url: '/',
            data: {
                content,
            },
        });
    };

    static deleteTodo = (todoId: string) => {
        return axiosInstance({
            method: 'delete',
            url: `/${todoId}`,
        });
    };

    static updateTodoState = (todoId: string) => {
        return axiosInstance({
            method: 'put',
            url: `/state/${todoId}`,
        });
    };

    static updateTodoContent = (todoId: string, content: string) => {
        return axiosInstance({
            method: 'put',
            url: `/content/${todoId}`,
            data: {
                content,
            },
        });
    };
}
