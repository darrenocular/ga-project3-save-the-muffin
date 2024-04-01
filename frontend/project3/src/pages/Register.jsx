import React, { useContext, useState } from "react";
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
      case "name":
        setCompanyName(event.currentTarget.value);
      case "address":
        setAddress(event.currentTarget.value);
      case "area":
        setArea(event.currentTarget.value);
      case "description":
        setDescription(event.currentTarget.value);
      case "image":
        setImage(event.currentTarget.value);
      default:
        alert(
          `something went wrong! id: ${event.currentTarget.id}, value: ${event.currentTarget.value}`
        );
    }

    setAccountType(event.currentTarget.value);
  };

  const createUser = async (event) => {
    try {
      event.preventDefault();
      const newUser = {
        email: email,
        password: password,
        role: accountType,
      };

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
      }
    } catch (error) {
      console.error(error.message);
      appCtx.setErrorMessage(error.message);
      appCtx.setIsError(true);
    }
  };

  return (
    <>
      <div>Register</div>
      <form>
        <label htmlFor="email">Email</label>
        <input id="email" type="email" />
        <label htmlFor="password">Password</label>
        <input id="password" type="password" />
        <label htmlFor="user-type">User Type</label>
        <select defaultValue="user" id="user-type" onChange={handleChange}>
          <option value="user">User</option>
          <option value="merchant">Merchant</option>
        </select>
        {accountType === "merchant" && (
          <>
            <label htmlFor="name">Company Name</label>
            <input id="name" type="text" />
            <label htmlFor="address">Address</label>
            <input id="address" type="text" />
            <label htmlFor="area">Area</label>
            <select defaultValue="" id="area">
              <option value="" disabled></option>
              {areas.map((area) => (
                <option value={area} key={area}>
                  {area}
                </option>
              ))}
            </select>
            <label htmlFor="description">Description</label>
            <textarea
              id="description"
              type="text"
              placeholder="Description of your business to users"
            />
            <label htmlFor="image">Image URL</label>
            <input id="image" type="text" />
          </>
        )}
        <button onClick={createUser}>Create User</button>
      </form>
    </>
  );
};

export default Register;
