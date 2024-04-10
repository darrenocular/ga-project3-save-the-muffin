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
        <header className="bg-rose-600 p-4 rounded-t-lg text-white font-semibold">
          <h2>{props.title || "Error"}</h2>
        </header>
        <div className="p-3 overflow-y-auto min-h-16 text-gray-900 leading-6">
          {props.content && props.content.charAt(-1) !== "."
            ? props.content + "."
            : props.content}
        </div>
        <footer className={styles.actions}>
          <button
            onClick={props.okayClick}
            className="inline-flex justify-center rounded-md bg-green-600 ml-2 px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-green-500"
          >
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
