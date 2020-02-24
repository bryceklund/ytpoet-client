import React from 'react'
import ReactDOM from 'react-dom'
import renderer from 'react-test-renderer'
import { BrowserRouter } from 'react-router-dom'
import HeadFoot from './nav-footer'



describe(`Nav+Footer`, () => {
    const { Nav, Footer } = HeadFoot
    it(`renders without crashing`, () => {
        const div = document.createElement('div')
        ReactDOM.render(<BrowserRouter>
                            <Nav />
                            <Footer />
                        </BrowserRouter>, div)
        ReactDOM.unmountComponentAtNode(div)
    })
    it(`matches its snapshot`, () => {
        const tree = renderer.create(<BrowserRouter>
                                        <Nav />
                                        <Footer />
                                    </BrowserRouter>)
                                    .toJSON()
        expect(tree).toMatchSnapshot()
    })
})