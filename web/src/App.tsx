import { MantineProvider } from '@mantine/core'

import { FatalErrorBoundary, RedwoodProvider } from '@redwoodjs/web'
import { RedwoodApolloProvider } from '@redwoodjs/web/apollo'

import '@mantine/core/styles.css'
import FatalErrorPage from 'src/pages/FatalErrorPage'
import Routes from 'src/Routes'

import theme from '../config/mantine.config'

import { AuthProvider, useAuth } from './auth'
import './index.css'

const App = () => (
    <FatalErrorBoundary page={FatalErrorPage}>
        <RedwoodProvider titleTemplate="%PageTitle - %AppTitle">
            <AuthProvider>
                <MantineProvider theme={theme} defaultColorScheme={'auto'}>
                    <RedwoodApolloProvider useAuth={useAuth}>
                        <Routes />
                    </RedwoodApolloProvider>
                </MantineProvider>
            </AuthProvider>
        </RedwoodProvider>
    </FatalErrorBoundary>
)

export default App
