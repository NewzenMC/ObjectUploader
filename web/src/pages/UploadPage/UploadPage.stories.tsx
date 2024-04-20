import type { Meta, StoryObj } from '@storybook/react'

import UploadPage from './UploadPage'

const meta: Meta<typeof UploadPage> = {
    component: UploadPage,
}

export default meta

type Story = StoryObj<typeof UploadPage>

export const Primary: Story = {}
