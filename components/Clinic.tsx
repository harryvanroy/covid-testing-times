import React from "react";
import {
  Box,
  Tag,
  Divider,
  HStack,
  Heading,
  List,
  ListItem,
  ListIcon,
  chakra,
} from "@chakra-ui/react";
import { PhoneIcon, Search2Icon, TimeIcon } from "@chakra-ui/icons";

import { DocumentData } from "firebase/firestore";
import { useLocation } from "../context/LocationContext";

export const Clinic = ({ clinic }: DocumentData) => {
  const { updateLocation } = useLocation();

  const handleClick = () => {
    updateLocation({
      lat: clinic.latitude,
      lng: clinic.longitude,
    });
  };
  return (
    <Box borderWidth="1px" width="100%" p="6px" onClick={handleClick}>
      <Heading size="h6">{clinic.name}</Heading>
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
