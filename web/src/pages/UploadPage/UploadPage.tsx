import { Button } from '@mantine/core'

import { Link, routes } from '@redwoodjs/router'
import { Metadata } from '@redwoodjs/web'

const UploadPage = () => {
    return (
        <>
            <Metadata title="Upload" description="Upload page" />

            <h1>UploadPage</h1>
            <p>
                Find me in{' '}
                <code>./web/src/pages/UploadPage/UploadPage.tsx</code>
            </p>
            <p>
                My default route is named <code>upload</code>, link to me with `
                <Link to={routes.upload()}>Upload</Link>`
            </p>
            <Link to={routes.home()}>
                <Button fullWidth mt="md" radius="md">
                    Retour à l&lsquo;Accueil
                </Button>
            </Link>
        </>
    )
}

export default UploadPage
