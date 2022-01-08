import React from "react";
import styles from "./Clinic.module.css";
import {
  Box,
  Tag,
  Divider,
  HStack,
  Heading,
  List,
  ListItem,
  ListIcon,
} from "@chakra-ui/react";
import { PhoneIcon, Search2Icon, TimeIcon } from "@chakra-ui/icons";

import { DocumentData } from "firebase/firestore";
import { useLocation } from "../context/LocationContext";

interface ClinicProps {
  clinic: DocumentData;
  isSideBar: boolean;
}

export const Clinic = ({ clinic, isSideBar }: ClinicProps) => {
  const { updateLocation } = useLocation();

  const handleClick = () => {
    updateLocation({
      lat: clinic.latitude,
      lng: clinic.longitude,
    });
  };
  return (
    <Box
      className={isSideBar ? styles.clinicBox : ""}
      borderWidth="1px"
      width="100%"
      p="6px"
      onClick={handleClick}
    >
      <Heading size="h6">
        <a href={clinic.link} target="_blank" rel="noreferrer">
          {clinic.name}
        </a>
      </Heading>
      <Box>
        <List spacing={0}>
          {clinic?.phone ? (
            <ListItem>
              <ListIcon as={PhoneIcon} color="grey" />
              {clinic.phone}
            </ListItem>
          ) : null}
          {clinic?.address ? (
            <ListItem>
              <ListIcon as={Search2Icon} color="grey" />
              {clinic.address}
            </ListItem>
          ) : null}
          {clinic?.hours ? (
            <ListItem>
              <ListIcon as={TimeIcon} color="grey" />
              {clinic.hours}
            </ListItem>
          ) : null}
          {clinic?.type ? (
            <ListItem>
              <b>Clinic type:</b> {clinic.type}
            </ListItem>
          ) : null}

          {clinic?.pathology ? (
            <ListItem>
              <b>Pathology service:</b> {clinic.pathology}
            </ListItem>
          ) : null}
        </List>
      </Box>
      <Divider my="6px" />
      <HStack spacing="4px">
        {clinic?.isDriveThrough === "Yes" ? (
          <Tag size="sm" variant="solid" colorScheme="green">
            Drive Through
          </Tag>
        ) : null}

        {clinic?.bookingNeeded === "Yes" ? (
          <Tag size="sm" variant="solid" colorScheme="red">
            Booking Needed
          </Tag>
        ) : null}
        {clinic?.isRAT === "Yes" ? (
          <Tag size="sm" variant="solid" colorScheme="blue">
            RAT
          </Tag>
        ) : null}
        {clinic?.referralNeeded === "Yes" ? (
          <Tag size="sm" variant="solid" colorScheme="yellow">
            Referral Needed
          </Tag>
        ) : null}
      </HStack>
    </Box>
  );
};
