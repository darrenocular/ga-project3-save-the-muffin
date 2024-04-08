import React, { useState, useEffect, Suspense } from "react";
import AppContext from "./context/AppContext";
import { Route, Routes } from "react-router-dom";
import "./App.css";
import NavBar from "./components/NavBar";
import ErrorModal from "./components/ErrorModal";
import ProtectedRoute from "./components/ProtectedRoute";
import useOneMap from "./hooks/useOneMap";

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
  const fetchOneMapData = useOneMap();
  const [accessToken, setAccessToken] = useState("");
  const [role, setRole] = useState("");
  const [id, setId] = useState("");
  const [expirationDate, setExpirationDate] = useState("");
  const [showLogin, setShowLogin] = useState(true);
  const [isError, setIsError] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const [oneMapAccessToken, setOneMapAccessToken] = useState("");

  const dismissError = () => {
    setIsError(() => !isError);
  };

  const logOut = () => {
    console.log("logging out");
    setExpirationDate("");
    setAccessToken("");
    setRole("");
    setId("");
    if (localStorage.getItem("refreshToken")) {
      localStorage.removeItem("refreshToken");
    }
  };

  const getOneMapToken = async () => {
    try {
      const res = await fetchOneMapData("/api/auth/post/getToken", "POST", {
        email: import.meta.env.VITE_ONE_MAP_EMAIL,
        password: import.meta.env.VITE_ONE_MAP_PASSWORD,
      });

      if (res.ok) {
        setOneMapAccessToken(res.data.access_token);
      }
    } catch (error) {
      setLocationTailoredService(false);
      throw new Error(error.message + `. Unable to access OneMap.`);
    }
  };

  useEffect(() => {
    getOneMapToken();
  }, []);

  return (
    <Suspense>
      <AppContext.Provider
        value={{
          accessToken,
          setAccessToken,
          role,
          setRole,
          id,
          setId,
          expirationDate,
          setExpirationDate,
          showLogin,
          setShowLogin,
          isError,
          setIsError,
          errorMessage,
          setErrorMessage,
          oneMapAccessToken,
          setOneMapAccessToken,
          logOut,
        }}
      >
        <NavBar />
        <Routes>
          <Route
            path="/"
            element={
              <ProtectedRoute>
                <Home />
              </ProtectedRoute>
            }
          />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route
            path="/orders"
            element={
              <ProtectedRoute requiredRole="user">
                <Orders />
              </ProtectedRoute>
            }
          />
          <Route
            path="/cart"
            element={
              <ProtectedRoute requiredRole="user">
                <Cart />
              </ProtectedRoute>
            }
          />
          <Route
            path="/listings"
            element={
              <ProtectedRoute requiredRole="merchant">
                <ManageListings />
              </ProtectedRoute>
            }
          />
          <Route
            path="/manage-orders"
            element={
              <ProtectedRoute requiredRole="merchant">
                <MerchantManageOrders />
              </ProtectedRoute>
            }
          />
        </Routes>
        {isError && (
          <ErrorModal okayClick={dismissError} content={errorMessage} />
        )}
      </AppContext.Provider>
    </Suspense>
  );
}

export default App;
