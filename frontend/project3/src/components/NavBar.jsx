import React, { useContext, useEffect } from "react";
import { NavLink } from "react-router-dom";
import AppContext from "../context/AppContext";

const NavBar = () => {
  const appCtx = useContext(AppContext);

  // just to see updates
  useEffect(() => {}, [
    appCtx.accessToken,
    appCtx.expirationDate,
    appCtx.role,
    appCtx.id,
  ]);

  return (
    <div>
      <div>Access token: {appCtx.accessToken}</div>
      <div>
        Expiration: {appCtx.expirationDate.toLocaleString()}, Current Time:
        {new Date().toLocaleString()}
      </div>
      <div>Role: {appCtx.role}</div>
      <div>Id: {appCtx.id}</div>
      <nav className="bg-indigo-800 h-16 flex items-center justify-between">
        <div className="flex flex-1 items-center justify-start">
          <div className="flex flex-shrink-0 items-center">
            <img
              className="h-8 w-auto mx-4"
              src="https://tailwindui.com/img/logos/mark.svg?color=indigo&shade=500"
              alt="Save The Muffin"
            />
          </div>
          <div className="flex space-x-4">
            <NavLink
              to="/"
              className={(navData) =>
                navData.isActive
                  ? "bg-indigo-900 text-white rounded-md px-3 py-2 text-sm font-medium"
                  : "text-indigo-300 hover:bg-indigo-700 hover:text-white rounded-md px-3 py-2 text-sm font-medium"
              }
            >
              Home
            </NavLink>
            {appCtx.role === "user" && (
              <NavLink
                to="/history"
                className={(navData) =>
                  navData.isActive
                    ? "bg-indigo-900 text-white rounded-md px-3 py-2 text-sm font-medium"
                    : "text-indigo-300 hover:bg-indigo-700 hover:text-white rounded-md px-3 py-2 text-sm font-medium"
                }
              >
                History
              </NavLink>
            )}
            {appCtx.role === "user" && (
              <NavLink
                to="/cart"
                className={(navData) =>
                  navData.isActive
                    ? "bg-indigo-900 text-white rounded-md px-3 py-2 text-sm font-medium"
                    : "text-indigo-300 hover:bg-indigo-700 hover:text-white rounded-md px-3 py-2 text-sm font-medium"
                }
              >
                Cart
              </NavLink>
            )}
            {appCtx.role === "merchant" && (
              <NavLink
                to="/listings"
                className={(navData) =>
                  navData.isActive
                    ? "bg-indigo-900 text-white rounded-md px-3 py-2 text-sm font-medium"
                    : "text-indigo-300 hover:bg-indigo-700 hover:text-white rounded-md px-3 py-2 text-sm font-medium"
                }
              >
                Listings
              </NavLink>
            )}
            {appCtx.role === "merchant" && (
              <NavLink
                to="/orders"
                className={(navData) =>
                  navData.isActive
                    ? "bg-indigo-900 text-white rounded-md px-3 py-2 text-sm font-medium"
                    : "text-indigo-300 hover:bg-indigo-700 hover:text-white rounded-md px-3 py-2 text-sm font-medium"
                }
              >
                Orders
              </NavLink>
            )}
          </div>
        </div>
        <div className="flex space-x-4 mr-4">
          {appCtx.accessToken ? (
            <NavLink
              onClick={(event) => appCtx.logOut(event)}
              className="text-indigo-300 hover:bg-indigo-700 hover:text-white rounded-md px-3 py-2 text-sm font-medium"
            >
              Log out
            </NavLink>
          ) : (
            <NavLink
              to="/login"
              className={(navData) =>
                navData.isActive
                  ? "bg-indigo-900 text-white rounded-md px-3 py-2 text-sm font-medium"
                  : "text-indigo-300 hover:bg-indigo-700 hover:text-white rounded-md px-3 py-2 text-sm font-medium"
              }
            >
              Login
            </NavLink>
          )}
          {!appCtx.accessToken && (
            <NavLink
              to="/register"
              className={(navData) =>
                navData.isActive
                  ? "bg-indigo-900 text-white rounded-md px-3 py-2 text-sm font-medium"
                  : "text-indigo-300 hover:bg-indigo-700 hover:text-white rounded-md px-3 py-2 text-sm font-medium"
              }
            >
              Register
            </NavLink>
          )}
        </div>
      </nav>
    </div>
  );
};

export default NavBar;
