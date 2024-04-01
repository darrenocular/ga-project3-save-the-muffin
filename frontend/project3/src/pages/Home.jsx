import React, { useState } from "react";
import styles from "./styles/Home.module.css";
import Listing from "../components/Listing";
import ListingModal from "../components/ListingModal";

const Main = () => {
  const [viewListing, setViewListing] = useState(false);

  const handleDismiss = () => {
    setViewListing(() => !viewListing);
  };

  return (
    <>
      <div>Home</div>
      <Listing viewListing={viewListing} setViewListing={setViewListing} />
      {viewListing && <ListingModal okayClick={handleDismiss} />}
    </>
  );
};

export default Main;
