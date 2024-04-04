import React, { useContext, useState, useEffect } from "react";
import CartItem from "../components/CartItem";
import useFetch from "../hooks/useFetch";
import AppContext from "../context/AppContext";

const Cart = () => {
  const fetchData = useFetch();
  const appCtx = useContext(AppContext);
  const [cart, setCart] = useState([]);

  const getCart = async () => {
    try {
      const res = await fetchData(
        "/api/cart",
        "POST",
        { user: appCtx.id },
        appCtx.accessToken
      );

      if (res.ok) {
        setCart(res.data);
      } else {
        throw new Error(res.data);
      }
    } catch (error) {
      appCtx.setErrorMessage(error.message);
      appCtx.setIsError(true);
    }
  };

  const handleCheckOut = async () => {};

  // Get cart by user id on mount
  useEffect(() => {
    getCart();
  }, []);

  return (
    <div className="mx-auto w-90 px-4 py-4 flex flex-col">
      <h2 className="text-xl font-bold tracking-tight text-indigo-900 mx-auto">
        Cart
      </h2>
      <div className="w-full">
        {cart.map((cartItem, idx) => {
          return <CartItem cartItem={cartItem} key={idx} getCart={getCart} />;
        })}
      </div>
      <button
        type="button"
        className="w-1/6 mx-auto rounded-md bg-green-600 px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-green-500"
        onClick={handleCheckOut}
      >
        Check out
      </button>
    </div>
  );
};

export default Cart;
