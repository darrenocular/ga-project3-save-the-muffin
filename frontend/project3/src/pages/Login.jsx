import React, { useState, useContext, useEffect } from "react";
import useFetch from "../hooks/useFetch";
import AppContext from "../context/AppContext";
import { jwtDecode } from "jwt-decode";
import { useNavigate } from "react-router-dom";

const Login = () => {
  const fetchData = useFetch();
  const appCtx = useContext(AppContext);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();

  const handleLogin = async (event) => {
    try {
      event.preventDefault();
      const res = await fetchData(
        "/auth/login",
        "POST",
        { email: email, password: password },
        undefined
      );

      if (res.ok) {
        appCtx.setAccessToken(res.data.access);
        const decoded = jwtDecode(res.data.access);
        const expirationDate = new Date(decoded.exp * 1000);
        appCtx.setExpirationDate(expirationDate);
        appCtx.setId(decoded.id);
        appCtx.setRole(decoded.role);
        localStorage.setItem("refreshToken", res.data.refresh);
        setEmail("");
        setPassword("");
        navigate("/");
      }
    } catch (error) {
      appCtx.setErrorMessage(error.message);
      appCtx.setIsError(true);
    }
  };

  useEffect(() => {
    appCtx.setShowLogin(false);
  }, []);

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
            Log in to your account
          </h2>
        </div>

        <div className="mt-10">
          <form className="space-y-6 w-4/5 mx-auto">
            <div>
              <label
                htmlFor="email"
                className="block text-sm font-medium leading-6 text-indigo-900"
              >
                Email address
              </label>
              <input
                id="email"
                name="email"
                type="email"
                autoComplete="email"
                placeholder="example@email.com"
                onChange={(event) => setEmail(event.target.value)}
                value={email}
                className="block w-full rounded-md border-0 py-1.5 text-indigo-900 shadow-sm ring-1 ring-inset ring-indigo-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 mt-2 text-sm p-2"
                required
              />
            </div>
            <div>
              <div className="flex items-center justify-between">
                <label
                  htmlFor="password"
                  className="block text-sm font-medium leading-6 text-indigo-900"
                >
                  Password
                </label>
                <div className="text-sm">
                  <a
                    href="#"
                    className="font-semibold text-indigo-600 hover:text-indigo-500"
                  >
                    Forgot password?
                  </a>
                </div>
              </div>
              <input
                id="password"
                name="password"
                type="password"
                autoComplete="current-password"
                placeholder="********"
                onChange={(event) => setPassword(event.target.value)}
                value={password}
                className="block w-full rounded-md border-0 py-1.5 text-indigo-900 shadow-sm ring-1 ring-inset ring-indigo-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 mt-2 text-sm p-2"
                required
              />
            </div>

            <div>
              <button
                type="submit"
                className="flex w-full justify-center rounded-md bg-indigo-600 px-3 py-1.5 text-sm font-semibold leading-6 text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
                onClick={handleLogin}
              >
                Log in
              </button>
            </div>
          </form>

          <p className="mt-10 text-center text-sm text-gray-500">
            Not a member?
            <a
              href="/register"
              className="font-semibold leading-6 text-indigo-600 hover:text-indigo-500"
            >
              {" "}
              Create an account now!
            </a>
          </p>
        </div>
      </div>
    </>
  );
};

export default Login;
