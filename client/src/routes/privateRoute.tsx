import React, {Route, Redirect} from 'react-router-dom';
import {useAuth} from '../context/authContext';

const PrivateRoute = ({component: Component, roles, ...rest}: any) => {
  const {isAuthenticated, user} = useAuth();
  return (
    <Route
      {...rest}
      render={(props): any => {
        if (!isAuthenticated) {
          return (
            <Redirect to={{pathname: '/', state: {from: props.location}}} />
          );
        }

        if (!roles.includes(user.role)) {
          return (
            <Redirect to={{pathname: '/', state: {from: props.location}}} />
          );
        }
        return <Component {...props} />;
      }}
    />
  );
};

export default PrivateRoute;
