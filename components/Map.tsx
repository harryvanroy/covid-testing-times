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

const Map = () => {
  const { clinics, location } = useLocation();

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
