import React from "react";
import ReactDOM from "react-dom";
import styles from "./styles/Modal.module.css";

const Overlay = (props) => {
  return (
    <div
      className="fixed inset-0 bg-gray-500 bg-opacity-75 transition-opacity z-20"
      onClick={props.okayClick}
    >
      <div
        className={`${styles.board} ${styles.modal}`}
        onClick={(event) => event.stopPropagation()}
      >
        <header className={styles.errorHeader}>
          <h2>{props.title}Error</h2>
        </header>
        <div className="p-3 overflow-y-auto min-h-16 text-gray-900">
          {props.content}
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
        <Overlay okayClick={props.okayClick} content={props.content} />,
        document.querySelector("#modal-root")
      )}
    </>
  );
};

export default ListingModal;
