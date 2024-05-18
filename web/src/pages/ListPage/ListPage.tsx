import { Button } from '@mantine/core'

import { Link, routes } from '@redwoodjs/router'
import { Metadata } from '@redwoodjs/web'

const ListPage = () => {
    return (
        <>
            <Metadata title="List" description="List page" />

            <h1>ListPage</h1>
            <p>
                Find me in <code>./web/src/pages/ListPage/ListPage.tsx</code>
            </p>
            <p>
                My default route is named <code>list</code>, link to me with `
                <Link to={routes.list()}>List</Link>`
            </p>
            <Link to={routes.home()}>
                <Button fullWidth mt="md" radius="md">
                    Retour à l&lsquo;Accueil
                </Button>
            </Link>
        </>
    )
}

export default ListPage
