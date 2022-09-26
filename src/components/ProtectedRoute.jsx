import React from "react";
import { Route, Redirect } from "react-router-dom";
import { auth } from "../hooks/UseAuth";
import NotFound from "../pages/NotFound";

function AdminRoute({ children, ...rest }) {
  const { isAdmin } = auth.status();

  return <Route {...rest} render={() => (isAdmin ? children : <NotFound />)} />;
}

function ProtectedRoute({ children, ...rest }) {
  const { loggedIn } = auth.status();

  return (
    <Route
      {...rest}
      render={({ location }) => {
        return loggedIn ? (
          children
        ) : (
          <Redirect
            to={{
              pathname: "/login",
              state: { from: location },
            }}
          />
        );
      }}
    />
  );
}

export { AdminRoute, ProtectedRoute };
