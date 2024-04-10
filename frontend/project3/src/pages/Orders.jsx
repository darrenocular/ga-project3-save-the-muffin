import React, { useContext, useEffect, useState } from "react";
import ActiveOrderItem from "../components/ActiveOrderItem";
import PastOrderItem from "../components/PastOrderItem";
import useFetch from "../hooks/useFetch";
import AppContext from "../context/AppContext";

const Orders = () => {
  const fetchData = useFetch();
  const appCtx = useContext(AppContext);
  const [orders, setOrders] = useState([]);
  const [activeOrders, setActiveOrders] = useState([]);
  const [pastOrders, setPastOrders] = useState([]);
  const [showHistory, setShowHistory] = useState(false);

  const getOrders = async () => {
    try {
      const res = await fetchData(
        "/api/orders",
        "POST",
        { user: appCtx.id },
        appCtx.accessToken
      );

      if (res.ok) {
        setOrders(res.data);
      } else {
        throw new Error(res.data);
      }
    } catch (error) {
      appCtx.setErrorMessage(res.data);
      appCtx.isError(true);
    }
  };

  // Get orders on mount
  useEffect(() => {
    getOrders();
  }, []);

  // Set active and past orders on change to orders
  useEffect(() => {
    setActiveOrders(
      orders
        .filter(
          (order) =>
            order.isCollected === false &&
            new Date(order.listing.collectionDate) > Date.now()
        )
        .reverse()
    );
    setPastOrders(
      orders.filter(
        (order) =>
          order.isCollected === true ||
          new Date(order.listing.collectionDate) < Date.now()
      )
    );
  }, [orders]);

  return (
    <div className="mx-auto w-90 px-4 py-4 flex flex-col">
      <h2 className="text-xl font-bold tracking-tight text-indigo-900 mx-auto">
        Your Orders
      </h2>
      <p className="text-sm font-light text-indigo-900 mx-auto my-2">
        Please present your order numbers below for collection. Payment (direct
        to merchant) only upon collection.
      </p>
      <div className="flex w-1/3 mx-auto">
        <button
          type="button"
          className={
            showHistory
              ? "mt-3 inline-flex w-full justify-center rounded-l bg-indigo-100 px-3 py-2 text-sm font-semibold shadow-sm hover:bg-indigo-50"
              : "mt-3 inline-flex w-full justify-center rounded-l bg-indigo-700 px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-indigo-600"
          }
          onClick={() => setShowHistory(false)}
        >
          Active orders
        </button>
        <button
          type="button"
          className={
            showHistory
              ? "mt-3 inline-flex w-full justify-center rounded-r bg-indigo-700 px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-indigo-600"
              : "mt-3 inline-flex w-full justify-center rounded-r bg-indigo-100 px-3 py-2 text-sm font-semibold shadow-sm hover:bg-indigo-50"
          }
          onClick={() => setShowHistory(true)}
        >
          Order history
        </button>
      </div>
      <div className="w-full">
        {showHistory
          ? pastOrders.map((order, idx) => {
              return <PastOrderItem order={order} key={idx} />;
            })
          : activeOrders.map((order, idx) => {
              return <ActiveOrderItem order={order} key={idx} />;
            })}
      </div>
    </div>
  );
};

export default Orders;
