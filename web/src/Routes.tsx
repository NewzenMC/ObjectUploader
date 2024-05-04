// In this file, all Page components from 'src/pages` are auto-imported. Nested
// directories are supported, and should be uppercase. Each subdirectory will be
// prepended onto the component name.
//
// Examples:
//
// 'src/pages/HomePage/HomePage.js'         -> HomePage
// 'src/pages/Admin/BooksPage/BooksPage.js' -> AdminBooksPage

import {PrivateSet, Route, Router} from '@redwoodjs/router'

import { useAuth } from './auth'
import LoggedInOverlayLayout from "src/layouts/LoggedInOverlayLayout/LoggedInOverlayLayout";

const Routes = () => {
    return (
        <Router useAuth={useAuth}>
            <Route path="/login" page={LoginPage} name="login" />
            <PrivateSet unauthenticated="login" wrap={LoggedInOverlayLayout}>
                <Route path="/commandline-upload" page={CommandLineUploadPage} name="commandLineUpload"/>
                <Route path="/upload" page={UploadPage} name="upload"/>
                <Route path="/list" page={ListPage} name="list"/>
                <Route path="/" page={HomePage} name="home"/>
            </PrivateSet>
            <Route notfound page={NotFoundPage} />
        </Router>
    )
}

export default Routes
