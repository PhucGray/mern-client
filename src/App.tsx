import 'bootstrap/dist/css/bootstrap.min.css';
import { Route, Routes, useNavigate } from 'react-router-dom';
import SignIn from './pages/SignIn';
import SignUp from './pages/SignUp';
import Todo from './pages/Todo';
import 'material-icons/iconfont/material-icons.css';
import PrivateRoute from './routes/PrivateRoute';
import { useEffect } from 'react';

const App = () => {
    const navigate = useNavigate();

    useEffect(() => {
        const isSignedIn = localStorage.getItem('token');

        if (isSignedIn) navigate('/');
    }, []);

    return (
        <Routes>
            <Route
                path='/'
                element={
                    <PrivateRoute>
                        <Todo />
                    </PrivateRoute>
                }
            />

            <Route path='sign-up' element={<SignUp />} />
            <Route path='sign-in' element={<SignIn />} />
        </Routes>
    );
};

export default App;
