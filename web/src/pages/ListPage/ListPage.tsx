import { Button, Space } from '@mantine/core'

import { Link, routes } from '@redwoodjs/router'
import { Metadata } from '@redwoodjs/web'

import ObjectsCell from 'src/components/ObjectsCell'

const ListPage = () => {
    return (
        <>
            <Metadata title="List" description="List page" />

            <h1>List</h1>

            <Link to={routes.home()}>
                <Button fullWidth mt="md" radius="md">
                    Retour à l&lsquo;Accueil
                </Button>
            </Link>

            <Space h="xl" />

            <ObjectsCell />
        </>
    )
}

export default ListPage
