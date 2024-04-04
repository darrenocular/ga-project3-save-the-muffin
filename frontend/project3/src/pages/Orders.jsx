import React, { useContext, useEffect, useState } from "react";
import OrderItem from "../components/OrderItem";
import useFetch from "../hooks/useFetch";
import AppContext from "../context/AppContext";

const Orders = () => {
  const fetchData = useFetch();
  const appCtx = useContext(AppContext);
  const [orders, setOrders] = useState([]);

  const getOrders = async () => {
    try {
      const res = await fetchData(
        "/api/orders",
        "POST",
        { id: appCtx.id },
        appCtx.accessToken
      );

      if (res.ok) {
        setOrders(res.data);
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

  return (
    <div className="mx-auto w-90 px-4 py-4 flex flex-col">
      <h2 className="text-xl font-bold tracking-tight text-indigo-900 mx-auto">
        Your Orders
      </h2>
      <div className="w-full">
        {orders.map((order, idx) => {
          return <OrderItem order={order} key={idx} />;
        })}
      </div>
    </div>
  );
};

export default Orders;
