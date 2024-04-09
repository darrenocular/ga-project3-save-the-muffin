import { useContext, useEffect, useState } from "react";
import useFetch from "../hooks/useFetch";
import AppContext from "../context/AppContext";
import { useNavigate } from "react-router-dom";

export default function MerchantActiveOrders() {
  const fetchData = useFetch();
  const appCtx = useContext(AppContext);
  const navigate = useNavigate();

  const [orderListingsLoading, setOrderListingLoading] = useState(true);
  const [orderListings, setOrderListing] = useState([]);

  //this is a get merchant orders list
  const getOrdersByMerchant = async () => {
    try {
      const res = await fetchData(
        "/api/orders/manage",
        "POST",
        { id: appCtx.id },
        appCtx.accessToken
      );
      setOrderListing(res.data);
      setOrderListingLoading(false);
    } catch (error) {
      appCtx.setErrorMessage(error.message);
      appCtx.setIsError(true);
    }
  };

  useEffect(() => {
    getOrdersByMerchant();
  }, []);

  //isCollected put api logic
  const handleOrderCollected = async (order) => {
    try {
      const res = await fetchData(
        "/api/orders/manage",
        "PUT",
        { id: order._id, isCollected: true },
        appCtx.accessToken
      );

      console.log(res);
      if (res.ok) {
        getOrdersByMerchant();
      }
    } catch (error) {
      appCtx.setErrorMessage(error.message);
      appCtx.setIsError(true);
    }
  };

  // //delete order
  const handleOrderDelete = async (order) => {
    try {
      const res = await fetchData(
        "/api/orders/manage",
        "DELETE",
        { id: order._id },
        appCtx.accessToken
      );
      console.log(res);
      getOrdersByMerchant();
    } catch (error) {
      appCtx.setErrorMessage(error.message);
      appCtx.setIsError(true);
    }
  };

  console.log("active", orderListings);

  return (
    <div className="px-4 sm:px-6 lg:px-8">
      <div className="mt-8 flow-root">
        <div className="-mx-4 -my-2 overflow-x-auto sm:-mx-6 lg:-mx-8">
          <div className="inline-block min-w-full py-2 align-middle sm:px-6 lg:px-8">
            <div className="overflow-hidden shadow ring-1 ring-black ring-opacity-5 sm:rounded-lg">
              <table className="min-w-full divide-y divide-gray-300">
                <thead className="bg-gray-50">
                  <tr>
                    <th
                      scope="col"
                      className="py-3.5 pl-4 pr-3 text-left text-sm font-semibold text-gray-900 sm:pl-6"
                    >
                      User
                    </th>
                    <th
                      scope="col"
                      className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900"
                    >
                      Order #
                    </th>
                    <th
                      scope="col"
                      className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900"
                    >
                      Items
                    </th>
                    <th
                      scope="col"
                      className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900"
                    >
                      Quantity
                    </th>
                    <th
                      scope="col"
                      className="relative py-3.5 pl-3 pr-4 sm:pr-6"
                    >
                      <span className="sr-only">Edit</span>
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200 bg-white">
                  {!orderListingsLoading ? (
                    orderListings.filter((e) => e.isCollected === false)
                      .length > 0 ? (
                      orderListings
                        .filter((e) => e.isCollected === false)
                        .map((order) => (
                          <tr key={order._id}>
                            <td className="whitespace-nowrap py-4 pl-4 pr-3 text-sm font-medium text-gray-900 sm:pl-6">
                              {order.user.email}
                            </td>
                            <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-500">
                              {order._id}
                            </td>
                            <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-500">
                              {order.listing.name}
                            </td>
                            <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-500">
                              {order.purchaseQuantity}
                            </td>
                            <td className="relative whitespace-nowrap py-4 pl-3 pr-4 text-left text-sm font-medium sm:pr-6">
                              <div className="flex flex-col">
                                <div style={{ width: "60%" }}>
                                  <button
                                    className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded w-full"
                                    onClick={() => handleOrderCollected(order)}
                                  >
                                    Order Collected
                                  </button>
                                </div>
                                <div
                                  style={{ width: "60%", marginTop: "0.5rem" }}
                                >
                                  <button
                                    className="bg-red-500 hover:bg-red-700 text-white font-bold py-2 px-4 rounded w-full"
                                    onClick={() => handleOrderDelete(order)}
                                  >
                                    Delete Order
                                  </button>
                                </div>
                              </div>
                            </td>
                          </tr>
                        ))
                    ) : (
                      <tr>
                        <td colSpan="5" className="p-5 text-center">
                          <p>No active orders yet...</p>
                          <button
                            style={{ width: "12%", marginTop: "0.5rem" }}
                            className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded w-full"
                            onClick={() => navigate("/listings")}
                          >
                            Go to listings
                          </button>
                        </td>
                      </tr>
                    )
                  ) : (
                    <tr>
                      <td className="p-5">Loading...</td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
