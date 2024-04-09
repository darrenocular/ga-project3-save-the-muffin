import React, { useState, useContext } from "react";
import ReactDOM from "react-dom";
import useFetch from "../hooks/useFetch";
import AppContext from "../context/AppContext";

const Overlay = (props) => {
  const [quantity, setQuantity] = useState(1);
  const fetchData = useFetch();
  const appCtx = useContext(AppContext);

  const handleAddToCart = async (event) => {
    try {
      event.preventDefault();
      const res = await fetchData(
        "/api/cart",
        "PUT",
        {
          user: appCtx.id,
          listing: props.listing._id,
          cartQuantity: quantity,
        },
        appCtx.accessToken
      );

      if (res.ok) {
        setQuantity(0);
        props.okayClick();
      } else {
        throw new Error(res.data);
      }
    } catch (error) {
      appCtx.setErrorMessage(res.data);
      appCtx.isError(true);
    }
  };

  const handleChangeQuantity = (event) => {
    event.preventDefault();
    setQuantity(event.target.value);
  };

  return (
    <div
      className="fixed inset-0 bg-gray-500 bg-opacity-75 transition-opacity z-10"
      onClick={props.okayClick}
    >
      <div
        className="mt-20 z-10 w-3/5 mx-auto overflow-y-auto"
        onClick={(event) => event.stopPropagation()}
      >
        <div className="flex flex-col min-h-full overflow-hidden rounded-lg bg-white text-left shadow-xl transition-all">
          <img
            className="object-cover rounded-t h-96"
            src={
              props.listing.image ||
              "https://images.unsplash.com/photo-1626645738196-c2a7c87a8f58?q=80&w=2940&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D"
            }
          />
          <div className="mt-4 bg-white px-4 pb-4">
            <h3
              className="text-xl font-bold leading-6 text-indigo-900 flex items-center"
              id="modal-title"
            >
              {props.listing.name}
              <span className="text-xs bg-indigo-700 text-white rounded py-1 px-2 ml-2 border-none">
                {props.listing.category.charAt(0).toUpperCase() +
                  props.listing.category.slice(1)}
              </span>
            </h3>
            <div className="mt-2">
              <p className="truncate text-sm font-medium leading-5 text-indigo-700">
                {props.listing.merchant.merchantDetails.name}
              </p>
              <p className="truncate text-xs font-base leading-5 text-indigo-700">
                {props.listing.merchant.merchantDetails.address}
              </p>
            </div>
            <div className="mt-4">
              <p className="text-sm text-gray-700 font-light">
                {props.listing.description || "No description"}
              </p>
            </div>
          </div>
          <div className="bg-indigo-50 px-4 py-3 flex justify-between">
            <div className="flex flex-col text-sm font-semibold text-indigo-900 leading-6">
              <p>Quantity available: {props.listing.quantity}</p>
              <p className="text-gray-400">
                <s>S${props.listing.originalPrice.toFixed(2)}</s>{" "}
                <span className="text-indigo-900">
                  S$
                  {props.listing.discountedPrice.toFixed(2)}
                </span>
              </p>
              <p>
                Collection:{" "}
                {new Date(props.listing.collectionDate).toLocaleString("en-SG")}
              </p>
            </div>
            <div className="w-1/4 py-2 flex flex-col justify-end">
              <form className="flex justify-between">
                <input
                  type="number"
                  id="quantity"
                  name="quantity"
                  placeholder="Quantity"
                  min="1"
                  max={props.listing.quantity}
                  value={quantity}
                  className="w-1/2 rounded-md border-0 text-indigo-900 shadow-sm ring-1 ring-inset ring-indigo-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 text-sm p-2"
                  onChange={handleChangeQuantity}
                  disabled={
                    appCtx.accessToken && appCtx.role === "user" ? false : true
                  }
                />
                <button
                  type="button"
                  className={
                    appCtx.accessToken && appCtx.role === "user"
                      ? "inline-flex w-full justify-center rounded-md bg-green-600 ml-2 px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-green-500"
                      : "inline-flex w-full justify-center rounded-md bg-gray-600 ml-2 px-3 py-2 text-sm font-semibold text-white shadow-sm"
                  }
                  onClick={handleAddToCart}
                  disabled={
                    appCtx.accessToken && appCtx.role === "user" ? false : true
                  }
                >
                  Add to cart
                </button>
              </form>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

const ListingModal = (props) => {
  return (
    <>
      {ReactDOM.createPortal(
        <Overlay listing={props.listing} okayClick={props.okayClick} />,
        document.querySelector("#modal-root")
      )}
    </>
  );
};

export default ListingModal;
