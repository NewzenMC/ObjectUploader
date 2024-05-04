import { render } from '@redwoodjs/testing/web'

import LoggedInOverlayLayout from './LoggedInOverlayLayout'

//   Improve this test with help from the Redwood Testing Doc:
//   https://redwoodjs.com/docs/testing#testing-pages-layouts

describe('LoggedInOverlayLayout', () => {
    it('renders successfully', () => {
        expect(() => {
            render(<LoggedInOverlayLayout />)
        }).not.toThrow()
    })
})
