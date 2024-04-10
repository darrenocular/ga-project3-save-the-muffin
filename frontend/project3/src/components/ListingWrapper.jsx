import React, { useState } from "react";
import Listing from "./Listing";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faPenToSquare, faX } from "@fortawesome/free-solid-svg-icons";

const ListingWrapper = (props) => {
  const [isHover, setIsHover] = useState(false);

  const handleEdit = async () => {
    props.handleUpdate(props.listing);
  };

  const handleDelete = async (id) => {
    props.handleDelete(id);
  };

  return (
    <div
      onMouseEnter={() => setIsHover(true)}
      onMouseLeave={() => setIsHover(false)}
      className="flex h-50 max-w-full"
    >
      <Listing listing={props.listing} />
      <div className={isHover ? "flex flex-col justify-around" : "hidden"}>
        <button
          className="text-indigo-700 hover:bg-indigo-100 p-2 m-2 rounded-md"
          onClick={handleEdit}
        >
          <FontAwesomeIcon icon={faPenToSquare} />
        </button>
        <button
          className="text-indigo-700 hover:bg-indigo-100 p-2 m-2 rounded-md"
          onClick={() => handleDelete(props.listing._id)}
        >
          <FontAwesomeIcon icon={faX} />
        </button>
      </div>
    </div>
  );
};

export default ListingWrapper;
