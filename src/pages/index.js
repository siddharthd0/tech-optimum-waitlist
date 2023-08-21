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
  Spacer,
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
import { FaBook, FaCode, FaLaptopCode, FaUsers } from "react-icons/fa";
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
        setSubmitted(true);
        toast({
          description: data.message,
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
        bg="#EFEFEF"
      >
        <Box
          width={["100%", "90%", "80%", "400px"]}
          bg="white"
          p={5}
          borderRadius="md"
          boxShadow="md"
        >
          <Link href="https://techoptimum.org" isExternal>
            <Image
              maxW="150px"
              src="/text-black-transparent-tight.png"
              alt="Tech Optimum Logo"
              mb={6}
            />
          </Link>

          <Box mb={4}>
            <Text color="black">
              Tech Optimum — A New Way of Learning Through Project-Based Micro
              Hackathons That Are 8 Hours Long.
            </Text>
            <Button
              size="sm"
              _hover={{
                bg: "blue.500",
                color: "white",
              }}
              variant="outline"
              mt={2}
              colorScheme="blue"
              onClick={onOpen}
            >
              Learn More About Our Vision
            </Button>

            <Modal
              isOpen={isOpen}
              onClose={onClose}
              size="6xl"
              colorScheme="blue"
            >
              <ModalOverlay />
              <ModalContent p={5}>
                <ModalHeader color="black" fontSize="3xl" fontWeight="bold">
                  Our Vision
                </ModalHeader>
                <ModalCloseButton />
                <ModalBody
                  display="grid"
                  gridTemplateColumns="repeat(2, 1fr)"
                  gap={4}
                >
                  {/* Top Left */}
                  <Box p={3} borderRadius="md" color="green.900" bg="green.100">
                    <FaBook size={40} />
                    <Flex>
                    <Text fontWeight="bold" fontSize="lg" mt={2}>
                      Quality Education
                    </Text>
                    <Spacer/>
                    <Link isExternal href="https://dashboard.techoptimum.org" _hover={{
                      textDecoration: "none",
                      
                    }}>
                    <Button colorScheme="green">
                      Check out our courses
                    </Button>
                    </Link>
                    </Flex>
                    <Text mt={3}>
                      We believe in giving a top-notch computer science
                      education to everyone. That's why we started our online
                      courses.
                    </Text>
                  </Box>

                  {/* Top Right */}
                  <Box
                    p={3}
                    borderRadius="md"
                    color="purple.900"
                    bg="purple.100"
                  >
                    <FaLaptopCode size={40} />
                    <Text fontWeight="bold" fontSize="lg" mt={2}>
                      More Than Just Courses
                    </Text>
                    <Text mt={3}>
                      Courses are a beginning. We believe people learn best by 
                      doing. That's why we created our micro hackathons cohort.
                    </Text>
                  </Box>

                  {/* Bottom Left */}
                  <Box p={3} borderRadius="md" color="cyan.900" bg="cyan.100">
                    <FaCode size={40} />
                    <Text fontWeight="bold" fontSize="lg" mt={2}>
                      Micro Hackathons
                    </Text>
                    <Text mt={3}>
                      Dive into our 8-hour coding competitions every other week.
                      Transform from novice to professional.
                    </Text>
                  </Box>

                  {/* Bottom Right */}
                  <Box
                    p={3}
                    borderRadius="md"
                    color="facebook.900"
                    bg="facebook.100"
                  >
                    <FaUsers size={40} color="blue.800" />
                    <Text fontWeight="bold" fontSize="lg" mt={2}>
                      Become an Epic Coder
                    </Text>
                    <Text mt={3}>
                      Join our 3-month, 9-week program. Challenge yourself,
                      collaborate, and evolve as an outstanding coder.
                    </Text>
                  </Box>
                </ModalBody>
                <ModalFooter>
                  <Button colorScheme="blue" onClick={onClose}>
                    Join the Waitlist Now
                  </Button>
                </ModalFooter>
              </ModalContent>
            </Modal>
          </Box>
          {submitted ? (
            <Text color="black">Thanks for Joining the Waitlist, {name}!</Text>
          ) : (
            <VStack color="black" spacing={4}>
              <Input
                variant="outline"
                placeholder="Name"
                value={name}
                onChange={(e) => setName(capitalizeWords(e.target.value))}
              />
              <Input
                variant="outline"
                placeholder="Email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />

              <Button
                _hover={{
                  bg: "blue.500",
                  color: "white",
                }}
                variant="outline"
                colorScheme="blue"
                onClick={handleSubmit}
              >
                Join Waitlist
              </Button>
            </VStack>
          )}
        </Box>
      </Flex>
    </>
  );
}
