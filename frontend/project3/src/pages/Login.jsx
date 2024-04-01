import React, { useState } from "react";
import styles from "./styles/Login.module.css";

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  return (
    <>
      <div>Login</div>
    </>
  );
};

export default Login;
