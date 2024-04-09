import React, { useState, useContext, useEffect } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faSearch } from "@fortawesome/free-solid-svg-icons";
import AppContext from "../context/AppContext";
import useOneMap from "../hooks/useOneMap";

const SearchBar = (props) => {
  const fetchOneMapData = useOneMap();
  const appCtx = useContext(AppContext);
  const { setErrorMessage, setIsError } = useContext(AppContext);
  const [searchText, setSearchText] = useState("");
  const [isFocused, setIsFocused] = useState(false);
  const [addressSearchResult, setAddressSearchResult] = useState([]);
  const [displaySearchResult, setDisplaySearchResult] = useState(false);

  const getAddressBySearch = async (searchTerm) => {
    try {
      if (searchTerm.length === 0) return;
      if (!appCtx.oneMapAccessToken) {
        throw new Error("cannot search without access to OneMap");
      }
      setAddressSearchResult([]);
      searchTerm = encodeURIComponent(searchTerm);
      const res = await fetchOneMapData(
        "/api/common/elastic/search?returnGeom=Y&getAddrDetails=Y&pageNum=1&searchVal=" +
          searchTerm,
        "GET",
        undefined,
        appCtx.oneMapAccessToken
      );

      if (res.ok) {
        if (res.data?.results) {
          setAddressSearchResult(res.data.results);
        }
        setDisplaySearchResult(true);
      }
    } catch (error) {
      console.error(error.message);
      setErrorMessage(error.message);
      setIsError(true);
    }
  };

  const handleEnter = (event) => {
    if (event.key === "Enter" && isFocused) {
      if (props.setArea) {
        props.setArea("");
      }
      getAddressBySearch(searchText);
    }
  };

  const handleClick = (result) => {
    props.liftClick(result);
    setSearchText(result.SEARCHVAL);
    setDisplaySearchResult(false);
    setAddressSearchResult([]);
    if (props.setShowMap) {
      props.setShowMap(true);
    }
  };

  useEffect(() => {
    setSearchText("");
  }, [props.area]);

  useEffect(() => {
    if (props.clearSearchText) setSearchText("");
    props.setClearSearchText(false);
  }, [props.clearSearchText]);

  return (
    <div
      className="relative z-2 grow"
      onMouseLeave={() => {
        setDisplaySearchResult(false);
      }}
    >
      <div className="relative rounded-md shadow-sm">
        <input
          type="text"
          name="search"
          id="search"
          className="block w-full rounded-md border-0 py-1.5 pl-5 pr-10 text-gray-900 ring-1 ring-inset ring-indigo-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
          placeholder="Search location"
          value={searchText}
          onClick={(event) => event.target.select()}
          onChange={(event) => setSearchText(event.target.value)}
          onKeyDown={handleEnter}
          onFocus={() => setIsFocused(true)}
          onBlur={() => setIsFocused(false)}
        />
        <button
          className="absolute inset-y-0 right-3 flex items-center"
          onClick={() => getAddressBySearch(searchText)}
        >
          <FontAwesomeIcon icon={faSearch} className="text-indigo-700" />
        </button>
        {displaySearchResult && searchText && (
          <div className="absolute z-10 bg-white flex flex-col w-full rounded-md ring-1 ring-inset ring-indigo-300">
            {addressSearchResult && addressSearchResult.length > 0 ? (
              addressSearchResult.map((result, idx) => {
                return (
                  <div
                    className="text-sm text-indigo-900 block w-full rounded-md p-3 border-0 hover:bg-indigo-100"
                    key={idx}
                    onClick={() => handleClick(result)}
                  >
                    {result.ADDRESS}
                  </div>
                );
              })
            ) : (
              <div
                className="text-sm text-indigo-900 block w-full rounded-md p-3 border-0 hover:bg-indigo-100"
                onClick={() => {
                  setDisplaySearchResult(false);
                  setSearchText("");
                }}
              >
                No results found
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default SearchBar;
