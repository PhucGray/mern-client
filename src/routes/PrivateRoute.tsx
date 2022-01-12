import { FC } from 'react';
import { Navigate, useLocation } from 'react-router-dom';

const PrivateRoute: FC = ({ children }) => {
    const isSignedIn = localStorage.getItem('token');
    const location = useLocation();

    if (!isSignedIn)
        return <Navigate to='/sign-in' state={{ from: location }} replace />;

    return <>{children}</>;
};

export default PrivateRoute;
