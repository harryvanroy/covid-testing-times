/* eslint-disable react/no-children-prop */
import React from "react";
import {
  Box,
  Flex,
  Button,
  Divider,
  Spinner,
  Heading,
  VStack,
} from "@chakra-ui/react";
import { SearchIcon } from "@chakra-ui/icons";
import { useLocation } from "../context/LocationContext";
import { Clinic } from "./Clinic";

export const Sidebar = () => {
  const { clinics, location } = useLocation();

  return (
    <Flex direction="column" height="100%">
      <Flex h="100px" alignItems="center" justifyContent="center">
        <Heading size="lg">COVID-19 Testing Times 🦠🧪</Heading>
      </Flex>
      <Divider my="3px" />
      <Flex p="6px" justifyContent="center">
        <Button leftIcon={<SearchIcon />} colorScheme="teal" variant="solid">
          Search area
        </Button>
        <Flex alignItems="center" justifyContent="center" p="10px">
          <Heading size="sm">Testing clinics</Heading>
        </Flex>
      </Flex>
      <Divider my="3px" />
      <VStack flex="1" p="6px" overflow="scroll">
        {clinics?.length ? (
          clinics.map((clinic) => <Clinic key={clinic.id} clinic={clinic} />)
        ) : (
          <Spinner mx="auto" />
        )}
      </VStack>
    </Flex>
  );
};
