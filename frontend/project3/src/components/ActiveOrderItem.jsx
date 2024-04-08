import React from "react";

const ActiveOrderItem = (props) => {
  return (
    <>
      <div className="flex justify-between pr-4 rounded shadow-md my-4">
        <div className="flex min-w-0 gap-x-4">
          <img
            className="h-36 w-36 flex-none bg-gray-50 object-cover rounded-l"
            src="https://images.unsplash.com/photo-1626645738196-c2a7c87a8f58?q=80&w=2940&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D"
          />
          <div className="flex flex-col justify-between py-4">
            <div>
              <p className="text-xl font-semibold leading-6 text-indigo-900 flex">
                {props.order.listing.name}{" "}
                <span className="text-xs bg-indigo-700 text-white rounded py-1 px-2 ml-2 border-none">
                  {props.order.listing.category.charAt(0).toUpperCase() +
                    props.order.listing.category.slice(1)}
                </span>
              </p>
              <p className="mt-1 truncate text-sm font-medium leading-5 text-indigo-700">
                {props.order.merchant.merchantDetails.name} (
                {props.order.merchant.merchantDetails.address})
              </p>
            </div>
            <div>
              <p className="text-sm text-indigo-700">
                Collection:{" "}
                <span className="text-sm text-indigo-700">
                  {new Date(props.order.listing.collectionDate).toLocaleString(
                    "en-SG"
                  )}
                </span>
              </p>
              <p className="text-sm text-indigo-700">
                Order #{props.order._id}
              </p>
            </div>
          </div>
        </div>
        <div className="flex flex-col py-4 pr-2 w-1/6">
          <p className="text-sm leading-6 text-indigo-900 font-semibold">
            Quantity ordered: {props.order.purchaseQuantity}
          </p>
          <p className="text-sm leading-6 text-indigo-900 font-semibold">
            Unit price: S${props.order.listing.discountedPrice.toFixed(2)}
          </p>
          <p className="text-sm leading-6 text-indigo-900 font-semibold">
            Total price: S${props.order.totalPrice}
          </p>
        </div>
      </div>
    </>
  );
};

export default ActiveOrderItem;
