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
  Button,
  useDisclosure,
} from "@chakra-ui/react";
import { PhoneIcon, Search2Icon, TimeIcon, AddIcon } from "@chakra-ui/icons";
import { WaitingTimeForm } from "./WaitingTimeForm";
import { DocumentData } from "firebase/firestore";
import { useLocation } from "../context/LocationContext";
import { WaitingTimes } from "./WaitingTimes";

interface ClinicProps {
  clinic: DocumentData;
  isSideBar: boolean;
}

export const Clinic = ({ clinic, isSideBar }: ClinicProps) => {
  const { updateLocation } = useLocation();
  const { isOpen, onOpen, onClose } = useDisclosure();
  const {
    isOpen: isOpenTimes,
    onOpen: onOpenTimes,
    onClose: onCloseTimes,
  } = useDisclosure();

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
      <Box mb="10px">
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
        </List>
      </Box>
      <HStack spacing="10px">
        <Button colorScheme="blue" size="xs" onClick={onOpenTimes}>
          Check Waiting Times
        </Button>
        <Button
          leftIcon={<AddIcon />}
          colorScheme="blue"
          size="xs"
          onClick={onOpen}
        >
          Add Waiting Time
        </Button>
      </HStack>
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
      <WaitingTimeForm isOpen={isOpen} onClose={onClose} clinic={clinic} />
      <WaitingTimes
        isOpen={isOpenTimes}
        onClose={onCloseTimes}
        clinic={clinic}
      />
    </Box>
  );
};
