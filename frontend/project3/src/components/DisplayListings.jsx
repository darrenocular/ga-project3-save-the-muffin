import React, { useState, useEffect, useContext } from "react";
import ListingWrapper from "./ListingWrapper";
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

  const deleteListing = async (id) => {
    try {
      const res = await fetchData(
        "/api/listings",
        "DELETE",
        { id },
        appCtx.accessToken
      );

      if (res.ok) {
        const newListings = structuredClone(myListings).filter(
          (listing) => listing._id !== id
        );
        setMyListings(newListings);
      }
    } catch (error) {
      console.error(error.message);
      appCtx.setErrorMessage(error.message);
      appCtx.setIsError(true);
    }
  };

  const passUpdateListing = (listing) => {
    if (JSON.stringify(listing) === JSON.stringify(props.selectedListing)) {
      props.setSelectedListing(null);
    } else {
      props.setSelectedListing(listing);
    }
    props.setUpdate(!props.update);
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
    <div className="flex-col overflow-y-auto w-7/12 p-3 grow">
      <h2 className="text-base font-semibold leading-7 text-gray-900">
        Your Listings
      </h2>
      {myListings &&
        myListings.map((listing, idx) => {
          return (
            <ListingWrapper
              listing={listing}
              key={idx}
              handleDelete={deleteListing}
              handleUpdate={passUpdateListing}
            />
          );
        })}
    </div>
  );
};

export default DisplayListings;
