import React, { useState, useEffect } from "react";
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

const DisplayMap = (props) => {
  const [screenDimensions, setScreenDimensions] = useState({
    width: window.innerWidth,
    height: window.innerHeight,
  });

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
    }, [
      screenDimensions.width,
      screenDimensions.height,
      props.longitude,
      props.latitude,
    ]);
    return null;
  };

  return (
    <div className="block mx-auto w-full py-4 flex flex-col items-center z-0">
      {/* <h2 className="text-xl font-bold tracking-tight text-indigo-900 mx-auto">
        Your location
      </h2>
       <div>
        Longitude: {props.longitude}, Latitude: {props.latitude}
      </div>
      <div>
        Width: {screenDimensions.width}, Height: {screenDimensions.height}
      </div> */}

      {props.latitude && props.longitude && (
        <MapContainer
          center={[props.latitude, props.longitude]}
          zoom={15}
          scrollWheelZoom={true}
          className={styles["map-container"]}
          attributionControl={false}
        >
          <TileLayer
            attribution='<img src="https://www.onemap.gov.sg/web-assets/images/logo/om_logo.png" style="height:20px;width:20px;"/>&nbsp;<a href="https://www.onemap.gov.sg/" target="_blank" rel="noopener noreferrer">OneMap</a>&nbsp;&copy;&nbsp;contributors&nbsp;&#124;&nbsp;<a href="https://www.sla.gov.sg/" target="_blank" rel="noopener noreferrer">Singapore Land Authority</a>'
            url="https://www.onemap.gov.sg/maps/tiles/Default/{z}/{x}/{y}.png"
            // url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
            minZoom={11}
            maxZoom={19}
            detectRetina={true}
          />
          <AttributionControl position="bottomright" prefix={false} />
          <Marker position={[props.latitude, props.longitude]}>
            <Popup>You</Popup>
          </Marker>
          <Marker position={[props.latitude - 0.001, props.longitude - 0.001]}>
            <Popup>Food</Popup>
          </Marker>
          <ResizeMap />
        </MapContainer>
      )}
    </div>
  );
};

export default DisplayMap;
