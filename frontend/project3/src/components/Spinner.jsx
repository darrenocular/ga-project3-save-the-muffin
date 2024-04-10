import React from "react";
import styles from "./styles/Spinner.module.css";

const Spinner = () => {
  return (
    <div className={styles.center}>
      <div className={styles["lds-dual-ring"]}></div>
    </div>
  );
};

export default Spinner;
