import React, { useContext, useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import useFetch from "../hooks/useFetch";
import AppContext from "../context/AppContext";
import useOneMap from "../hooks/useOneMap";
import SearchBar from "../components/SearchBar";

const Register = () => {
  const fetchData = useFetch();
  const fetchOneMapData = useOneMap();
  const appCtx = useContext(AppContext);
  const navigate = useNavigate();

  const [roles, setRoles] = useState([]);
  const [areaList, setAreaList] = useState([]);
  const [duplicateEmailWarning, setDuplicateEmailWarning] = useState(false);
  const [clearSearchText, setClearSearchText] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [accountType, setAccountType] = useState("");
  const [companyName, setCompanyName] = useState("");
  const [address, setAddress] = useState("");
  const [area, setArea] = useState("");
  const [description, setDescription] = useState("");
  const [image, setImage] = useState("");
  const [latitude, setLatitude] = useState("");
  const [longitude, setLongitude] = useState("");

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
      case "latitude":
        setLatitude(event.currentTarget.value);
        break;
      case "longitude":
        setLongitude(event.currentTarget.value);
        break;
      default:
        appCtx.setErrorMessage(
          `something went wrong! id: ${event.currentTarget.id}, value: ${event.currentTarget.value}`
        );
        appCtx.isError(true);
        break;
    }
  };

  const setLocation = (selectedAddress) => {
    setAddress(selectedAddress.ADDRESS);
    setLatitude(parseFloat(selectedAddress.LATITUDE));
    setLongitude(parseFloat(selectedAddress.LONGITUDE));
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
      if (accountType === "merchant" && latitude) newUser.latitude = latitude;
      if (accountType === "merchant" && longitude)
        newUser.longitude = longitude;

      if (accountType === "merchant" && latitude && longitude) {
        console.log(typeof latitude);
        console.log(typeof longitude);
      }

      console.log(newUser);

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
        setLatitude("");
        setLongitude("");
        navigate("/");
      } else {
        throw new Error(res.data);
      }
    } catch (error) {
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
      <div className="flex min-h-full flex-col justify-center px-6 py-12">
        <div>
          <img
            className="mx-auto h-10 w-auto"
            src="https://tailwindui.com/img/logos/mark.svg?color=indigo&shade=600"
            alt="Save The Muffin"
          />
          <h2 className="mt-10 text-center text-2xl font-bold leading-9 tracking-tight text-indigo-900">
            Register for an account
          </h2>
        </div>
        <div className="mt-10">
          <form className="space-y-6 w-4/5 mx-auto">
            <div>
              <label
                htmlFor="email"
                className="block text-sm font-medium leading-6 text-indigo-900"
              >
                Email<span className="text-red-600">*</span>
              </label>
              <input
                id="email"
                name="email"
                type="email"
                autoComplete="email"
                placeholder="example@email.com"
                onChange={handleChange}
                value={email}
                className="block w-full rounded-md border-0 py-1.5 text-indigo-900 shadow-sm ring-1 ring-inset ring-indigo-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 mt-2 text-sm p-2"
                required
              />
              {duplicateEmailWarning && (
                <div className="text-red-600">
                  <em>Email is already registered.</em>
                </div>
              )}
            </div>
            <div>
              <label
                htmlFor="password"
                className="block text-sm font-medium leading-6 text-indigo-900"
              >
                Password<span className="text-red-600">*</span>
              </label>
              <input
                id="password"
                name="password"
                type="password"
                autoComplete="current-password"
                placeholder="********"
                onChange={handleChange}
                value={password}
                className="block w-full rounded-md border-0 py-1.5 text-indigo-900 shadow-sm ring-1 ring-inset ring-indigo-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 mt-2 text-sm p-2"
                required
              />
            </div>
            <div>
              <label
                htmlFor="user-type"
                className="block text-sm font-medium leading-6 text-indigo-900"
              >
                User Type<span className="text-red-600">*</span>
              </label>
              <select
                id="user-type"
                name="user-type"
                onChange={handleChange}
                value={accountType}
                className="block w-full rounded-md border-0 py-1.5 text-indigo-900 shadow-sm ring-1 ring-inset ring-indigo-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 mt-2 text-sm p-2"
                required
              >
                <option value="" disabled>
                  Select an account type
                </option>
                {roles &&
                  roles.map((role) => {
                    return (
                      <option value={role} key={role}>
                        {role.toUpperCase()}
                      </option>
                    );
                  })}
              </select>
            </div>
            {accountType === "merchant" && (
              <>
                <div>
                  <label
                    htmlFor="name"
                    className="block text-sm font-medium leading-6 text-indigo-900"
                  >
                    Company Name<span className="text-red-600">*</span>
                  </label>
                  <input
                    id="name"
                    name="name"
                    type="text"
                    onChange={handleChange}
                    value={companyName}
                    className="block w-full rounded-md border-0 py-1.5 text-indigo-900 shadow-sm ring-1 ring-inset ring-indigo-300 focus:ring-2 focus:ring-inset focus:ring-indigo-600 mt-2 text-sm p-2"
                    required
                  />
                </div>
                <div>
                  <label
                    htmlFor="search"
                    className="block text-sm font-medium leading-6 text-indigo-900"
                  >
                    Search for the nearest address to your collection point
                    <span className="text-red-600">*</span>
                  </label>
                  <SearchBar
                    liftClick={setLocation}
                    clearSearchText={clearSearchText}
                    setClearSearchText={setClearSearchText}
                  />
                </div>
                <div>
                  <label
                    htmlFor="latitude"
                    className="block text-sm font-medium leading-6 text-indigo-900"
                  >
                    Latitude
                    <span className="text-red-600">*</span>
                    <span className=" pl-5 text-sm text-gray-400">
                      Set by selected search result
                    </span>
                  </label>
                  <input
                    id="latitude"
                    name="latitude"
                    type="number"
                    onChange={handleChange}
                    value={latitude}
                    className="block w-full rounded-md border-0 py-1.5 text-indigo-900 shadow-sm ring-1 ring-inset ring-indigo-300 focus:ring-2 focus:ring-inset focus:ring-indigo-600 mt-2 text-sm p-2"
                    required
                    disabled
                  />
                </div>
                <div>
                  <label
                    htmlFor="longitude"
                    className="block text-sm font-medium leading-6 text-indigo-900"
                  >
                    Longitude
                    <span className="text-red-600">*</span>
                    <span className=" pl-5 text-sm text-gray-400">
                      Set by selected search result
                    </span>
                  </label>
                  <input
                    id="longitude"
                    name="longitude"
                    type="number"
                    onChange={handleChange}
                    value={longitude}
                    className="block w-full rounded-md border-0 py-1.5 text-indigo-900 shadow-sm ring-1 ring-inset ring-indigo-300 focus:ring-2 focus:ring-inset focus:ring-indigo-600 mt-2 text-sm p-2"
                    required
                    disabled
                  />
                </div>
                <div>
                  <label
                    htmlFor="address"
                    className="block text-sm font-medium leading-6 text-indigo-900"
                  >
                    Address<span className="text-red-600">*</span>
                  </label>
                  <input
                    id="address"
                    name="address"
                    type="text"
                    placeholder="Modify address as required"
                    onChange={handleChange}
                    value={address}
                    className="block w-full rounded-md border-0 py-1.5 text-indigo-900 shadow-sm ring-1 ring-inset ring-indigo-300 focus:ring-2 focus:ring-inset focus:ring-indigo-600 mt-2 text-sm p-2"
                    required
                  />
                </div>
                <div>
                  <label
                    htmlFor="area"
                    className="block text-sm font-medium leading-6 text-indigo-900"
                  >
                    Area<span className="text-red-600">*</span>
                  </label>
                  <select
                    id="area"
                    name="area"
                    onChange={handleChange}
                    value={area}
                    className="block w-full rounded-md border-0 py-1.5 text-indigo-900 shadow-sm ring-1 ring-inset ring-indigo-300 focus:ring-2 focus:ring-inset focus:ring-indigo-600 mt-2 text-sm p-2"
                    required
                  >
                    <option value="" disabled>
                      Select your area
                    </option>
                    {areaList.map((areaItem) => (
                      <option value={areaItem} key={areaItem}>
                        {areaItem}
                      </option>
                    ))}
                  </select>
                </div>
                <div>
                  <label
                    htmlFor="description"
                    className="block text-sm font-medium leading-6 text-indigo-900"
                  >
                    Description<span className="text-red-600">*</span>
                  </label>
                  <textarea
                    id="description"
                    name="description"
                    type="text"
                    placeholder="Description of your business to users"
                    onChange={handleChange}
                    value={description}
                    className="block w-full rounded-md border-0 py-1.5 text-indigo-900 shadow-sm ring-1 ring-inset ring-indigo-300 focus:ring-2 focus:ring-inset focus:ring-indigo-600 mt-2 text-sm p-2"
                    required
                  />
                </div>
                <div>
                  <label
                    htmlFor="image"
                    className="block text-sm font-medium leading-6 text-indigo-900"
                  >
                    Company Image URL
                  </label>
                  <input
                    id="image"
                    name="image"
                    type="text"
                    onChange={handleChange}
                    value={image}
                    className="block w-full rounded-md border-0 py-1.5 text-indigo-900 shadow-sm ring-1 ring-inset ring-indigo-300 focus:ring-2 focus:ring-inset focus:ring-indigo-600 mt-2 text-sm p-2"
                    required
                  />
                </div>
              </>
            )}
            <div>
              <button
                type="submit"
                className="flex w-full justify-center rounded-md bg-indigo-600 px-3 py-1.5 text-sm font-semibold leading-6 text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
                onClick={registerUser}
              >
                Register
              </button>
            </div>
          </form>
        </div>
      </div>
    </>
  );
};

export default Register;
