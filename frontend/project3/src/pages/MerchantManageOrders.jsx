import { useContext, useEffect, useState } from "react";
import useFetch from "../hooks/useFetch";
import AppContext from "../context/AppContext";

export default function MerchantManageOrders() {
  const fetchData = useFetch();
  const appCtx = useContext(AppContext);

  const [orderListings, setOrderListing] = useState([]);

  //this is a get merchant orders list
  const getListingByMerchant = async () => {
    try {
      const res = await fetchData(
        "/api/orders/manage",
        "POST",
        { id: appCtx.id },
        undefined
      );

      setOrderListing(res.data);
    } catch (error) {
      appCtx.setErrorMessage(error.message);
      appCtx.setIsError(true);
    }
  };

  useEffect(() => {
    getListingByMerchant();
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
      getListingByMerchant();

      console.log(res);
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
        undefined
      );
      console.log(res);
      getListingByMerchant();
    } catch (error) {
      appCtx.setErrorMessage(error.message);
      appCtx.setIsError(true);
    }
  };

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
                  {orderListings.map((order) => (
                    <tr key={order._id}>
                      <td className="whitespace-nowrap py-4 pl-4 pr-3 text-sm font-medium text-gray-900 sm:pl-6">
                        {order.user.email}
                      </td>
                      <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-500">
                        {order.listing.name}
                      </td>
                      <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-500">
                        {order.purchaseQuantity}
                      </td>
                      <td className="relative whitespace-nowrap py-4 pl-3 pr-4 text-right text-sm font-medium sm:pr-6">
                        <div className="flex flex-col">
                          <div>
                            <button
                              className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
                              onClick={() => handleOrderCollected(order)}
                            >
                              Order Collected
                            </button>
                          </div>
                          <div className="mt-1">
                            <button
                              className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
                              onClick={() => handleOrderDelete(order)}
                            >
                              Delete Order
                            </button>
                          </div>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
