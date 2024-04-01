import React, { useState } from "react";
import styles from "./styles/Register.module.css";

const Register = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [userType, setUserType] = useState("");

  return (
    <>
      <div>Register</div>
    </>
  );
};

export default Register;
