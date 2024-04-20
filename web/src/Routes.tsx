// In this file, all Page components from 'src/pages` are auto-imported. Nested
// directories are supported, and should be uppercase. Each subdirectory will be
// prepended onto the component name.
//
// Examples:
//
// 'src/pages/HomePage/HomePage.js'         -> HomePage
// 'src/pages/Admin/BooksPage/BooksPage.js' -> AdminBooksPage

import { Route, Router } from '@redwoodjs/router'

const Routes = () => {
    return (
        <Router>
            <Route path="/commandline-upload" page={CommandLineUploadPage} name="commandLineUpload" />
            <Route path="/upload" page={UploadPage} name="upload" />
            <Route path="/list" page={ListPage} name="list" />
            <Route path="/" page={HomePage} name="home" />
            <Route notfound page={NotFoundPage} />
        </Router>
    )
}

export default Routes
