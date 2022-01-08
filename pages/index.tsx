import { Box, Flex } from "@chakra-ui/react";
import type { NextPage } from "next";
import dynamic from "next/dynamic";
import { Sidebar } from "../components/Sidebar";

const Map = dynamic(() => import("../components/Map"), {
  ssr: false,
});

const Home: NextPage = () => {
  return (
    <Flex height="100vh" width="100%">
      <Box height="100%" width="100%">
        <Map />
      </Box>
      <Box width="600px">
        <Sidebar />
      </Box>
    </Flex>
  );
};

export default Home;
