import {Metadata} from '@redwoodjs/web'
import {Button, Center} from "@mantine/core";
import {useAuth} from "src/auth";

const LoginPage = () => {
    const {isAuthenticated, logOut} = useAuth()
    return (
        <>
            <Metadata title="Connexion" description="Page de Connexion"/>

            <Center h={'100vh'}>
                {isAuthenticated ? (
                    <a href={'/.redwood/functions/openid/logout'} onClick={logOut}>
                        <Button fullWidth radius="md" color={"red"}>
                            Se Déconnecter
                        </Button>
                    </a>

                ) : (
                    <a href={'/.redwood/functions/openid/auth'}>
                        <Button fullWidth radius="md">
                            Se Connecter
                        </Button>
                    </a>
                )}
            </Center>
        </>
    )
}

export default LoginPage
