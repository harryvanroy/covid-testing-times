import {
  MapContainer,
  TileLayer,
  Marker,
  Popup,
  useMapEvents,
} from "react-leaflet";
import "leaflet/dist/leaflet.css";
import "leaflet-defaulticon-compatibility/dist/leaflet-defaulticon-compatibility.css";
import "leaflet-defaulticon-compatibility";
import { useLocation } from "../context/LocationContext";
import { Clinic } from "../components/Clinic";
import { Button, Box } from "@chakra-ui/react";
import { HamburgerIcon, SearchIcon } from "@chakra-ui/icons";

interface ChangeMapViewProps {
  location: {
    lat: number;
    lng: number;
  };
}

const ChangeMapView = ({ location }: ChangeMapViewProps) => {
  const { updateLocation } = useLocation();

  const map = useMapEvents({
    dragend: (e) => {
      updateLocation(e.target.getCenter());
    },
    zoomend: (e) => {
      updateLocation(e.target.getCenter());
    },
  });
  map.setView([location.lat, location.lng], map.getZoom());
  return null;
};

interface MapProps {
  setViewMap: (viewMap: boolean) => void;
  viewMap: boolean;
}

const Map = ({ setViewMap, viewMap }: MapProps) => {
  const { clinics, location, getClinics } = useLocation();

  const handleClick = () => {
    getClinics();
    setViewMap(!viewMap);
  };

  return (
    <>
      <div className="map">
        <MapContainer
          center={location}
          zoom={15}
          maxBounds={[
            [-180, 180],
            [180, -180],
          ]}
        >
          <ChangeMapView location={location} />
          <Button
            leftIcon={<SearchIcon />}
            colorScheme="blue"
            variant="solid"
            onClick={handleClick}
            mx="3px"
            sx={{ zIndex: 2000, float: "right", margin: "10px" }}
          >
            Search area
          </Button>
          <TileLayer
            url={`https://api.mapbox.com/styles/v1/mapbox/streets-v11/tiles/256/{z}/{x}/{y}@2x?access_token=${process.env.NEXT_PUBLIC_MAPBOX_ACCESS_TOKEN}`}
            attribution='Map data &copy; <a href="https://www.openstreetmap.org/">OpenStreetMap</a> contributors, <a href="https://creativecommons.org/licenses/by-sa/2.0/">CC-BY-SA</a>, Imagery &copy; <a href="https://www.mapbox.com/">Mapbox</a>'
          />
          {clinics?.map((clinic: any) => {
            return (
              <Marker
                key={clinic.id}
                title={clinic.name}
                position={[clinic.latitude, clinic.longitude]}
              >
                <Popup>
                  <Clinic clinic={clinic} isSideBar={false} />
                </Popup>
              </Marker>
            );
          })}
        </MapContainer>
      </div>
    </>
  );
};

export default Map;
