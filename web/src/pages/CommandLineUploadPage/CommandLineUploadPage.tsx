import { Button, Space, Title } from '@mantine/core'
import { IconHome } from '@tabler/icons-react'

import { Link, routes } from '@redwoodjs/router'
import { Metadata } from '@redwoodjs/web'

const CommandLineUploadPage = () => {
    return (
        <>
            <Metadata
                title="CommandLineUpload"
                description="CommandLineUpload page"
            />

            <Space h="xl" />

            <Title>Command Line Upload</Title>

            <Link to={routes.home()}>
                <Button fullWidth mt="md" radius="md">
                    <IconHome />
                </Button>
            </Link>

            <Space h="md" />
        </>
    )
}

export default CommandLineUploadPage
