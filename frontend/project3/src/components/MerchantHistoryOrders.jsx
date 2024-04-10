import { useContext, useEffect, useState } from "react";
import useFetch from "../hooks/useFetch";
import AppContext from "../context/AppContext";
import { useNavigate } from "react-router-dom";

export default function MerchantHistoryOrders() {
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
        { merchant: appCtx.id },
        appCtx.accessToken
      );
      if (res.ok) {
        setOrderListing(res.data);
        setOrderListingLoading(false);
      } else {
        throw new Error(res.data);
      }
    } catch (error) {
      appCtx.setErrorMessage(error.message);
      appCtx.setIsError(true);
    }
  };

  useEffect(() => {
    getOrdersByMerchant();
  }, []);

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
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200 bg-white">
                  {!orderListingsLoading ? (
                    orderListings.filter((e) => e.isCollected === true).length >
                    0 ? (
                      orderListings
                        .filter((e) => e.isCollected === true)
                        .map((order) => (
                          <tr key={order._id} className="hover:bg-indigo-50">
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
                          </tr>
                        ))
                    ) : (
                      <tr>
                        <td colSpan="5" className="p-5 text-center">
                          <p className="text-red-700 text-sm">No past orders</p>
                          <button
                            className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
                            onClick={() => navigate("/listings")}
                          >
                            Go to listings
                          </button>
                        </td>
                      </tr>
                    )
                  ) : (
                    <tr>
                      <td
                        colSpan="5"
                        className="p-5 text-gray-500 text-center text-sm leading-6"
                      >
                        Loading...
                      </td>
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
