import React, { useState } from "react";
import styles from "./styles/ManageListings.module.css";
import DisplayListing from "../components/DisplayListings";
import CreateListing from "../components/CreateListing";

const ManageListings = () => {
  const [update, setUpdate] = useState(false);
  const [selectedListing, setSelectedListing] = useState(null);
  const [refreshListings, setRefreshListings] = useState(false);

  const passListing = () => {
    setUpdate(false);
    setRefreshListings(true);
  };
  return (
    <div className={styles.manageListings}>
      <CreateListing
        update={update}
        setUpdate={setUpdate}
        selectedListing={selectedListing}
        setSelectedListing={setSelectedListing}
        createdListing={passListing}
      />
      <DisplayListing
        selectedListing={selectedListing}
        setSelectedListing={setSelectedListing}
        refreshListings={refreshListings}
        setRefreshListings={setRefreshListings}
        setUpdate={setUpdate}
        update={update}
      />
    </div>
  );
};

export default ManageListings;
