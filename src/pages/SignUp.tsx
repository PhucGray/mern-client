import {
    ChangeEvent,
    FormEvent,
    MutableRefObject,
    useRef,
    useState,
} from 'react';
import ButtonSubmit from '../components/ButtonSubmit';
import { validateEmailFormat } from '../utils/validateEmailFormat';
import axios, { AxiosError } from 'axios';
import { AuthErrorType, AuthResType } from '../types';
import { Link, useNavigate } from 'react-router-dom';
import AuthService from '../services/AuthService';

const SignUp = () => {
    const [isLoading, setIsLoading] = useState(false);
    const [emailError, setEmailError] = useState('');
    const [passwordError, setPasswordError] = useState('');
    const [confirmError, setConfirmError] = useState('');

    const [isDirty, setIsDirty] = useState(false);

    const emailRef = useRef() as MutableRefObject<HTMLInputElement>;
    const passwordRef = useRef() as MutableRefObject<HTMLInputElement>;
    const confirmRef = useRef() as MutableRefObject<HTMLInputElement>;

    function validateEmail() {
        const email = emailRef.current.value;

        setEmailError('');
        emailRef.current.classList.add('is-invalid');

        if (email.trim().length === 0) {
            setEmailError('Please enter your email address');
            emailRef.current.focus();
            return { isEmailValid: false };
        }

        if (email.trim().length < 11) {
            setEmailError('Email must be at least 11 characters');
            emailRef.current.focus();
            return { isEmailValid: false };
        }

        if (!validateEmailFormat(email)) {
            setEmailError('Invalid email address');
            emailRef.current.focus();
            return { isEmailValid: false };
        }

        emailRef.current.classList.remove('is-invalid');
        emailRef.current.classList.add('is-valid');

        return { isEmailValid: true, email };
    }

    function validatePassword() {
        const password = passwordRef.current.value;

        setPasswordError('');
        passwordRef.current.classList.add('is-invalid');

        if (!password.trim()) {
            setPasswordError('Please enter your password');
            passwordRef.current.focus();
            return { isPasswordValid: false };
        }

        if (password.trim().length < 6) {
            setPasswordError('Password must be at least 6 characters');
            passwordRef.current.focus();
            return { isPasswordValid: false };
        }

        passwordRef.current.classList.remove('is-invalid');
        passwordRef.current.classList.add('is-valid');

        return { isPasswordValid: true, password };
    }

    function validateConfirmPassword() {
        const confirm = confirmRef.current.value;
        const password = passwordRef.current.value;

        setConfirmError('');
        confirmRef.current.classList.add('is-invalid');

        if (!confirm.trim()) {
            setConfirmError('Please enter your confirm password');
            confirmRef.current.focus();
            return { isConfirmValid: false };
        }

        if (confirm !== password) {
            setConfirmError('Password does not match');
            confirmRef.current.focus();
            return { isConfirmValid: false };
        }

        confirmRef.current.classList.remove('is-invalid');
        confirmRef.current.classList.add('is-valid');

        return { isConfirmValid: true, confirm };
    }

    function handleEmailChange(e: ChangeEvent<HTMLInputElement>) {
        isDirty && validateEmail();
    }

    function handlePasswordChange(e: ChangeEvent<HTMLInputElement>) {
        isDirty && validatePassword();
    }

    function handleConfirmChange(e: ChangeEvent<HTMLInputElement>) {
        isDirty && validateConfirmPassword();
    }

    const navigate = useNavigate();
    async function handleSubmit(e: FormEvent) {
        e.preventDefault();
        setIsDirty(true);

        const { isConfirmValid, confirm } = validateConfirmPassword();
        const { isPasswordValid, password } = validatePassword();
        const { isEmailValid, email } = validateEmail();

        if (isConfirmValid && isPasswordValid && isEmailValid) {
            setIsLoading(true);

            if (email && password && confirm) {
                try {
                    const response = await AuthService.signUp(email, password);

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

                    if (type === 'confirmPassword') {
                        setConfirmError(message);
                        confirmRef.current.classList.add('is-invalid');
                        confirmRef.current.focus();
                    }
                }
            }
        }
    }
    return (
        <div className='container' style={{ maxWidth: '400px' }}>
            <h1 className='text-center mt-5'>Sign up</h1>

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
                        placeholder='Enter you email address'
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

                <div className='mb-3'>
                    <label htmlFor='password' className='form-label'>
                        Confirm password
                    </label>
                    <input
                        ref={confirmRef}
                        onChange={handleConfirmChange}
                        type='password'
                        className={`form-control`}
                        id='confirm'
                        placeholder='Enter your confirm password'
                    />
                    <div className='error'>{confirmError}</div>
                </div>

                <ButtonSubmit isLoading={isLoading} />
            </form>

            <div className='mt-3 text-center'>
                Already have an account ? <Link to='/sign-in'>Sign in</Link>
            </div>
        </div>
    );
};

export default SignUp;
