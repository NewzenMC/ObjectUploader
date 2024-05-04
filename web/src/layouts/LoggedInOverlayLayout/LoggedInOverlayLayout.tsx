import {Avatar, Button, Dialog, Grid, Group, Text} from "@mantine/core";
import {Link, routes} from "@redwoodjs/router";
import {IconLogout} from "@tabler/icons-react";
import {useAuth} from "src/auth";

type LoggedInOverlayLayoutProps = {
    children?: React.ReactNode
}

const LoggedInOverlayLayout = ({ children }: LoggedInOverlayLayoutProps) => {
    const {isAuthenticated, currentUser, logOut} = useAuth()
    return <>
        {children}
        {isAuthenticated ? (
            <Dialog opened radius="md" withBorder>
                <Text mb="xs" fw={500}>
                    Actuellement connecté en tant que
                </Text>

                <Grid columns={4}>
                    <Grid.Col span={3}>
                        <Group>
                            <Avatar src={currentUser.avatar}/>
                            <Text
                                lineClamp={1}
                                maw={'60%'}
                                style={{overflow: 'hidden'}}
                            >
                                {currentUser.name}
                            </Text>
                        </Group>
                    </Grid.Col>
                    <Grid.Col span={1}>
                        <Link to={routes.login()}>
                            <Button
                                variant={'outline'}
                                color={'red'}
                                radius="md"
                            >
                                <IconLogout/>
                            </Button>
                        </Link>
                    </Grid.Col>
                </Grid>
            </Dialog>
        ) : null}
    </>
}

export default LoggedInOverlayLayout
