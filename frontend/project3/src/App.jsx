import React, { useState, useContext, Suspense } from "react";
import AppContext from "./context/AppContext";
import { Route, Routes } from "react-router-dom";
import "./App.css";
import NavBar from "./components/NavBar";
import ErrorModal from "./components/ErrorModal";

const Home = React.lazy(() => import("./pages/Home"));
const Login = React.lazy(() => import("./pages/Login"));
const Register = React.lazy(() => import("./pages/Register"));
const Orders = React.lazy(() => import("./pages/Orders"));
const Cart = React.lazy(() => import("./pages/Cart"));
const ManageListings = React.lazy(() => import("./pages/ManageListings"));
const MerchantManageOrders = React.lazy(() =>
  import("./pages/MerchantManageOrders")
);

function App() {
  const [accessToken, setAccessToken] = useState("");
  const [role, setRole] = useState("");
  const [showLogin, setShowLogin] = useState(true);
  const [isError, setIsError] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");

  const dismissError = () => {
    setIsError(() => !isError);
  };

  return (
    <Suspense>
      <AppContext.Provider
        value={{
          accessToken,
          setAccessToken,
          role,
          setRole,
          showLogin,
          setShowLogin,
          isError,
          setIsError,
          errorMessage,
          setErrorMessage,
        }}
      >
        <NavBar />
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/history" element={<Orders />} />
          <Route path="/cart" element={<Cart />} />
          <Route path="/listings" element={<ManageListings />} />
          <Route path="/orders" element={<MerchantManageOrders />} />
        </Routes>
        {isError && (
          <ErrorModal okayClick={dismissError} content={errorMessage} />
        )}
      </AppContext.Provider>
    </Suspense>
  );
}

export default App;
