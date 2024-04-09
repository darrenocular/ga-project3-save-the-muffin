import React, { useContext, useState, useEffect } from "react";
import useFetch from "../hooks/useFetch";
import AppContext from "../context/AppContext";

const CartItem = (props) => {
  const fetchData = useFetch();
  const appCtx = useContext(AppContext);
  const [cartQuantity, setCartQuantity] = useState(props.cartItem.cartQuantity);
  const [isUpdating, setIsUpdating] = useState(false);
  const [isChecked, setIsChecked] = useState(true);

  const handleUpdateCartQuantity = async (event) => {
    try {
      event.preventDefault();
      const res = await fetchData(
        "/api/cart",
        "PATCH",
        {
          id: props.cartItem._id,
          cartQuantity: cartQuantity,
        },
        appCtx.accessToken
      );

      if (res.ok) {
        props.getCart();
        setIsUpdating(false);
      }
    } catch (error) {
      appCtx.setErrorMessage(error.message);
      appCtx.setIsError(true);
    }
  };

  const handleDeleteCartItem = async (event) => {
    try {
      event.preventDefault();
      const res = await fetchData(
        "/api/cart",
        "DELETE",
        { id: props.cartItem._id },
        appCtx.accessToken
      );

      if (res.ok) {
        props.getCart();
      }
    } catch (error) {
      appCtx.setErrorMessage(error.message);
      appCtx.setIsError(true);
    }
  };

  const handleChangeCartQuantity = (event) => {
    event.preventDefault();
    setCartQuantity(event.target.value);
  };

  const toggleChecked = () => {
    if (!isChecked) {
      setIsChecked(true);
      props.addItemToCheckOut(props.cartItem);
    } else {
      setIsChecked(false);
      props.removeItemToCheckOut(props.cartItem);
    }
  };

  return (
    <div className="flex justify-between items-center">
      <input
        type="checkbox"
        className="w-6 h-6 mr-4"
        checked={isChecked}
        onChange={toggleChecked}
      ></input>
      <div className="flex justify-between pr-4 rounded shadow-md my-4 w-full">
        <div className="flex min-w-0 gap-x-4 w-3/4">
          <img
            className="h-40 w-40 flex-none bg-gray-50 object-cover rounded-l"
            src={
              props.cartItem.listing.image ||
              "https://images.unsplash.com/photo-1626645738196-c2a7c87a8f58?q=80&w=2940&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D"
            }
          />
          <div className="flex flex-col justify-between py-4 w-3/4">
            <div>
              <p className="text-xl font-semibold leading-6 text-indigo-900 flex">
                {props.cartItem.listing.name}{" "}
                <span className="text-xs bg-indigo-700 text-white rounded py-1 px-2 ml-2 border-none">
                  {props.cartItem.listing.category.charAt(0).toUpperCase() +
                    props.cartItem.listing.category.slice(1)}
                </span>
              </p>
              <p className="mt-1 text-sm font-medium leading-5 text-indigo-700">
                {props.cartItem.listing.merchant.merchantDetails.name} (
                {props.cartItem.listing.merchant.merchantDetails.address})
              </p>
            </div>
            <div>
              <p className="mt-1 text-sm leading-5 text-gray-400">
                <s>S${props.cartItem.listing.originalPrice.toFixed(2)}</s>{" "}
                <span className="text-indigo-700 font-semibold">
                  S$
                  {props.cartItem.listing.discountedPrice.toFixed(2)}
                </span>
              </p>
              <p className="text-sm text-indigo-700">
                Collection:{" "}
                <span className="text-sm font-medium text-indigo-700">
                  {new Date(
                    props.cartItem.listing.collectionDate
                  ).toLocaleString("en-SG")}
                </span>
              </p>
            </div>
          </div>
        </div>
        <div className="flex flex-col py-4 pr-2 justify-between w-1/5">
          <div>
            <p className="text-sm leading-6 text-indigo-900 font-semibold">
              Quantity available: {props.cartItem.listing.quantity}
            </p>
          </div>
          <div>
            <p className="text-sm leading-6 text-indigo-900 font-semibold mb-1.5">
              Quantity in cart: {props.cartItem.cartQuantity}
            </p>
            <form className="flex justify-between">
              {isUpdating && (
                <input
                  type="number"
                  id="cartQuantity"
                  name="cartQuantity"
                  placeholder="Quantity"
                  min="0"
                  max={props.cartItem.listing.quantity}
                  value={cartQuantity}
                  className="w-2/3 rounded-md border-0 text-indigo-900 shadow-sm ring-1 ring-inset ring-indigo-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 text-sm p-2 mr-2"
                  onChange={handleChangeCartQuantity}
                />
              )}
              <button
                type="button"
                className="inline-flex w-full justify-center rounded-md bg-orange-600 px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-orange-500"
                onClick={
                  isUpdating
                    ? handleUpdateCartQuantity
                    : () => setIsUpdating(true)
                }
              >
                {isUpdating ? "Confirm" : "Update"}
              </button>
              <button
                type="button"
                className="inline-flex w-full justify-center rounded-md bg-red-600 ml-2 px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-red-500"
                onClick={
                  isUpdating ? () => setIsUpdating(false) : handleDeleteCartItem
                }
              >
                {isUpdating ? "Cancel" : "Delete"}
              </button>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CartItem;
