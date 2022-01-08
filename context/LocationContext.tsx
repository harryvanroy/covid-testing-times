import React, {
  useState,
  useContext,
  createContext,
  ReactNode,
  useEffect,
} from "react";
import {
  collection,
  DocumentData,
  getDocs,
  query,
  limit,
  orderBy,
  startAt,
  endAt,
} from "firebase/firestore";
import { database } from "../firebase";
import { geohashQueryBounds, distanceBetween } from "geofire-common";
interface LocationContextType {
  location: {
    lat: number;
    lng: number;
  };
  clinics: Array<DocumentData>;
  loading: boolean;
  updateLocation: (location: any) => void;
  getClinics: () => void;
}

const LocationContext = createContext<LocationContextType>(
  {} as LocationContextType
);

interface LocationProviderProps {
  children: ReactNode;
}

export const LocationProvider = ({ children }: LocationProviderProps) => {
  const [location, setLocation] = useState({
    lat: -27.470125,
    lng: 153.021072,
  });

  const [clinics, setClinics] = useState<Array<DocumentData>>([]);
  const [loading, setLoading] = useState(false);
  const radiusInM = 50 * 1000;

  useEffect(() => {
    navigator.geolocation.getCurrentPosition((position) => {
      setLocation({
        lat: position.coords.latitude,
        lng: position.coords.longitude,
      });
    });

    getClinics();
  }, []);

  const updateLocation = (location: any) => {
    setLocation(location);
  };

  const getClinics = async () => {
    setLoading(true);
    const bounds = geohashQueryBounds([location.lat, location.lng], radiusInM);

    const promises = [];
    for (const b of bounds) {
      const clinicsRef = collection(database, "clinics");
      const q = query(
        clinicsRef,
        orderBy("geohash", "asc"),
        startAt(b[0]),
        endAt(b[1])
      );
      promises.push(getDocs(q));
    }

    Promise.all(promises)
      .then((snapshots) => {
        const matchingDocs = [];

        for (const snap of snapshots) {
          for (const doc of snap.docs) {
            const lat = doc.get("latitude");
            const lng = doc.get("longitude");
            const distanceInKm = distanceBetween(
              [lat, lng],
              [location.lat, location.lng]
            );
            const distanceInM = distanceInKm * 1000;
            if (distanceInM <= radiusInM) {
              matchingDocs.push({ data: doc, distanceInKm });
            }
          }
        }

        return matchingDocs;
      })
      .then((docs) => {
        const cleanDocs = docs.map((doc) => ({
          ...doc.data.data(),
          id: doc.data.id,
          distance: doc.distanceInKm,
        }));
        cleanDocs.sort((a, b) => (a.distance > b.distance ? 1 : -1));
        setClinics(cleanDocs);
        setLoading(false);
      });
  };

  const value = {
    location,
    clinics,
    loading,
    updateLocation,
    getClinics,
  };

  return (
    <LocationContext.Provider value={value}>
      {children}
    </LocationContext.Provider>
  );
};

export const useLocation = () => {
  const context = useContext(LocationContext);

  if (context === undefined) {
    throw new Error("useLocation must be used within a LocationProvider");
  }

  return context;
};
