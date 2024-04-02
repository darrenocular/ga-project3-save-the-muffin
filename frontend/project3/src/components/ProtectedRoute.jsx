import React, { useState, useEffect, useContext } from "react";
import AppContext from "../context/AppContext";
import { Navigate } from "react-router-dom";

const ProtectedRoute = (props) => {
  const appCtx = useContext(AppContext);
  const [shouldNavigate, setShouldNavigate] = useState(false);

  useEffect(() => {
    // if user role is not the same as requiredRole, show an error modal that lasts for three seconds before navigating to home page.
    if (props.requiredRole && appCtx.role !== props.requiredRole) {
      appCtx.setErrorMessage("404 Forbidden, redirecting in 3 seconds.");
      appCtx.setIsError(true);
      const timer = setTimeout(() => {
        setShouldNavigate(true);
      }, 3000);

      return () => {
        clearTimeout(timer);
        appCtx.setIsError(false);
      };
    }
  }, [props.requiredRole, appCtx.role]);

  // if no access token is provided when accessing the children page, immediately redirect user to login.
  // else if above useEffect determines that account role !== required role, navigate to home page
  if (!appCtx.accessToken) {
    return <Navigate to="/login" replace />;
  } else if (shouldNavigate) {
    return <Navigate to="/" replace />;
  }

  return props.children;
};

export default ProtectedRoute;
