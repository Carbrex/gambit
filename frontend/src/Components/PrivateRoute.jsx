import React from 'react';
import { Route, Redirect } from 'react-router-dom';

const PrivateRoute = ({ children,...rest }) => {
  const user = localStorage.getItem('token');

  return (
    <>
    <Route
      {...rest}
      render={(props) =>
        user ? (
            {...children}
        ) : (
          <Redirect
            to={{ pathname: '/login', state: { from: props.location } }}
          />
        )
      }
    />
    </>
  );
};

export default PrivateRoute;