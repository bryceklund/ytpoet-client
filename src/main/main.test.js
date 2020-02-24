import React from 'react'
import ReactDOM from 'react-dom'
import renderer from 'react-test-renderer'
import { BrowserRouter } from 'react-router-dom'
import Main from './main'

describe(`Main`, () => {
    it(`renders without crashing`, () => {
        const div = document.createElement('div')
        ReactDOM.render(<BrowserRouter>
                        <Main />
                        </BrowserRouter>, div)
        ReactDOM.unmountComponentAtNode(div)
    })
    it(`matches its snapshot`, () => {
        const tree = renderer.create(<BrowserRouter>
                                    <Main />
                                    </BrowserRouter>)
                                    .toJSON()
        expect(tree).toMatchSnapshot()
    })
})