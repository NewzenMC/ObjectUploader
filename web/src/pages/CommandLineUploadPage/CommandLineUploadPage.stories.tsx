import type { Meta, StoryObj } from '@storybook/react'

import CommandLineUploadPage from './CommandLineUploadPage'

const meta: Meta<typeof CommandLineUploadPage> = {
    component: CommandLineUploadPage
}

export default meta

type Story = StoryObj<typeof CommandLineUploadPage>

export const Primary: Story = {}
