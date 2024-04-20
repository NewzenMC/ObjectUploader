import {
    Avatar,
    Button,
    Card,
    Center,
    Container,
    Dialog,
    Divider,
    Grid,
    Group,
    SimpleGrid,
    Text,
    Title
} from '@mantine/core'
import { IconLogout } from '@tabler/icons-react'

import { Link, routes } from '@redwoodjs/router'
import { Metadata } from '@redwoodjs/web'

const HomePage = () => {
    return (
        <>
            <Metadata title="Accueil" description="Page d'Accueil" />

            <Container>
                <Center h={'100vh'}>
                    <SimpleGrid cols={{ base: 1, sm: 3, lg: 3 }}>
                        <Card shadow="sm" radius="md" withBorder>
                            <Title order={4} fw={500} ta="center">
                                Gérer vos Uploads
                            </Title>

                            <Divider my="md" />

                            <Center h={'10vh'}>
                                <Text size="sm" c="dimmed" ta="center">
                                    Afficher et Gérer vos Uploads
                                </Text>
                            </Center>

                            <Divider my="md" />

                            <Link to={routes.list()}>
                                <Button fullWidth mt="md" radius="md">
                                    Gérer mes Uploads
                                </Button>
                            </Link>
                        </Card>

                        <Card shadow="sm" radius="md" withBorder>
                            <Title order={4} fw={500} ta="center">
                                Effectuer un Upload
                            </Title>

                            <Divider my="md" />

                            <Center h={'10vh'}>
                                <Text size="sm" c="dimmed" ta="center">
                                    Uploader un fichier de manière classique
                                </Text>
                            </Center>

                            <Divider my="md" />

                            <Link to={routes.upload()}>
                                <Button fullWidth mt="md" radius="md">
                                    Uploader un Fichier
                                </Button>
                            </Link>
                        </Card>

                        <Card shadow="sm" radius="md" withBorder>
                            <Title order={4} fw={500} ta="center">
                                Uploader depuis un Terminal
                            </Title>

                            <Divider my="md" />

                            <Center h={'10vh'}>
                                <Text size="sm" c="dimmed" ta="center">
                                    Obtenir une commande permettant
                                    d&apos;uploader un fichier depuis la ligne
                                    de commande
                                </Text>
                            </Center>

                            <Divider my="md" />

                            <Link to={routes.commandLineUpload()}>
                                <Button fullWidth mt="md" radius="md">
                                    Obtenir une Commande
                                </Button>
                            </Link>
                        </Card>
                    </SimpleGrid>
                </Center>
                <Dialog opened radius="md" withBorder>
                    <Text mb="xs" fw={500}>
                        Actuellement connecté en tant que
                    </Text>

                    <Grid columns={4}>
                        <Grid.Col span={3}>
                            <Group>
                                <Avatar src={null} />
                                <Text
                                    lineClamp={1}
                                    maw={'60%'}
                                    style={{ overflow: 'hidden' }}
                                >
                                    Hey Monique
                                </Text>
                            </Group>
                        </Grid.Col>
                        <Grid.Col span={1}>
                            <Link to={routes.home()}>
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
            </Container>
        </>
    )
}

export default HomePage
