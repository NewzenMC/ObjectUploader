import type { Meta, StoryObj } from '@storybook/react'

import LoggedInOverlayLayout from './LoggedInOverlayLayout'

const meta: Meta<typeof LoggedInOverlayLayout> = {
    component: LoggedInOverlayLayout
}

export default meta

type Story = StoryObj<typeof LoggedInOverlayLayout>

export const Primary: Story = {}
