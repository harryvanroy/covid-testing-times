import React, {
  useState,
  useContext,
  createContext,
  ReactNode,
  useEffect,
} from "react";
import { collection, DocumentData, getDocs } from "firebase/firestore";
import { database } from "../firebase";

interface LocationContextType {
  location: {
    lat: number;
    lng: number;
  };
  clinics: Array<DocumentData>;
  updateLocation: (location: any) => void;
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

  useEffect(() => {
    const getClinics = async () => {
      const querySnapshot = await getDocs(collection(database, "clinics"));
      querySnapshot.forEach((clinic) => {
        setClinics((clinics) => [
          ...clinics,
          { ...clinic.data(), id: clinic.id },
        ]);
      });
      /* setClinics([
        {
          id: "asdfasdfasdf",
          address: "Ground Floor, 102 Bolsover St, Rockhampton, 4700",
          bookingNeeded: "Yes",
          hours: "15:00-17:00 M-F, By appointment only on Sat 10:00-13:00.",
          howToFind: "Rock Building",
          isDriveThrough: "No",
          isRAT: "No",
          latitude: -23.375337,
          link: "https://www.snp.com.au/",
          longitude: 150.5093965,
          name: "Sullivan Nicolaides - Rockhampton",
          pathology: "Sullivan Nicolaides",
          phone: "4923 9840",
          postCode: 4700,
          referralNeeded: "No",
          type: "Private",
        },
        {
          id: "1234123",
          address: "Cnr Elliott St and Mills Ave, Moranbah, 4744",
          bookingNeeded: "No",
          hours:
            "Monday- Friday 0900-1200 | Otherwise call hospital outside these hours for instructions for testing.",
          howToFind: "Mill street entrance",
          isDriveThrough: "No",
          latitude: -22.0014615,
          longitude: 148.0545849,
          name: "Moranbah Hospital",
          pathology: "Pathology Queensland",
          phone: "07 4941 4644",
          postCode: 4744,
          referralNeeded: "No",
          type: "Fever",
        },
      ]); */
    };

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

  const value = {
    location,
    clinics,
    updateLocation,
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
