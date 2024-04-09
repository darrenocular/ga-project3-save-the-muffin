import { useState } from "react";
import MerchantActiveOrders from "../components/MerchantActiveOrders";
import MerchantHistoryOrders from "../components/MerchantHistoryOrders";

export default function MerchantManageOrders() {
  const [showHistory, setShowHistory] = useState(false);

  return (
    <div className="mx-auto w-90 px-4 py-4 flex flex-col">
      <h2 className="text-xl font-bold tracking-tight text-indigo-900 mx-auto">
        Your Orders
      </h2>

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
        {showHistory ? <MerchantHistoryOrders /> : <MerchantActiveOrders />}
      </div>
    </div>
  );
}
