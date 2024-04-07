import React, { useContext, useState, useEffect } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faMapMarkedAlt } from "@fortawesome/free-solid-svg-icons";
import Listing from "../components/Listing";
import useFetch from "../hooks/useFetch";
import AppContext from "../context/AppContext";
import DisplayMap from "../components/DisplayMap";
import useOneMap from "../hooks/useOneMap";
import SearchBar from "../components/SearchBar";

const Home = () => {
  const fetchData = useFetch();
  const fetchOneMapData = useOneMap();
  const appCtx = useContext(AppContext);
  const [listings, setListings] = useState([]);
  const [nearbyListings, setNearbyListings] = useState([]);
  const [isLocationLoading, setIsLocationLoading] = useState(true);
  const [isNearbyListingLoading, setIsNearbyListingLoading] = useState(true);
  const [filteredListings, setFilteredListings] = useState([]);
  const [areaList, setAreaList] = useState([]);
  const [area, setArea] = useState("");
  const [longitude, setLongitude] = useState("");
  const [latitude, setLatitude] = useState("");
  const [tailoredLocationService, settailoredLocationService] = useState(true);
  const [showMap, setShowMap] = useState(true);

  const handleAreaChange = (event) => {
    event.preventDefault();
    setArea(event.target.value);
  };

  const setCoordinates = (clickedAddress) => {
    setLongitude(parseFloat(clickedAddress.LONGITUDE));
    setLatitude(parseFloat(clickedAddress.LATITUDE));
    settailoredLocationService(true);
    fetchNearbyFood();
  };

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

  const getLocation = () => {
    return new Promise((resolve, reject) => {
      setIsLocationLoading(true);
      try {
        if (navigator.geolocation) {
          navigator.geolocation.getCurrentPosition(
            (position) => {
              success(position);
              settailoredLocationService(true);
              resolve();
            },
            (err) => {
              error(err);
              reject(`Unable to retrieve your location.`);
            }
          );
        }
      } catch (error) {
        console.error(error.message);
        appCtx.setErrorMessage(error.message);
        appCtx.setIsError(true);
      } finally {
        setIsLocationLoading(false);
      }
    });
  };

  const success = (position) => {
    const latitude = parseFloat(position.coords.latitude);
    const longitude = parseFloat(position.coords.longitude);
    setLatitude(latitude);
    setLongitude(longitude);
    fetchNearbyFood();
  };

  const error = (err) => {
    settailoredLocationService(false);
    throw new Error(err + `. Unable to retrieve your location.`);
  };

  const getOneMapToken = async () => {
    try {
      const res = await fetchOneMapData("/api/auth/post/getToken", "POST", {
        email: import.meta.env.VITE_ONE_MAP_EMAIL,
        password: import.meta.env.VITE_ONE_MAP_PASSWORD,
      });

      if (res.ok) {
        appCtx.setOneMapAccessToken(res.data.access_token);
      }
    } catch (error) {
      settailoredLocationService(false);
      throw new Error(error.message + `. Unable to access OneMap.`);
    }
  };

  const fetchNearbyFood = async () => {
    setIsNearbyListingLoading(true);
    try {
      if (!latitude && !longitude) {
        return;
      }
      console.log(
        `fetching nearby food: longitude: ${longitude}, latitude: ${latitude}`
      );
      const res = await fetchData(
        "/api/listings/nearby",
        "POST",
        {
          latitude: latitude,
          longitude: longitude,
          maxDistance: 3,
        },
        undefined
      );

      if (res.ok) {
        setNearbyListings(res.data.listings);
      }
    } catch (error) {
      console.error(error.message);
      appCtx.setErrorMessage(error.message);
      appCtx.setIsError(true);
    } finally {
      setIsNearbyListingLoading(false);
    }
  };

  const loadHomePage = async () => {
    try {
      const listingsAndAreas = Promise.all([getListings(), getAreas()]);
      if (!appCtx.oneMapAccessToken) await getOneMapToken();
      await listingsAndAreas;
      await getLocation();
      await fetchNearbyFood();
    } catch (error) {
      console.error(error.message);
      appCtx.setErrorMessage(error.message);
      appCtx.setIsError(true);
    }
  };

  // Get areas list on mount
  useEffect(() => {
    loadHomePage();
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

  useEffect(() => {
    fetchNearbyFood();
  }, [latitude, longitude]);

  return (
    <div className="mx-auto w-90 px-4 py-4 flex flex-col relative">
      <div className="flex">
        <SearchBar liftClick={setCoordinates} />
        <button
          className="text-indigo-700 hover:bg-indigo-200 p-2 m-2 rounded-md"
          onClick={() => setShowMap(!showMap)}
        >
          <FontAwesomeIcon icon={faMapMarkedAlt} />
        </button>
      </div>
      {/* <div>isLocationLoading: {JSON.stringify(isLocationLoading)}</div>
      <div>
        isNearbyListingLoading: {JSON.stringify(isNearbyListingLoading)}
      </div>
      <div>
        tailoredLocationService: {JSON.stringify(tailoredLocationService)}
      </div>
      <div>nearbyListings: {JSON.stringify(nearbyListings)}</div> */}

      {!isLocationLoading &&
        !isNearbyListingLoading &&
        showMap &&
        tailoredLocationService &&
        nearbyListings.length > 0 && (
          <DisplayMap
            longitude={longitude}
            latitude={latitude}
            nearbyListings={nearbyListings}
          />
        )}
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
