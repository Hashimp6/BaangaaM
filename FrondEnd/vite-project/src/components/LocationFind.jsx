import { useState, useEffect, useCallback } from "react";
import PropTypes from "prop-types";
import { GoogleMap, useLoadScript } from "@react-google-maps/api";

const mapContainerStyle = {
  width: "45vw",
  height: "50vh",
};

const center = {
  lat: -34.397, // Default center (optional)
  lng: 150.644,
};

const options = {
  disableDefaultUI: true,
  zoomControl: true,
};

const libraries = ["marker"];

function LocationFinder({ setGeolocation,setShowLocation }) {
  const { isLoaded, loadError } = useLoadScript({
    googleMapsApiKey: "AIzaSyAWdpzsOIeDYSG76s3OncbRHmm5pBwiG24", // Add your API key here
    libraries,
    version: "weekly",
  });

  const [currentPosition, setCurrentPosition] = useState(null);
  const [map, setMap] = useState(null);
  const [marker, setMarker] = useState(null);

  const mapId = "AIzaSyAWdpzsOIeDYSG76s3OncbRHmm5pBwiG24"; // Replace with your actual Map ID

  useEffect(() => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition((position) => {
        const pos = {
          lat: position.coords.latitude,
          lng: position.coords.longitude,
        };
        setCurrentPosition(pos);
        setGeolocation(pos);
      });
    }
  }, [setGeolocation]);

  const onLoad = useCallback((mapInstance) => {
    setMap(mapInstance);
  }, []);

  useEffect(() => {
    if (isLoaded && map && currentPosition) {
      if (marker) {
        marker.setMap(null);
      }
      const newMarker = new window.google.maps.marker.AdvancedMarkerElement({
        position: currentPosition,
        map: map,
      });
      setMarker(newMarker);
    }
  }, [isLoaded, map, currentPosition]);

  if (loadError) return <div>Error loading maps</div>;
  if (!isLoaded) return <div>Loading Maps...</div>;

  const handleSubmit=()=>{
    setGeolocation(currentPosition)
    console.log(currentPosition);
    setShowLocation(null)
  }

  return (
    <div>
      <h1>Live Location</h1>

      <GoogleMap
        mapContainerStyle={mapContainerStyle}
        zoom={12}
        center={currentPosition || center}
        options={{
          ...options,
          mapId: mapId,
        }}
        onLoad={onLoad}
      >
        {/* AdvancedMarkerElement is handled in the useEffect hook */}
      </GoogleMap>
      <button
        style={{
          backgroundColor: "#008080",
          color: "white",
          border: "none",
          width: "10vw",
          padding: "10px 20px",
          borderRadius: "5px",
          cursor: "pointer",
          fontSize: "16px",
        }}
        onClick={() => handleSubmit()}
      >
        OK
      </button>
    </div>
  );
}

LocationFinder.propTypes = {
  setGeolocation: PropTypes.func.isRequired,
  setShowLocation: PropTypes.func.isRequired,
};

export default LocationFinder;