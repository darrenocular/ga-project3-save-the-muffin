import React, { useState, useEffect } from "react";
import ListingModal from "./ListingModal";
import {
  MapContainer,
  TileLayer,
  useMap,
  Marker,
  Popup,
  AttributionControl,
} from "react-leaflet";
import "leaflet/dist/leaflet.css";
import styles from "./styles/DisplayMap.module.css";
import L from "leaflet";

// Import images
import markerIcon2x from "leaflet/dist/images/marker-icon-2x.png";
import markerIcon from "leaflet/dist/images/marker-icon.png";
import markerShadow from "leaflet/dist/images/marker-shadow.png";

delete L.Icon.Default.prototype._getIconUrl;

L.Icon.Default.mergeOptions({
  iconRetinaUrl: markerIcon2x,
  iconUrl: markerIcon,
  shadowUrl: markerShadow,
});

const DisplayMap = (props) => {
  const [screenDimensions, setScreenDimensions] = useState({
    width: window.innerWidth,
    height: window.innerHeight,
  });
  const [mapCenter, setMapCenter] = useState([props.latitude, props.longitude]);
  const [listings, setListings] = useState([]);
  const [viewListingModal, setViewListingModal] = useState(false);
  const [selectedListing, setSelectedListing] = useState(null);

  const handleDismiss = () => {
    setViewListingModal(() => !viewListingModal);
  };

  const handleMarkerClick = (listing) => {
    setSelectedListing(listing);
    setViewListingModal(true);
  };

  const handleResize = () => {
    setScreenDimensions({
      width: window.innerWidth,
      height: window.innerHeight,
    });
  };

  useEffect(() => {
    window.addEventListener("resize", handleResize);
    handleResize();
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  const ResizeMap = () => {
    const map = useMap();
    useEffect(() => {
      map.invalidateSize();
    }, [screenDimensions.width, screenDimensions.height]);
    return null;
  };

  const UpdateMapCenter = () => {
    const map = useMap();
    useEffect(() => {
      map.flyTo(mapCenter, map.getZoom());
    }, [mapCenter]);
    return null;
  };

  useEffect(() => {
    if (props.latitude && props.longitude) {
      setMapCenter([props.latitude, props.longitude]);
    }
  }, [props.latitude, props.longitude]);

  useEffect(() => {
    if (props.nearbyListings) {
      setListings(props.nearbyListings);
    }
  }, [props.nearbyListings]);

  return (
    <div className="block flex-col w-full py-4 flex mx-auto items-center z-0">
      {mapCenter[0] && mapCenter[1] && (
        <MapContainer
          center={mapCenter}
          zoom={14}
          scrollWheelZoom={true}
          className={styles["map-container"]}
          attributionControl={false}
        >
          <TileLayer
            attribution='<img src="https://www.onemap.gov.sg/web-assets/images/logo/om_logo.png" style="height:20px;width:20px;"/>&nbsp;<a href="https://www.onemap.gov.sg/" target="_blank" rel="noopener noreferrer">OneMap</a>&nbsp;&copy;&nbsp;contributors&nbsp;&#124;&nbsp;<a href="https://www.sla.gov.sg/" target="_blank" rel="noopener noreferrer">Singapore Land Authority</a>'
            url="https://www.onemap.gov.sg/maps/tiles/Default/{z}/{x}/{y}.png"
            minZoom={11}
            maxZoom={19}
            detectRetina={true}
          />
          <AttributionControl position="bottomright" prefix={false} />
          <Marker
            position={[props.latitude, props.longitude]}
            eventHandlers={{
              mouseover: (e) => {
                e.target.openPopup();
              },
              mouseout: (e) => {
                e.target.closePopup();
              },
            }}
          >
            <Popup>You are here</Popup>
          </Marker>
          {listings.length > 0 &&
            listings.map((listing) => {
              return (
                <Marker
                  position={[listing.latitude, listing.longitude]}
                  key={listing._id}
                  data={listing}
                  eventHandlers={{
                    click: () => handleMarkerClick(listing),
                    mouseover: (e) => {
                      e.target.openPopup();
                    },
                    mouseout: (e) => {
                      e.target.closePopup();
                    },
                  }}
                >
                  <Popup>
                    <div className="text-indigo-700 font-semibold">
                      {listing.name}
                    </div>
                    <div className="text-gray-500 text-xs">
                      {listing.merchant.merchantDetails.name}
                    </div>
                    <div className="text-emerald-600 pt-1">
                      ${listing.discountedPrice.toFixed(2)}
                    </div>
                  </Popup>
                </Marker>
              );
            })}

          <ResizeMap />
          <UpdateMapCenter />
        </MapContainer>
      )}
      {viewListingModal && (
        <ListingModal listing={selectedListing} okayClick={handleDismiss} />
      )}
    </div>
  );
};

export default DisplayMap;
