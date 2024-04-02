import React, { useState, useContext, Suspense } from "react";
import AppContext from "./context/AppContext";
import { Route, Routes } from "react-router-dom";
import "./App.css";
import NavBar from "./components/NavBar";
import ErrorModal from "./components/ErrorModal";
import ProtectedRoute from "./components/ProtectedRoute";

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
  const [accessToken, setAccessToken] = useState("X");
  const [role, setRole] = useState("user");
  const [id, setId] = useState("");
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
          id,
          setId,
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
          <Route
            path="/history"
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
            path="/orders"
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
