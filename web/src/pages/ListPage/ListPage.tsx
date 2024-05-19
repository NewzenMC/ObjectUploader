import { Button, Space, Title } from '@mantine/core'
import { IconHome } from '@tabler/icons-react'

import { Link, routes } from '@redwoodjs/router'
import { Metadata } from '@redwoodjs/web'

import ObjectsCell from 'src/components/ObjectsCell'

const ListPage = () => {
    return (
        <>
            <Metadata title="List" description="List page" />

            <Space h="xl" />

            <Title>List</Title>

            <Link to={routes.home()}>
                <Button fullWidth mt="md" radius="md">
                    <IconHome />
                </Button>
            </Link>

            <Space h="md" />

            <ObjectsCell />
        </>
    )
}

export default ListPage
