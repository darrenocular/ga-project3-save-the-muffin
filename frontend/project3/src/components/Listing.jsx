import React from "react";
import styles from "./styles/Listing.module.css";

const Listing = (props) => {
  return (
    <div onClick={() => props.setViewListing(!props.viewListing)}>
      <div>Listing</div>
      <div>Food name{props.name}</div>
      <div>Merchant name{props.merchant_name}</div>
      <div>Original price{props.original_price}</div>
      <div>Discounted price{props.discounted_price}</div>
      <div>Food category{props.food_category}</div>
    </div>
  );
};

export default Listing;
