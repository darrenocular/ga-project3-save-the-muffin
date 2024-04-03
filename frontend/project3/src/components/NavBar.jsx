import React, { useContext, useEffect } from "react";
import { NavLink } from "react-router-dom";
import AppContext from "../context/AppContext";
import styles from "./styles/NavBar.module.css";

const NavBar = () => {
  const appCtx = useContext(AppContext);

  // just to see updates
  useEffect(() => {}, [
    appCtx.accessToken,
    appCtx.expirationDate,
    appCtx.role,
    appCtx.id,
  ]);

  return (
    <div>
      <div>Logo</div>
      <div>Access token: {appCtx.accessToken}</div>
      <div>
        Expiration: {appCtx.expirationDate.toLocaleString()}, Current Time:
        {new Date().toLocaleString()}
      </div>
      <div>Role: {appCtx.role}</div>
      <div>Id: {appCtx.id}</div>
      <nav>
        <NavLink
          to="/"
          className={(navData) => (navData.isActive ? styles.active : "")}
        >
          Home
        </NavLink>
        {appCtx.accessToken ? (
          <NavLink onClick={(event) => appCtx.logOut(event)}>Log out</NavLink>
        ) : (
          <NavLink
            to="/login"
            className={(navData) => (navData.isActive ? styles.active : "")}
          >
            Login
          </NavLink>
        )}
        {!appCtx.accessToken && (
          <NavLink
            to="/register"
            className={(navData) => (navData.isActive ? styles.active : "")}
          >
            Register
          </NavLink>
        )}
        {appCtx.role === "user" && (
          <NavLink
            to="/history"
            className={(navData) => (navData.isActive ? styles.active : "")}
          >
            History
          </NavLink>
        )}
        {appCtx.role === "user" && (
          <NavLink
            to="/cart"
            className={(navData) => (navData.isActive ? styles.active : "")}
          >
            Cart
          </NavLink>
        )}
        {appCtx.role === "merchant" && (
          <NavLink
            to="/listings"
            className={(navData) => (navData.isActive ? styles.active : "")}
          >
            Listings
          </NavLink>
        )}
        {appCtx.role === "merchant" && (
          <NavLink
            to="/orders"
            className={(navData) => (navData.isActive ? styles.active : "")}
          >
            Orders
          </NavLink>
        )}
      </nav>
    </div>
  );
};

export default NavBar;
