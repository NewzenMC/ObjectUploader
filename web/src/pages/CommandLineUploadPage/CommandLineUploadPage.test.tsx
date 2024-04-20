import { render } from '@redwoodjs/testing/web'

import CommandLineUploadPage from './CommandLineUploadPage'

//   Improve this test with help from the Redwood Testing Doc:
//   https://redwoodjs.com/docs/testing#testing-pages-layouts

describe('CommandLineUploadPage', () => {
    it('renders successfully', () => {
        expect(() => {
            render(<CommandLineUploadPage />)
        }).not.toThrow()
    })
})
