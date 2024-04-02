import React from "react";
import ReactDOM from "react-dom";
import styles from "./styles/Modal.module.css";

const Overlay = (props) => {
  return (
    <div className={styles.backdrop} onClick={props.okayClick}>
      <div
        className={`${styles.board} ${styles.modal}`}
        onClick={(event) => event.stopPropagation()}
      >
        <header className={styles.header}>
          <h2>Food name{props.name}</h2>
        </header>
        <div className={styles.content}>
          {props.content}
          <div>Original price{props.original_price}</div>
          <div>Discounted price{props.discounted_price}</div>
          <div>Merchant name{props.merchant_name}</div>
          <div>Food category{props.food_category}</div>
          <div>Address{props.address}</div>
          <div>Area{props.area}</div>
          <div>Stock left{props.quantity}</div>
          <div>Collection Period</div>
          <div className="text-sm">
            Date{new Date(props.collection_date_start).toLocaleDateString()}
          </div>
          <time dateTime={props.collection_date_start} className="text-sm">
            Start Time
            {new Date(props.collection_date_start).toLocaleTimeString()}
          </time>
          <span>-</span>
          <time dateTime={props.collection_date_end} className="text-sm">
            End Time{new Date(props.collection_date_end).toLocaleTimeString()}
          </time>
          <div>Description{props.description}</div>
        </div>
        <footer className={styles.actions}>
          <button onClick={props.okayClick} className={``}>
            Cancel
          </button>
        </footer>
      </div>
    </div>
  );
};

const ListingModal = (props) => {
  return (
    <>
      {ReactDOM.createPortal(
        <Overlay okayClick={props.okayClick} />,
        document.querySelector("#modal-root")
      )}
    </>
  );
};

export default ListingModal;
