import React, { useContext, useState, useEffect } from "react";
import Listing from "../components/Listing";
import useFetch from "../hooks/useFetch";
import AppContext from "../context/AppContext";

const Home = () => {
  const fetchData = useFetch();
  const appCtx = useContext(AppContext);
  const [listings, setListings] = useState([]);
  const [filteredListings, setFilteredListings] = useState([]);
  const [areaList, setAreaList] = useState([]);
  const [area, setArea] = useState("");

  const getListings = async () => {
    try {
      const res = await fetchData("/api/listings");

      if (res.ok) {
        setListings(res.data);
        setFilteredListings(res.data);
      }
    } catch (error) {
      appCtx.setErrorMessage(error.message);
      appCtx.setIsError(true);
    }
  };

  const getAreas = async () => {
    try {
      const res = await fetchData("/auth/enum");
      if (res.ok) {
        setAreaList(res.data.areas.sort());
      }
    } catch (error) {
      appCtx.setErrorMessage(res.data);
      appCtx.isError(true);
    }
  };

  const handleAreaChange = (event) => {
    event.preventDefault();
    setArea(event.target.value);
  };

  // Get areas list on mount
  useEffect(() => {
    getListings();
    getAreas();
  }, []);

  // Get listings when area changes
  useEffect(() => {
    if (area !== "") {
      const filteredListings = listings.filter(
        (listing) => listing.merchant.merchantDetails.area === area
      );
      setFilteredListings(filteredListings);
    }
  }, [area]);

  return (
    <div className="mx-auto w-90 px-4 py-4 flex flex-col">
      <h2 className="text-xl font-bold tracking-tight text-indigo-900 mx-auto">
        Listings near you
      </h2>
      <div className="flex self-end w-1/3">
        <button
          type="button"
          className="mt-2 inline-flex justify-center rounded bg-indigo-100 px-3 py-2 mr-2 text-sm font-semibold shadow-sm hover:bg-indigo-50 w-1/3"
          onClick={() => {
            setFilteredListings(listings);
            setArea("");
          }}
        >
          Show all
        </button>
        <select
          name="area"
          onChange={handleAreaChange}
          className="block w-full rounded-md border-0 py-1.5 text-indigo-900 shadow-sm ring-1 ring-inset ring-indigo-300 focus:ring-2 focus:ring-inset focus:ring-indigo-600 mt-2 text-sm p-2"
          value={area}
          required
        >
          <option value="" disabled>
            Select area
          </option>
          {areaList.map((areaItem) => (
            <option value={areaItem} key={areaItem}>
              {areaItem}
            </option>
          ))}
        </select>
      </div>
      <div className="w-full">
        {filteredListings.map((listing, idx) => {
          return <Listing listing={listing} key={idx} />;
        })}
      </div>
    </div>
  );
};

export default Home;
