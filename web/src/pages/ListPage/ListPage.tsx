import { Link, routes } from '@redwoodjs/router'
import { Metadata } from '@redwoodjs/web'
import {Button} from "@mantine/core";

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
                    Retour à l&quot;Accueil
                </Button>
            </Link>
        </>
    )
}

export default ListPage
