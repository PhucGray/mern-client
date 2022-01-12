import axios from 'axios';
import React, {
    ChangeEvent,
    FormEvent,
    MutableRefObject,
    useRef,
    useState,
} from 'react';
import { useNavigate } from 'react-router-dom';
import ButtonSubmit from '../components/ButtonSubmit';
import AuthService from '../services/AuthService';

import { AuthErrorType, AuthResType } from '../types';
import { validateEmailFormat } from '../utils/validateEmailFormat';

const SignIn = () => {
    const [isLoading, setIsLoading] = useState(false);
    const [emailError, setEmailError] = useState('');
    const [passwordError, setPasswordError] = useState('');

    const [isDirty, setIsDirty] = useState(false);

    const emailRef = useRef() as MutableRefObject<HTMLInputElement>;
    const passwordRef = useRef() as MutableRefObject<HTMLInputElement>;

    function validateEmail() {
        const email = emailRef.current.value;

        setEmailError('');
        emailRef.current.classList.add('is-invalid');

        if (email.trim().length === 0) {
            setEmailError('Please enter your email address');
            emailRef.current.focus();
            return {
                isEmailValid: false,
            };
        }

        if (email.trim().length < 11) {
            setEmailError('Email must be at least 11 characters');
            emailRef.current.focus();
            return {
                isEmailValid: false,
            };
        }

        if (!validateEmailFormat(email)) {
            setEmailError('Invalid email address');
            emailRef.current.focus();
            return {
                isEmailValid: false,
            };
        }

        emailRef.current.classList.remove('is-invalid');
        emailRef.current.classList.add('is-valid');

        return {
            isEmailValid: true,
            email,
        };
    }

    function validatePassword() {
        const password = passwordRef.current.value;

        setPasswordError('');
        passwordRef.current.classList.add('is-invalid');

        if (!password.trim()) {
            setPasswordError('Please enter your password');
            passwordRef.current.focus();
            return {
                isPasswordValid: false,
            };
        } else if (password.trim().length < 6) {
            setPasswordError('Password must be at least 6 characters');
            passwordRef.current.focus();
            return {
                isPasswordValid: false,
            };
        }

        passwordRef.current.classList.remove('is-invalid');
        passwordRef.current.classList.add('is-valid');

        return {
            isPasswordValid: true,
            password,
        };
    }

    function handleEmailChange(e: ChangeEvent<HTMLInputElement>) {
        isDirty && validateEmail();
    }

    function handlePasswordChange(e: ChangeEvent<HTMLInputElement>) {
        isDirty && validatePassword();
    }

    const navigate = useNavigate();
    async function handleSubmit(e: FormEvent) {
        e.preventDefault();
        setIsDirty(true);

        const { isPasswordValid, password } = validatePassword();
        const { isEmailValid, email } = validateEmail();

        if (isPasswordValid && isEmailValid) {
            setIsLoading(true);

            if (email && password) {
                try {
                    const response = await AuthService.signIn(email, password);

                    const resData = response.data as AuthResType;

                    const { token, refreshToken } = resData.data;

                    localStorage.setItem('token', token);
                    localStorage.setItem('refresh-token', refreshToken);

                    navigate('/');

                    setIsLoading(false);
                } catch (error: any) {
                    setIsLoading(false);

                    const err = error as AuthErrorType;

                    const { message, type } = err.response.data;

                    if (type === 'email') {
                        setEmailError(message);
                        emailRef.current.classList.add('is-invalid');
                        emailRef.current.focus();
                    }

                    if (type === 'password') {
                        setPasswordError(message);
                        passwordRef.current.classList.add('is-invalid');
                        passwordRef.current.focus();
                    }
                }
            }
        }
    }
    return (
        <div className='container' style={{ maxWidth: '400px' }}>
            <h1 className='text-center mt-5'>Sign in</h1>

            <form
                className='mt-5 needs-validation'
                onSubmit={handleSubmit}
                noValidate>
                <div className='mb-3'>
                    <label htmlFor='email' className='form-label'>
                        Email address
                    </label>
                    <input
                        ref={emailRef}
                        onChange={handleEmailChange}
                        type='email'
                        className={`form-control`}
                        id='email'
                        placeholder='Enter your email address'
                        autoFocus
                    />
                    <div className='error'>{emailError}</div>
                </div>

                <div className='mb-3'>
                    <label htmlFor='password' className='form-label'>
                        Password
                    </label>
                    <input
                        ref={passwordRef}
                        onChange={handlePasswordChange}
                        type='password'
                        className={`form-control`}
                        id='password'
                        placeholder='Enter your password'
                    />
                    <div className='error'>{passwordError}</div>
                </div>

                <ButtonSubmit isLoading={isLoading} />
            </form>
        </div>
    );
};

export default SignIn;
