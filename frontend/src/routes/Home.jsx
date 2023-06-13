import React, { useEffect, useState, useRef } from "react";
import { Navigate } from "react-router-dom";
import { Button, Box, Card, CardBody, CardFooter, Grid, GridItem, Text, Spinner, Input } from "@chakra-ui/react";
import { IoAdd } from "react-icons/io5";
import useAuth from "../hooks/useAuth";
import EmailVerifyModal from "../components/EmailVerifyModal";
import CompleteProfileModal from "../components/CompleteProfileModal";
import Header from "../components/Header";
import LineChart from "../components/LineChart";
import Chat from "../components/Chat";

function Home() {
    const { user, gettingUserAuthStatus } = useAuth();
    const [chartHeight, setChartHeight] = useState();
    const gridRef = useRef();

    useEffect(() => {
        document.title = "Satoshi Safe";
    }, []);

    useEffect(() => {
        if (gridRef.current) {
            setChartHeight(gridRef.current.clientHeight);
        }
    }, [user]);

    useEffect(() => {
        const updateSize = () => {
            if (gridRef.current) {
                setChartHeight(gridRef.current.clientHeight);
            }
        };
        updateSize();
        window.addEventListener("resize", updateSize);
        return () => window.removeEventListener("resize", updateSize);
    }, []);

    if (gettingUserAuthStatus) {
        return <Spinner color="blue.500" speed="1s" size="xl" thickness="4px" emptyColor="gray.200" margin="auto" />;
    }

    if (!user) {
        return <Navigate to="/signin" />;
    }

    if (user && !user.emailVerified) {
        return <EmailVerifyModal user={user} />;
    }

    return (
        <>
            <CompleteProfileModal />
            <Header />
            <Grid
                height="100%"
                minHeight="500px"
                gap="20px"
                padding="10px"
                gridTemplateRows="1fr 1fr"
                gridTemplateColumns="0.8fr 2fr 1fr"
                gridTemplateAreas="
                    'one two four'
                    'one three four'
                "
            >
                <GridItem minWidth="250px" area="one">
                    <Card height="100%">
                        <CardBody>
                            <Text fontSize="lg" fontWeight="bold">
                                Wallets
                            </Text>
                        </CardBody>
                        <CardFooter>
                            <Button leftIcon={<IoAdd size="25px" />} width="100%" colorScheme="green300">
                                Add Satoshi Safe
                            </Button>
                        </CardFooter>
                    </Card>
                </GridItem>
                <GridItem minWidth="350px" minHeight="100%" area="two" ref={gridRef}>
                    <Card height="100%">
                        <CardBody>
                            <Text fontSize="lg" fontWeight="bold">
                                Portfolio
                            </Text>
                            {/* deducting the heigh of top/bottom padding and card title for perfect chart resize */}
                            {chartHeight && (
                                <Box
                                    position="relative"
                                    display="inline-block"
                                    width="100%"
                                    height={chartHeight - 20 * 2 - 28}
                                >
                                    <LineChart />
                                </Box>
                            )}
                        </CardBody>
                    </Card>
                </GridItem>
                <GridItem minWidth="350px" minHeight="100%" area="three">
                    <Chat />
                </GridItem>
                <GridItem minWidth="300px" area="four">
                    <Card height="100%">
                        <CardBody>
                            <Text fontSize="lg" fontWeight="bold">
                                Actions
                            </Text>
                            <Input marginTop="10px" placeholder="Filter actions" />
                        </CardBody>
                        <CardFooter>
                            <Button leftIcon={<IoAdd size="25px" />} width="100%" colorScheme="green300">
                                Add protocol function
                            </Button>
                        </CardFooter>
                    </Card>
                </GridItem>
            </Grid>
        </>
    );
}

export default Home;
