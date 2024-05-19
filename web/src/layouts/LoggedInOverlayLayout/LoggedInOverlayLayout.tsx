import {
    Avatar,
    Button,
    Container,
    Dialog,
    Grid,
    Group,
    Text
} from '@mantine/core'
import { IconLogout } from '@tabler/icons-react'

import { Link, routes } from '@redwoodjs/router'

import { useAuth } from 'src/auth'

type LoggedInOverlayLayoutProps = {
    children?: React.ReactNode
}

const LoggedInOverlayLayout = ({ children }: LoggedInOverlayLayoutProps) => {
    const { isAuthenticated, currentUser } = useAuth()
    return (
        <>
            <Container>
                {children}
                {isAuthenticated ? (
                    <Dialog opened radius="md" withBorder>
                        <Text mb="xs" fw={500}>
                            Actuellement connecté en tant que
                        </Text>

                        <Grid columns={4}>
                            <Grid.Col span={3}>
                                <Group>
                                    <Avatar src={currentUser.avatar} />
                                    <Text
                                        lineClamp={1}
                                        maw={'60%'}
                                        style={{ overflow: 'hidden' }}
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
                                        <IconLogout />
                                    </Button>
                                </Link>
                            </Grid.Col>
                        </Grid>
                    </Dialog>
                ) : null}
            </Container>
        </>
    )
}

export default LoggedInOverlayLayout
