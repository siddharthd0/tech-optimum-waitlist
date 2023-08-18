import { useState } from "react";
import {
  Box,
  Button,
  Input,
  VStack,
  Text,
  useToast,
  Flex, // For centering
  Image,
  Switch,
  FormControl,
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalCloseButton,
  useDisclosure,
  ModalBody,
  ModalFooter,
  FormLabel,
  Link,
} from "@chakra-ui/react";
import Confetti from "react-confetti";
import { useMemo } from "react";

export default function Home({ waitlist }) {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [submitted, setSubmitted] = useState(false);
  const [showConfetti, setShowConfetti] = useState(false); // For confetti animation
  const toast = useToast();

  const capitalizeWords = (str) =>
    str
      .split(" ")
      .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
      .join(" ");

  const handleSubmit = async () => {
    if (!name || !email) {
      toast({
        title: "Validation error.",
        description: "Both name and email are required.",
        status: "error",
        duration: 5000,
        isClosable: true,
      });
      return;
    }

    try {
      const response = await fetch("/api/submit", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ name: capitalizeWords(name), email }),
      });

      const data = await response.json();
      if (response.ok) {
        // Check if the response status is OK
        setSubmitted(true);
        toast({
          description: data.message, // This will include the user's position in the waitlist
          status: "success",
          duration: 5000,
          isClosable: true,
        });
        setShowConfetti(true);
        setTimeout(() => setShowConfetti(false), 13000);
      } else {
        toast({
          description: data.message,
          status: "error",
          duration: 5000,
          isClosable: true,
        });
      }
    } catch (error) {
      toast({
        title: "Error.",
        description: "There was an error submitting the form.",
        status: "error",
        duration: 5000,
        isClosable: true,
      });
    }
  };

  const [isPublic, setIsPublic] = useState(true);
  const { isOpen, onOpen, onClose } = useDisclosure();

  return (
    <>
      {showConfetti && <Confetti />}
      <Flex
        px={["3rem", "0"]}
        minHeight="100vh"
        width="100%"
        alignItems="center"
        justifyContent="center"
      >
        <Box width={["100%", "90%", "80%", "400px"]}>
          <Link href="https://techoptimum.org" isExternal>
            <Image
              maxW="200px"
              src="/text-lblue-transparent.png"
              alt="Tech Optimum Logo"
              mb={6}
            />
          </Link>

          <Box mb={4}>
            <Text fontSize="md" fontStyle="italic">
              Tech Optimum — a new way of learning through project-based micro
              hackathons that are 6 hours long.
            </Text>
            <Button mt={2} variant="link" color="blue.100" onClick={onOpen}>
              learn more about our vision
            </Button>

            <Modal
              isOpen={isOpen}
              onClose={onClose}
              isCentered
              colorScheme="teal"
            >
              <ModalOverlay />
              <ModalContent bg="gray.800" color="white">
                <ModalHeader>our vision</ModalHeader>
                <ModalCloseButton />
                <ModalBody>
                  <Text fontWeight="bold" fontSize="lg" mb={4}>
                    why traditional courses don't work
                  </Text>
                  <Text mb={3}>
                    courses have become an outdated means of learning. many fall
                    into the trap of endless tutorials without gaining practical
                    experience.
                  </Text>

                  <Text fontWeight="bold" fontSize="lg" mb={4}>
                    escape the tutorial hell
                  </Text>
                  <Text mb={3}>
                    it's easy to get stuck in a loop of tutorials. but true
                    learning happens when you break free and start building.
                  </Text>

                  <Text fontWeight="bold" fontSize="lg" mb={4}>
                    save your money
                  </Text>
                  <Text mb={3}>
                    stop spending on courses that don't provide real value. your
                    time and money deserve better.
                  </Text>

                  <Text fontWeight="bold" fontSize="lg" mb={4}>
                    micro hackathons - the future of learning
                  </Text>
                  <Text mb={3}>
                    they're fun, immersive, and collaborative. dive deep into
                    coding through project-based challenges and competitions.
                    apply your skills in real-time, and watch your capabilities
                    grow.
                  </Text>
                </ModalBody>
                <ModalFooter>
                  <Button
                    variant="outline"
                    colorScheme="white"
                    mr={3}
                    onClick={onClose}
                  >
                    join the waitlist now
                  </Button>
                </ModalFooter>
              </ModalContent>
            </Modal>
          </Box>
          {submitted ? (
            <Text>thanks for joining the waitlist, {name}!</Text>
          ) : (
            <VStack spacing={4}>
              <Input
                variant="flushed"
                placeholder="name"
                value={name}
                onChange={(e) => setName(e.target.value.toLowerCase())}
              />
              <Input
                variant="flushed"
                placeholder="email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value.toLowerCase())}
              />

              <Button colorScheme="black" onClick={handleSubmit}>
                join waitlist
              </Button>
            </VStack>
          )}
        </Box>
      </Flex>
    </>
  );
}
