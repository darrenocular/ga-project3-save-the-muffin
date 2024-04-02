import React, { useState, useContext } from "react";
import useFetch from "../hooks/useFetch";
import AppContext from "../context/AppContext";
import { jwtDecode } from "jwt-decode";
import styles from "./styles/Login.module.css";

const Login = () => {
  const fetchData = useFetch();
  const appCtx = useContext(AppContext);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const handleLogin = async () => {
    try {
      const res = await fetchData(
        "/auth/login",
        "POST",
        { email: email, password: password },
        undefined
      );

      if (res.ok) {
        appCtx.setAccessToken(res.data.access);
        const decoded = jwtDecode(res.data.access);
        appCtx.setId(decoded.id);
        appCtx.setRole(decoded.role);
      }
    } catch (error) {
      appCtx.setErrorMessage(JSON.stringify(res.data));
      appCtx.isError(true);
    }
  };

  return (
    <>
      <div>Login</div>
      <form>
        <label htmlFor="email">Email</label>
        <input
          id="email"
          type="email"
          placeholder="example@email.com"
          onChange={(event) => setEmail(event.target.value)}
          required
        />
        <label htmlFor="password">Password</label>
        <input
          id="password"
          type="password"
          onChange={(event) => setPassword(event.target.value)}
          required
        />
        <p>
          Don't have an account yet? <a href="/register">Create an account</a>
          now!
        </p>
        <button type="submit" onClick={handleLogin}>
          Login
        </button>
      </form>
    </>
  );
};

export default Login;
