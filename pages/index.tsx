import { useState } from "react";
import { Box, Flex } from "@chakra-ui/react";
import type { NextPage } from "next";
import dynamic from "next/dynamic";
import { Sidebar } from "../components/Sidebar";

const Map = dynamic(() => import("../components/Map"), {
  ssr: false,
});

const Home: NextPage = () => {
  const [viewMap, setViewMap] = useState(false);

  return (
    <Flex height="100vh" width="100%">
      <Box
        height="100%"
        width={{ base: viewMap ? "100%" : "0px", md: "100%" }}
        display={{ base: viewMap ? "block" : "none", md: "block" }}
      >
        <Map setViewMap={setViewMap} viewMap={viewMap} />
      </Box>
      <Box
        width={{ base: viewMap ? "0px" : "100%", md: "600px" }}
        display={{ base: viewMap ? "none" : "block", md: "block" }}
      >
        <Sidebar setViewMap={setViewMap} viewMap={viewMap} />
      </Box>
    </Flex>
  );
};

export default Home;
