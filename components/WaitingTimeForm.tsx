import React, { useState } from "react";
import {
  Modal,
  ModalOverlay,
  ModalHeader,
  ModalBody,
  ModalFooter,
  ModalContent,
  ModalCloseButton,
  Button,
  Text,
  FormControl,
  FormLabel,
  Input,
  NumberInput,
  NumberInputField,
  NumberInputStepper,
  NumberIncrementStepper,
  NumberDecrementStepper,
  Spinner,
  Flex,
  Alert,
} from "@chakra-ui/react";
import { AlertIcon } from "@chakra-ui/react";
import { collection, addDoc, getDocs, where, query } from "firebase/firestore";
import { database } from "../firebase";
import { DocumentData } from "firebase/firestore";
import { User } from "firebase/auth";

interface WaitingTimeFormProps {
  clinic: DocumentData;
  isOpen: boolean;
  onClose: () => void;
  user: User | undefined;
}

export const WaitingTimeForm = ({
  clinic,
  isOpen,
  onClose,
  user,
}: WaitingTimeFormProps) => {
  const [waitingTime, setWaitingTime] = useState(0);
  const [startingTime, setStartingTime] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit: React.FormEventHandler = async (e) => {
    e.preventDefault();

    setLoading(true);

    const q = query(
      collection(database, "clinics", clinic.id, "waitingTimes"),
      where("email", "==", user?.email)
    );
    const querySnapshot = await getDocs(q);

    const oneDay = 24 * 60 * 60 * 1000;

    let canSubmit = true;
    querySnapshot.forEach((doc) => {
      if (Date.now() - doc.data().currentTime.toDate() < oneDay) {
        setError("You have submitted a waiting time for this clinic recently.");
        canSubmit = false;
      }
    });

    if (!canSubmit) {
      setLoading(false);
      return;
    }

    const docRef = await addDoc(
      collection(database, "clinics", clinic.id, "waitingTimes"),
      {
        waitingTime,
        startingTime,
        currentTime: new Date(),
        email: user?.email,
      }
    );
    setLoading(false);
    onClose();
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose}>
      <ModalOverlay />
      <ModalContent>
        <ModalHeader>Add Waiting Time</ModalHeader>
        <ModalCloseButton />
        {error ? (
          <Alert status="error">
            {error}
            <AlertIcon />
          </Alert>
        ) : null}
        <ModalBody>
          {loading ? (
            <Flex justifyContent="center" alignItems="center">
              <Spinner />
            </Flex>
          ) : (
            <form onSubmit={handleSubmit}>
              <FormControl isRequired>
                <FormLabel>Start Time</FormLabel>
                <Input
                  type="time"
                  placeholder="Start Time"
                  onChange={(e) => setStartingTime(e.currentTarget.value)}
                />
              </FormControl>
              <FormControl isRequired mt="4px">
                <FormLabel>Time in Queue (mins)</FormLabel>
                <NumberInput
                  min={0}
                  max={720}
                  onChange={(v) => setWaitingTime(parseInt(v))}
                >
                  <NumberInputField />
                  <NumberInputStepper>
                    <NumberIncrementStepper />
                    <NumberDecrementStepper />
                  </NumberInputStepper>
                </NumberInput>
              </FormControl>
              {user ? (
                <Button
                  variant="solid"
                  colorScheme="blue"
                  type="submit"
                  mt="8px"
                  sx={{ float: "right" }}
                >
                  Submit
                </Button>
              ) : (
                <Text>Not authenticated with Google</Text>
              )}
            </form>
          )}
        </ModalBody>
        <ModalFooter>
          <Text as="em">{clinic.name}</Text>
        </ModalFooter>
      </ModalContent>
    </Modal>
  );
};
