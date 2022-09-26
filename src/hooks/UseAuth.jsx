import { useState, useEffect } from "react";

export var auth = { status: null, login: null, logout: null };

const useAuth = () => {
  const [inited, setInited] = useState(false);
  const [loggedIn, setLoggedIn] = useState(false);
  const [isAdmin, setIsAdmin] = useState(false);
  const [jwt, setJwt] = useState(null);
  const [userId, setUserId] = useState(null);
  const [userName, setUserName] = useState(null);
  const [email, setEmail] = useState(null);
  const [expires, setExpires] = useState(null);

  const initStatus = () => {
    const storedJwt = sessionStorage.getItem("token");
    if (storedJwt) {
      setLoggedIn(true);
      setJwt(storedJwt);
      setUserId(sessionStorage.getItem("userId"));
      setUserName(sessionStorage.getItem("userName"));
      setEmail(sessionStorage.getItem("email"));
      setExpires(sessionStorage.getItem("expires"));
      let a = sessionStorage.getItem("admin");
      setIsAdmin(a === true || a === "true");
    }
    setInited(true);
  };

  useEffect(() => {
    initStatus();
  }, []);

  const logInStatus = () => {
    if (!inited) {
      initStatus();
    }

    if (loggedIn && expires) {
      let now = new Date();
      if (now > expires) {
        console.log("login expired:", now, ">", expires);
        logMeOut();
      }
    }

    return { loggedIn, jwt, userId, userName, email, isAdmin, expires };
  };

  const logMeIn = ({
    token: j,
    user: id,
    name: n,
    email: e,
    admin: a,
    maxAge: secs,
  }) => {
    if (j) {
      let exp = new Date(new Date().getTime() + secs * 1000);
      sessionStorage.setItem("token", j);
      sessionStorage.setItem("userId", id);
      sessionStorage.setItem("userName", n);
      sessionStorage.setItem("email", e);
      sessionStorage.setItem("admin", a);
      sessionStorage.setItem("expires", exp);

      setJwt(j);
      setUserId(id);
      setUserName(n);
      setEmail(e);
      setExpires(exp);
      setIsAdmin(a === true || a === "true");
      setLoggedIn(true);
    } else {
      logMeOut();
    }
  };

  const logMeOut = () => {
    sessionStorage.removeItem("token");
    sessionStorage.removeItem("userId");
    sessionStorage.removeItem("userName");
    sessionStorage.removeItem("email");
    sessionStorage.removeItem("expires");
    sessionStorage.removeItem("admin");

    setLoggedIn(false);
    setJwt(null);
    setUserId(null);
    setUserName(null);
    setEmail(null);
    setIsAdmin(false);
  };

  auth = { status: logInStatus, login: logMeIn, logout: logMeOut };
};

export default useAuth;
