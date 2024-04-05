import React, { useState, useEffect, useContext } from "react";
import AppContext from "../context/AppContext";
import { Navigate } from "react-router-dom";
import { jwtDecode } from "jwt-decode";
import useFetch from "../hooks/useFetch";

const ProtectedRoute = (props) => {
  const appCtx = useContext(AppContext);
  const [shouldNavigate, setShouldNavigate] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const fetchData = useFetch();

  const refreshAccessToken = async () => {
    try {
      const refreshToken = localStorage.getItem("refreshToken");
      if (refreshToken) {
        console.log("found refresh token");
        const res = await fetchData("/auth/refresh", "POST", {
          refresh: refreshToken,
        });

        if (res.ok) {
          appCtx.setAccessToken(res.data.access);
          const decoded = jwtDecode(res.data.access);
          const expirationDate = new Date(decoded.exp * 1000);
          appCtx.setExpirationDate(expirationDate);
          appCtx.setId(decoded.id);
          appCtx.setRole(decoded.role);
          appCtx.setShowLogin(false);
          return true;
        } else {
          // log out and redirect to login because refresh token has expired
          console.log("refresh failed, redirecting to login.");
          appCtx.logOut();
          appCtx.setShowLogin(true);
        }
      } else {
        // log out because no refresh token was found
        console.log("no refresh token");
        appCtx.logOut();
        appCtx.setShowLogin(true);
      }
    } catch (error) {
      console.error(error.message);
      appCtx.logOut();
    }
  };

  const checkAndRefreshToken = async () => {
    if (
      (appCtx.expirationDate && appCtx.expirationDate < Date.now()) ||
      (localStorage.getItem("refreshToken") && !appCtx.accessToken)
    ) {
      console.log("refreshing token");
      const refreshed = await refreshAccessToken();
      if (!refreshed) {
        appCtx.setShowLogin(true);
      }
    }
    setIsLoading(false);
  };

  useEffect(() => {
    // if user role is not the same as requiredRole, show an error modal that lasts for three seconds before navigating to home page.
    if (props.requiredRole && appCtx.role !== props.requiredRole) {
      const timer = setTimeout(() => {
        appCtx.setErrorMessage("404 Forbidden, redirecting in 3 seconds.");
        appCtx.setIsError(true);
        setTimeout(() => {
          setShouldNavigate(true);
        }, 3000);
      }, 1000);

      return () => {
        clearTimeout(timer);
        appCtx.setIsError(false);
      };
    }
  }, [props.requiredRole, appCtx.role]);

  useEffect(() => {
    checkAndRefreshToken();
  }, []);

  useEffect(() => {}, [appCtx.showLogin]);

  if (isLoading) {
    return <div>Loading...</div>;
  }

  // if no access token is provided when accessing the children page or refresh token expired, immediately redirect user to login.
  // else if above useEffect determines that account role !== required role, navigate to home page
  if (!appCtx.accessToken || appCtx.showLogin) {
    return <Navigate to="/login" replace />;
  } else if (shouldNavigate) {
    return <Navigate to="/" replace />;
  }

  return props.children;
};

export default ProtectedRoute;
