/* eslint-disable react/no-children-prop */
import React from "react";
import {
  Box,
  Flex,
  Button,
  Divider,
  Heading,
  VStack,
  Text,
  Spinner,
} from "@chakra-ui/react";
import { SearchIcon } from "@chakra-ui/icons";
import { useLocation } from "../context/LocationContext";
import { Clinic } from "./Clinic";

interface SideBarProps {
  setViewMap: (viewMap: boolean) => void;
  viewMap: boolean;
}
export const Sidebar = ({ setViewMap, viewMap }: SideBarProps) => {
  const { clinics, getClinics, loading } = useLocation();

  return (
    <Flex direction="column" height="100%" width="100%">
      <Flex
        h="100px"
        alignItems="center"
        justifyContent="center"
        direction="column"
      >
        <Heading size="lg">🧪 COVID-19 Testing Times</Heading>
      </Flex>
      <Divider my="3px" />
      {!viewMap ? (
        <Button
          leftIcon={<SearchIcon />}
          colorScheme="blue"
          variant="solid"
          onClick={() => setViewMap(!viewMap)}
          display={{ base: "block", md: "none" }}
          mx="3px"
        >
          View Map
        </Button>
      ) : null}
      <Flex p="6px" justifyContent="center">
        <Flex alignItems="center" justifyContent="center" p="10px">
          <Heading size="md">🏥 Current Testing Clinics</Heading>
        </Flex>
      </Flex>
      <Divider my="3px" />
      <VStack flex="1" p="6px" overflow="scroll">
        {!loading ? (
          clinics.map((clinic) => (
            <Clinic key={clinic.id} clinic={clinic} isSideBar={true} />
          ))
        ) : (
          <Spinner />
        )}
      </VStack>
    </Flex>
  );
};
