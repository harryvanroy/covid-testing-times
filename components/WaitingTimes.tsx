import React, { useState, useEffect } from "react";
import {
  Modal,
  ModalOverlay,
  ModalHeader,
  ModalBody,
  ModalFooter,
  ModalContent,
  ModalCloseButton,
  Text,
  Spinner,
  Flex,
  Table,
  Tbody,
  Td,
  Th,
  Thead,
  Tr,
  Tag,
  Divider,
} from "@chakra-ui/react";
import { collection, getDocs } from "firebase/firestore";
import { database } from "../firebase";
import { DocumentData } from "firebase/firestore";

interface WaitingTimeFormProps {
  clinic: DocumentData;
  isOpen: boolean;
  onClose: () => void;
}

export const WaitingTimes = ({
  clinic,
  isOpen,
  onClose,
}: WaitingTimeFormProps) => {
  const [waitingTimes, setWaitingTimes] = useState<Array<DocumentData>>([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      const querySnapshot = await getDocs(
        collection(database, "clinics", clinic.id, "waitingTimes")
      );
      querySnapshot.forEach((doc) => {
        setWaitingTimes((waitingTimes) => [
          ...waitingTimes,
          { ...doc.data(), id: doc.id },
        ]);
      });
    };
    fetchData();
    setLoading(false);
  }, []);

  return (
    <Modal isOpen={isOpen} onClose={onClose}>
      <ModalOverlay />
      <ModalContent>
        <ModalHeader>
          Recent Waiting Times
          <Divider />
          <Tag colorScheme="blue" mt="10px">
            {waitingTimes?.length ? (
              <>
                Average Wait Time:{" "}
                {(
                  waitingTimes
                    .map((waitingTime) => waitingTime.waitingTime)
                    .reduce((a, b) => a + b, 0) / waitingTimes.length
                ).toFixed(2)}{" "}
                minutes{" "}
              </>
            ) : (
              <Text>No Times Provided</Text>
            )}
          </Tag>
        </ModalHeader>
        <ModalCloseButton />
        <ModalBody maxHeight="400px" overflow="scroll">
          {loading ? (
            <Flex justifyContent="center" alignItems="center">
              <Spinner />
            </Flex>
          ) : (
            <Table variant="simple">
              <Thead>
                <Tr>
                  <Th>Time Added</Th>
                  <Th>Starting Time in Queue</Th>
                  <Th isNumeric>Time in Queue (mins)</Th>
                </Tr>
              </Thead>
              <Tbody>
                {waitingTimes
                  .sort(
                    (a, b) => b.currentTime.toDate() - a.currentTime.toDate()
                  )
                  .map((waitingTime) => (
                    <Tr key={waitingTime.id}>
                      <Td>
                        {waitingTime.currentTime.toDate().toLocaleString()}
                      </Td>
                      <Td>{waitingTime.startingTime}</Td>
                      <Td isNumeric>{waitingTime.waitingTime}</Td>
                    </Tr>
                  ))}
              </Tbody>
            </Table>
          )}
        </ModalBody>
        <ModalFooter>
          <Text as="em" fontSize="xs">
            {clinic.name}
          </Text>
        </ModalFooter>
      </ModalContent>
    </Modal>
  );
};
