import { Box, HStack, VStack, Text, Heading, AspectRatio, Badge, Divider, Image, Container, useColorMode, Stack } from "@chakra-ui/react"
import { useEffect, useState } from "react"
import Head from 'next/head'
import styles from '../styles/Home.module.css'
import { onSnapshot, collection } from "firebase/firestore";
import db from '../pages/api/firebase'

// Components
import Header from "../components/Header";
import ProjectsBox from "../components/ProjectsBox"
import TabBox from "../components/TabBox";
import MTabBox from '../components/MobileTabBox'
import HobbiesBox from '../components/hobbies'

export default function Home() {
  // Data Variables
  const [schools, setSchools] = useState([])
  const [roles, setRoles] = useState([])
  let tempSchools = []
  let tempRoles = []
  const months = ["Jan", "Feb", 'Mar', 'Apr', 'May', 'June', 'July', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec']

  useEffect(() => {
    document.title = "Ethan Chew";

    onSnapshot(collection(db, "jobschools"), (data) => {
      let temp = data.docs.map((doc) => doc.data())
      
      for (let i = 0; i < temp.length; i++) {
        if (temp[i].location == "") {
          tempSchools.push(temp[i])
        } else {
          tempRoles.push(temp[i])
        }
      }

      const sortDate = (valA, valB) => {
        // Check Date Format
        if (!isNaN(valA.startDate) || !isNaN(valA.startDate)) {
          // Just Year
          if (valA.startDate !== valB.startDate) {
            if (valA.startDate > valB.startDate) {
              return -1
            } else {
              return 1
            }
          } else {
            if (valA.endDate !== valB.endDate) {
              return valA.endDate - valB.endDate
            }
          }
        } else {
          if (valA.endDate === "Current") {
            return -1
          } else if (valB.endDate === "Current") {
            return 1
          } else {
            // Month Year
            const aMonth = valA.startDate.split(" ")[0]
            const bMonth = valB.startDate.split(" ")[0]
            return months.indexOf(aMonth) - months.indexOf(bMonth)
          }
        }
      }

      setSchools(tempSchools.sort(sortDate))
      setRoles(tempRoles.sort(sortDate))
    })
  }, [])

  return (    
    <Container maxW={'4xl'}>
      <Head>
        <title>Ethan Chew</title>
        <meta name="title" content="Ethan Chew"/>
        <meta name="description" content="I'm Ethan Chew, a 16 year old, studying Computing in the School of Science and Technology, Singapore."/>

        <meta property="og:type" content="website"/>
        <meta property="og:url" content="https://www.ethanchew.com"/>
        <meta property="og:title" content="Ethan Chew"/>
        <meta property="og:description" content="I'm Ethan Chew, a 16 year old, studying Computing in the School of Science and Technology, Singapore."/>
        <meta property="og:image" content="https://www.ethanchew.com/assets/img/Social%20Media%20Img.png"/>

        <meta property="twitter:card" content="summary_large_image"/>
        <meta property="twitter:url" content="https://www.ethanchew.com"/>
        <meta property="twitter:title" content="Ethan Chew"/>
        <meta property="twitter:description" content="I'm Ethan Chew, a 16 year old, studying Computing in the School of Science and Technology, Singapore."/>
        <meta property="twitter:image" content="https://www.ethanchew.com/assets/img/Social%20Media%20Img.png"/>
      </Head>
      <Stack as={Box} spacing={10} alignItems="center">
        <Header />

        <Container maxW="container.lg" py={4} spacing={4} justify={{ base: 'center', md: 'space-between' }} align={{ base: 'center', md: 'center' }}>
          <Heading mb={4}>Education</Heading>
          <VStack alignItems="left" spacing={5}>
            {schools.map((school) => (
              <EducationBox key={school.name} school={school} />
            ))}
          </VStack>
        </Container>

        <Divider />

        <Container maxW="container.lg">
          <Heading mb={4}>Leadership Experience</Heading>
          <VStack spacing={3} alignItems="left">
            {roles.map((job) => (
              <ExpBox key={job.name} data={job} />
            ))}
          </VStack>
        </Container>

        <Divider />

        <Container maxW="container.lg">
          <Heading mb={4}>Projects</Heading>
          <ProjectsBox />
        </Container>

        <Divider />

        {/* <Container maxW="container.lg">
          <Heading mb={4}>My Hobbies</Heading>
          <HobbiesBox />
        </Container>

        <Divider /> */}

        <Container maxW="container.lg">
          <Heading mb={4}>Knowledge and Skills</Heading>
          <TabBox />
          <MTabBox />
        </Container>
      </Stack>
    </Container>
  )
}

const EducationBox = ({school}) => {
  const { colorMode } = useColorMode();

  return(
    <>
      <VStack alignItems="left">
        {school.name === "School of Science and Technology, Singapore" ? <Image src="/sst.png" alt="School of Science and Technology, Singapore" height="90px" width="340px" borderRadius="md" fallbackSrc="https://via.placeholder.com/100" /> : null}
        {school.name === "Swift Accelerator Program" ? <Image src="sap.webp" alt="Swift Accelerator Program" height="90px" width="120px" borderRadius="md" fallbackSrc="https://via.placeholder.com/100" /> : null}
        <HStack>
          <Text fontSize="20px"><b>{school.name}</b></Text>
          {school.endYear > "2021" ? <Badge colorScheme="green">Current</Badge> : null}
        </HStack>
        <AspectRatio ratio={4/1} maxW="110px">
          <Box p={2} borderRadius="md" bg={colorMode === "light" ? "#EDF2F7" : "grey"}>
            <Text>{school.startDate} - {school.endDate}</Text>
          </Box>
        </AspectRatio>
        <Text>{school.desc}</Text>
      </VStack>
    </>
  )
}

const ExpBox = ({data}) => {
  const { colorMode } = useColorMode();

  return(
    <>
      <VStack alignItems="left">
        {(data.location === "SST Inc.") ? <Image src="/sstinc.webp" alt="SST Inc." height="70px" width="130px" /> : colorMode === "light" ? <Image src="/ScoutLogo.png" alt="Singapore Scouts Association" height="85px" width="330px" /> : <Image src="/ScoutLogoWhite.png" alt="Singapore Scouts Association" height="85px" width="330px" />}
        <Text fontSize="20px"><b>{data.name} - {data.location}</b></Text>
        <AspectRatio ratio={6/1} maxW="190px">
          <Box p={2} borderRadius="md" bg={colorMode === "light" ? "#EDF2F7" : "grey"}>
            <Text>{data.startDate} - {data.endDate === "Current" ? <b>Current</b> : data.endDate}</Text>
          </Box>
        </AspectRatio>
        <Text>{data.desc}</Text>
      </VStack>
    </>
  )
}