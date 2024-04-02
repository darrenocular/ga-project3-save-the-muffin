import React, { useState, useEffect } from "react";
import styles from "./styles/DisplayListings.module.css";
import Listing from "./Listing";
import useFetch from "../hooks/useFetch";
import AppContext from "../context/AppContext";

const DisplayListings = () => {
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
        console.log(res.data);
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

  return (
    <>
      <div>Listings</div>
      {myListings &&
        myListings.map((listing) => {
          return <Listing listing={listing} key={listing.id} />;
        })}
      <Listing />
    </>
  );
};

export default DisplayListings;
