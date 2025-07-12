import { ActionIcon, Button, Flex, Text } from "@mantine/core";
import { IconHome, IconPizza } from '@tabler/icons-react';
import { useNavigate } from "react-router";
import { useUser } from "../context/UserContext";

const NavBar = () => {
    const navigate = useNavigate();
    const { user, setUser } = useUser();

    const handleLogout = () => {
        navigate("/login");
        setUser(null);
    }

    return (
        <Flex w="100%" justify={"space-between"} mb={50} align={"center"}>
            <Flex gap={"md"}>
                <IconPizza style={{ width: '2rem', height: '2rem' }} stroke={1.5} color="#228be6"/>
                <Text fz={"1.5rem"}>Pringles</Text>
            </Flex>
            {user && <Flex gap={"md"}>
                <ActionIcon variant="light" aria-label="Home" size={"lg"} onClick={() => navigate("/dashboard")}>
                    <IconHome style={{ width: '70%', height: '70%' }} stroke={1.5} />
                </ActionIcon>
                <Button variant="light" onClick={handleLogout}>LOGOUT</Button>
            </Flex>}
        </Flex>
    );
}

export default NavBar;