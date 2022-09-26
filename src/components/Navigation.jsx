import React from "react";
import { Switch, Route, Redirect, useLocation } from "react-router-dom";
// import SignUp from "../pages/SignUp";
// import Login from "../pages/Login";
// import Logout from "../components/Logout";
import CreateMeds from "../pages/CreateMeds";
import EditMeds from "../pages/EditMeds";
import ListMeds from "../pages/ListMeds";
import NotFound from "../pages/NotFound";
// import ListUsers from "../pages/ListUsers";
// import MyProfile from "../pages/MyProfile";
import { AdminRoute, ProtectedRoute } from "../components/ProtectedRoute";
import SearchMeds from "../pages/SearchMeds";

function Navigation() {
  let location = useLocation();
  return (
    <Switch>
      <Route exact path="/">
        <Redirect
          to={{
            pathname: "/meds",
            state: { from: location },
          }}
        />
      </Route>
      <Route exact path="/meds">
        <ListMeds />
      </Route>
      <Route exact path="/search-meds">
        <SearchMeds />
      </Route>
      {/* <Route path="/signup">
        <SignUp />
      </Route>
      <Route path="/login">
        <Login />
      </Route>
      <Route path="/logout">
        <Logout />
      </Route>
      <ProtectedRoute exact path="/users">
        <ListUsers />
      </ProtectedRoute>
      <ProtectedRoute exact path="/profile">
        <MyProfile />
      </ProtectedRoute> */}
      <Route path="/create-meds">
        <CreateMeds />
      </Route>
      <Route path="/edit-meds">
        <EditMeds />
      </Route>
      <Route path="*">
        <NotFound />
      </Route>
    </Switch>
  );
}

export default Navigation;
