import 'bootstrap/dist/css/bootstrap.min.css';
import { Route, Routes } from 'react-router-dom';
import SignIn from './pages/SignIn';
import SignUp from './pages/SignUp';
import Todo from './pages/Todo';
import 'material-icons/iconfont/material-icons.css';
import PrivateRoute from './routes/PrivateRoute';

const App = () => {
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
