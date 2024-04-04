import React, { useState } from "react";
import ListingModal from "../components/ListingModal";

const Listing = (props) => {
  const [viewListing, setViewListing] = useState(false);

  const handleDismiss = () => {
    setViewListing(() => !viewListing);
  };

  return (
    <>
      <div
        onClick={() => setViewListing(!viewListing)}
        className="flex justify-between pr-4 rounded shadow-md my-4 hover:bg-indigo-50"
      >
        <div className="flex min-w-0 gap-x-4">
          <img
            className="h-36 w-36 flex-none bg-gray-50 object-cover rounded-l"
            src={
              props.listing.image
                ? props.listing.image
                : "https://images.unsplash.com/photo-1626645738196-c2a7c87a8f58?q=80&w=2940&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D"
            }
          />
          <div className="flex flex-col justify-between py-4">
            <div>
              <p className="text-xl font-semibold leading-6 text-indigo-900 flex">
                {props.listing.name}{" "}
                <span className="text-xs bg-indigo-700 text-white rounded py-1 px-2 ml-2 border-none">
                  {props.listing.category.charAt(0).toUpperCase() +
                    props.listing.category.slice(1)}
                </span>
              </p>
              <p className="mt-1 truncate text-sm font-medium leading-5 text-indigo-700">
                {props.listing.merchant.merchantDetails.name}
              </p>
            </div>
            <div>
              <p className="mt-1 truncate text-xs font-light leading-5 text-indigo-700">
                {props.listing.description || "No description"}
              </p>
            </div>
          </div>
        </div>
        <div className="flex flex-col py-4 pr-2 justify-between">
          <div>
            <p className="text-sm leading-6 text-indigo-900 font-semibold">
              Quantity available: {props.listing.quantity}
            </p>
            <p className="mt-1 text-sm leading-5 text-gray-400">
              <s>S${props.listing.originalPrice}</s>{" "}
              <span className="text-indigo-700 font-semibold">
                S$
                {props.listing.discountedPrice}
              </span>
            </p>
          </div>
          <div className="mt-1 leading-5">
            <span className="text-xs text-indigo-700">Collect on </span>
            <br />
            <span className="text-sm font-medium text-indigo-700">
              {new Date(props.listing.collectionDate).toLocaleString("en-SG")}
            </span>
          </div>
        </div>
      </div>
      {viewListing && (
        <ListingModal listing={props.listing} okayClick={handleDismiss} />
      )}
    </>
  );
};

export default Listing;
