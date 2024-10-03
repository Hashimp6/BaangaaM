import { useEffect, useState, useMemo } from "react";
import { GoogleMap, useLoadScript } from "@react-google-maps/api";
import PropTypes from "prop-types";

const mapContainerStyle = { width: "45vw", height: "50vh" };
const center = {
  lat: 9.9312, // Latitude for Kochi
  lng: 76.2673, // Longitude for Kochi
};
const options = {
  disableDefaultUI: true,
  zoomControl: true,
};

// Define libraries outside of the component
const libraries = ["marker"];

function SelectedLocation({ setGeolocation , setShowLocation}) {
  const { isLoaded, loadError } = useLoadScript({
    googleMapsApiKey: "AIzaSyAWdpzsOIeDYSG76s3OncbRHmm5pBwiG24",
    libraries,
  });

  const [selectedPosition, setSelectedPosition] = useState(null);
  const [currentPosition, setCurrentPosition] = useState(null);
  const [map, setMap] = useState(null);
  const [marker, setMarker] = useState(null);

  // Define mapId
  const mapId = "AIzaSyAWdpzsOIeDYSG76s3OncbRHmm5pBwiG24";

  useEffect(() => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition((position) => {
        setCurrentPosition({
          lat: position.coords.latitude,
          lng: position.coords.longitude,
        });
      });
    }
  }, []);

  useEffect(() => {
    if (isLoaded && map && selectedPosition) {
      if (marker) {
        marker.setMap(null);
      }
      const newMarker = new window.google.maps.marker.AdvancedMarkerElement({
        position: selectedPosition,
        map: map,
      });
      setMarker(newMarker);
    }
  }, [isLoaded, map, selectedPosition]);

  const onLoad = useMemo(() => (mapInstance) => {
    setMap(mapInstance);
  }, []);

  if (loadError) return <div>Error loading maps</div>;
  if (!isLoaded) return <div>Loading Maps...</div>;

  const handleMapClick = (event) => {
    setSelectedPosition({
      lat: event.latLng.lat(),
      lng: event.latLng.lng(),
    });
  };

  const handleSubmit=()=>{
    setGeolocation(selectedPosition)
    console.log(selectedPosition);
    setShowLocation(null)
  }
  return (
    <div style={{ alignItems: "center" }}>
      <h1>Select your Location</h1>
      <GoogleMap
        mapContainerStyle={mapContainerStyle}
        zoom={12}
        center={selectedPosition || currentPosition || center}
        options={{
          ...options,
          mapId: mapId, // Add the mapId here
        }}
        onClick={handleMapClick}
        onLoad={onLoad}
      />
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

SelectedLocation.propTypes = {
  setGeolocation: PropTypes.func.isRequired,
  setShowLocation: PropTypes.func.isRequired,
};

export default SelectedLocation;