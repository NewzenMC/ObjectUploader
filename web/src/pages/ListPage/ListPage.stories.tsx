import type { Meta, StoryObj } from '@storybook/react'

import ListPage from './ListPage'

const meta: Meta<typeof ListPage> = {
    component: ListPage,
}

export default meta

type Story = StoryObj<typeof ListPage>

export const Primary: Story = {}
