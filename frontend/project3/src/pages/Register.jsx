import React, { useContext, useState, useEffect } from "react";
import useFetch from "../hooks/useFetch";
import AppContext from "../context/AppContext";
import styles from "./styles/Register.module.css";

const areas = [
  "TOTAL",
  "BEDOK",
  "BUKIT TIMAH",
  "BUKIT BATOK",
  "BUKIT MERAH",
  "CENTRAL WATER CATCHMENT",
  "DOWNTOWN CORE",
  "CHANGI",
  "CHANGI BAY",
  "LIM CHU KANG",
  "BOON LAY",
  "WESTERN WATER CATCHMENT",
  "WOODLANDS",
  "MARINE PARADE",
  "NEWTON",
  "NORTH-EASTERN ISLANDS",
  "ORCHARD",
  "PASIR RIS",
  "PIONEER",
  "PUNGGOL",
  "QUEENSTOWN",
  "SEMBAWANG",
  "SIMPANG",
  "TAMPINES",
  "TANGLIN",
  "TUAS",
  "WESTERN ISLANDS",
  "SOUTHERN ISLANDS",
  "BUKIT PANJANG",
  "BISHAN",
  "ANG MO KIO",
  "GEYLANG",
  "STRAITS VIEW",
  "JURONG EAST",
  "HOUGANG",
  "JURONG WEST",
  "CHOA CHU KANG",
  "KALLANG",
  "MANDAI",
  "TENGAH",
  "MARINA EAST",
  "MARINA SOUTH",
  "MUSEUM",
  "NOVENA",
  "OUTRAM",
  "PAYA LEBAR",
  "RIVER VALLEY",
  "ROCHOR",
  "SELETAR",
  "SENGKANG",
  "SERANGOON",
  "CLEMENTI",
  "TOA PAYOH",
  "SINGAPORE RIVER",
  "SUNGEI KADUT",
  "YISHUN",
];

const Register = () => {
  const fetchData = useFetch();
  const appCtx = useContext(AppContext);

  const [roles, setRoles] = useState([]);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [accountType, setAccountType] = useState("user");
  const [companyName, setCompanyName] = useState("");
  const [address, setAddress] = useState("");
  const [area, setArea] = useState("");
  const [description, setDescription] = useState("");
  const [image, setImage] = useState("");

  const handleChange = (event) => {
    switch (event.currentTarget.id) {
      case "email":
        setEmail(event.currentTarget.value);
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

  const getRoles = async () => {
    const res = await fetchData("/roles");
    if (res.ok) {
      setRoles(res.data);
    } else {
      appCtx.setErrorMessage(res.data);
      appCtx.isError(true);
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
      console.log(accountType);
      console.log(companyName);

      if (accountType === "merchant" && companyName)
        newUser.companyName = companyName;
      if (accountType === "merchant" && address) newUser.address = address;
      if (accountType === "merchant" && area) newUser.area = area;
      if (accountType === "merchant" && description)
        newUser.description = description;
      if (accountType === "merchant" && image) newUser.image = image;

      console.log(newUser);
      const res = await fetchData("/auth/register", "PUT", newUser, undefined);
      if (res.ok) {
        console.log("successful");
        setEmail("");
        setPassword("");
        setAccountType("");
        setCompanyName("");
        setAddress("");
        setArea("");
        setDescription("");
        setImage("");
      }
    } catch (error) {
      console.error(error.message);
      appCtx.setErrorMessage(error.message);
      appCtx.setIsError(true);
    }
  };

  useEffect(() => {
    getRoles();
  }, []);

  return (
    <>
      <div>Register</div>
      <form>
        <label htmlFor="email">
          Email<span class={styles.required}>*</span>
        </label>
        <input id="email" type="email" onChange={handleChange} />
        <label htmlFor="password">
          Password<span class={styles.required}>*</span>
        </label>
        <input id="password" type="password" onChange={handleChange} />
        <label htmlFor="user-type">
          User Type<span class={styles.required}>*</span>
        </label>
        <select defaultValue="user" id="user-type" onChange={handleChange}>
          {roles &&
            roles.map((role) => {
              return (
                <option value={role} key={role}>
                  {role}
                </option>
              );
            })}
          <option value="user">User</option>
          <option value="merchant">Merchant</option>
        </select>
        {accountType === "merchant" && (
          <>
            <label htmlFor="name">
              Company Name<span class={styles.required}>*</span>
            </label>
            <input id="name" type="text" onChange={handleChange} />
            <label htmlFor="address">
              Address<span class={styles.required}>*</span>
            </label>
            <input id="address" type="text" onChange={handleChange} />
            <label htmlFor="area">
              Area<span class={styles.required}>*</span>
            </label>
            <select defaultValue="" id="area" onChange={handleChange}>
              <option value="" disabled></option>
              {areas.map((area) => (
                <option value={area} key={area}>
                  {area}
                </option>
              ))}
            </select>
            <label htmlFor="description">
              Description<span class={styles.required}>*</span>
            </label>
            <textarea
              id="description"
              type="text"
              placeholder="Description of your business to users"
              onChange={handleChange}
            />
            <label htmlFor="image">Company Image URL</label>
            <input id="image" type="text" onChange={handleChange} />
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
