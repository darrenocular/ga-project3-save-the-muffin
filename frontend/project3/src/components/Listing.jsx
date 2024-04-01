import React from "react";
import styles from "./styles/Listing.module.css";

const Listing = (props) => {
  return (
    <div onClick={() => props.setViewListing(!props.viewListing)}>Listing</div>
  );
};

export default Listing;
