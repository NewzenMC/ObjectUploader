import { Link, routes } from '@redwoodjs/router'
import { Metadata } from '@redwoodjs/web'
import {Button} from "@mantine/core";

const CommandLineUploadPage = () => {
    return (
        <>
            <Metadata
                title="CommandLineUpload"
                description="CommandLineUpload page"
            />

            <h1>CommandLineUploadPage</h1>
            <p>
                Find me in{' '}
                <code>
                    ./web/src/pages/CommandLineUploadPage/CommandLineUploadPage.tsx
                </code>
            </p>
            <p>
                My default route is named <code>commandLineUpload</code>, link
                to me with `
                <Link to={routes.commandLineUpload()}>CommandLineUpload</Link>`
            </p>

            <Link to={routes.home()}>
                <Button fullWidth mt="md" radius="md">
                    Retour à l&quot;Accueil
                </Button>
            </Link>
        </>
    )
}

export default CommandLineUploadPage
