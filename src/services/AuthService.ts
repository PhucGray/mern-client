import axios from 'axios';

export default class AuthService {
    static signIn = (email: string, password: string) =>
        axios({
            url: import.meta.env.VITE_SIGN_IN,
            method: 'post',
            data: { email, password },
        });

    static signUp = (email: string, password: string) =>
        axios({
            url: import.meta.env.VITE_SIGN_UP,
            method: 'post',
            data: { email, password },
        });

    static getRefreshToken = () =>
        axios({
            url: import.meta.env.VITE_REFRESH_TOKEN,
            method: 'post',
            data: {
                refreshToken: localStorage.getItem('refresh-token'),
            },
        });
}
