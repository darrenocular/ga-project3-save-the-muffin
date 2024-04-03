import React, { useContext, useState, useEffect } from "react";
import useFetch from "../hooks/useFetch";
import AppContext from "../context/AppContext";
import styles from "./styles/Register.module.css";

const Register = () => {
  const fetchData = useFetch();
  const appCtx = useContext(AppContext);

  const [roles, setRoles] = useState([]);
  const [areaList, setAreaList] = useState([]);
  const [duplicateEmailWarning, setDuplicateEmailWarning] = useState(false);

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [accountType, setAccountType] = useState("");
  const [companyName, setCompanyName] = useState("");
  const [address, setAddress] = useState("");
  const [area, setArea] = useState("");
  const [description, setDescription] = useState("");
  const [image, setImage] = useState("");

  function emailIsValid(email) {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
  }

  const handleChange = (event) => {
    switch (event.currentTarget.id) {
      case "email":
        const emailInput = event.currentTarget.value;
        setEmail(emailInput);
        emailIsValid(emailInput) ? checkDuplicateEmail(emailInput) : "";
        break;
      case "password":
        setPassword(event.currentTarget.value);
        break;
      case "user-type":
        setAccountType(event.currentTarget.value);
        break;
      case "name":
        setCompanyName(event.currentTarget.value);
        break;
      case "address":
        setAddress(event.currentTarget.value);
        break;
      case "area":
        setArea(event.currentTarget.value);
        break;
      case "description":
        setDescription(event.currentTarget.value);
        break;
      case "image":
        setImage(event.currentTarget.value);
        break;
      default:
        appCtx.setErrorMessage(
          `something went wrong! id: ${event.currentTarget.id}, value: ${event.currentTarget.value}`
        );
        appCtx.isError(true);
        break;
    }
  };

  const getRolesAndAreas = async () => {
    const res = await fetchData("/auth/enum");
    if (res.ok) {
      setRoles(res.data.accountTypes);
      setAreaList(res.data.areas);
    } else {
      appCtx.setErrorMessage(res.data);
      appCtx.isError(true);
    }
  };

  const checkDuplicateEmail = async (emailInput) => {
    try {
      const res = await fetchData(
        "/auth/check-email",
        "POST",
        { email: emailInput },
        undefined
      );

      if (res.data === "duplicate email") {
        setDuplicateEmailWarning(true);
        return;
      }

      if (res.ok) {
        setDuplicateEmailWarning(false);
      }
    } catch (error) {
      console.error(error.message);
    }
  };

  const registerUser = async (event) => {
    try {
      event.preventDefault();
      const newUser = {
        email: email,
        password: password,
        role: accountType,
      };

      if (accountType === "merchant" && companyName) newUser.name = companyName;
      if (accountType === "merchant" && address) newUser.address = address;
      if (accountType === "merchant" && area) newUser.area = area;
      if (accountType === "merchant" && description)
        newUser.description = description;
      if (accountType === "merchant" && image) newUser.image = image;

      const res = await fetchData("/auth/register", "PUT", newUser, undefined);
      if (res.ok) {
        setEmail("");
        setPassword("");
        setAccountType("");
        setCompanyName("");
        setAddress("");
        setArea("");
        setDescription("");
        setImage("");
      } else {
        throw new Error(res.data);
      }
    } catch (error) {
      console.error(error.message);
      appCtx.setErrorMessage(error.message);
      appCtx.setIsError(true);
    }
  };

  useEffect(() => {
    getRolesAndAreas();
  }, []);

  useEffect(() => {}, [accountType, duplicateEmailWarning]);

  return (
    <>
      <div>Register</div>
      <form>
        <label htmlFor="email">
          Email<span className={styles.required}>*</span>
        </label>
        <input id="email" type="email" onChange={handleChange} value={email} />
        {duplicateEmailWarning && (
          <div className={styles.required}>
            <em>Email is already registered.</em>
          </div>
        )}
        <label htmlFor="password">
          Password<span className={styles.required}>*</span>
        </label>
        <input
          id="password"
          type="password"
          onChange={handleChange}
          value={password}
        />
        <label htmlFor="user-type">
          User Type<span className={styles.required}>*</span>
        </label>
        <select id="user-type" onChange={handleChange} value={accountType}>
          <option value="" disabled>
            Select an account type
          </option>
          {roles &&
            roles.map((role) => {
              return (
                <option value={role} key={role}>
                  {role}
                </option>
              );
            })}
        </select>
        {accountType === "merchant" && (
          <>
            <label htmlFor="name">
              Company Name<span className={styles.required}>*</span>
            </label>
            <input
              id="name"
              type="text"
              onChange={handleChange}
              value={companyName}
            />
            <label htmlFor="address">
              Address<span className={styles.required}>*</span>
            </label>
            <input
              id="address"
              type="text"
              onChange={handleChange}
              value={address}
            />
            <label htmlFor="area">
              Area<span className={styles.required}>*</span>
            </label>
            <select id="area" onChange={handleChange} value={area}>
              <option value="" disabled>
                Select your area
              </option>
              {areaList.map((areaItem) => (
                <option value={areaItem} key={areaItem}>
                  {areaItem}
                </option>
              ))}
            </select>
            <label htmlFor="description">
              Description<span className={styles.required}>*</span>
            </label>
            <textarea
              id="description"
              type="text"
              placeholder="Description of your business to users"
              onChange={handleChange}
              value={description}
            />
            <label htmlFor="image">Company Image URL</label>
            <input
              id="image"
              type="text"
              onChange={handleChange}
              value={image}
            />
          </>
        )}
        <button type="submit" onClick={registerUser}>
          Create User
        </button>
      </form>
    </>
  );
};

export default Register;
