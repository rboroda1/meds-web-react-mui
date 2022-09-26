import React, { useEffect } from "react";
import { Redirect } from "react-router-dom";
import { auth } from "../hooks/UseAuth";
import { baseUrl } from "../utilities/Global";

const Logout = () => {
  const webLogout = async () => {
    await fetch(`${baseUrl}/auth/logout`);
  };

  useEffect(() => {
    // This is not necessary when the app is not able to receive cookies.
    // The cookies are only accepted from the app's own loading site.
    // The cookies are not accpeted from REST API if it is running
    // on another server.
    webLogout();

    // Clear the login info from local storage
    auth.logout();
  }, []);

  return <Redirect to="/" push={true} />;
};

export default Logout;
