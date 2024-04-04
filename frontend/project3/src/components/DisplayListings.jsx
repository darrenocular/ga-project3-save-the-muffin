import React, { useState, useEffect, useContext } from "react";
import styles from "./styles/DisplayListings.module.css";
import Listing from "./Listing";
import useFetch from "../hooks/useFetch";
import AppContext from "../context/AppContext";

const DisplayListings = (props) => {
  const [myListings, setMyListings] = useState([]);
  const appCtx = useContext(AppContext);
  const fetchData = useFetch();

  const getListingByMerchant = async () => {
    try {
      const res = await fetchData(
        "/api/listings/merchant",
        "POST",
        { merchant: appCtx.id },
        undefined
      );

      if (res.ok) {
        setMyListings(res.data);
      }
    } catch (error) {
      appCtx.setErrorMessage(error.message);
      appCtx.setIsError(true);
    }
  };

  useEffect(() => {
    getListingByMerchant();
  }, []);

  useEffect(() => {
    if (props.refreshListings) {
      getListingByMerchant();
      props.setRefreshListings(false);
    }
  }, [props.refreshListings]);

  return (
    <div className="flex-col overflow-y-auto p-3 grow">
      <h2 className="text-base font-semibold leading-7 text-gray-900">
        Your Listings
      </h2>
      {myListings &&
        myListings.map((listing, idx) => {
          return <Listing listing={listing} key={idx} />;
        })}
    </div>
  );
};

export default DisplayListings;
