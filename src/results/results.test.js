import React from 'react'
import ReactDOM from 'react-dom'
import renderer from 'react-test-renderer'
import { BrowserRouter } from 'react-router-dom'
import Results from './results'

describe(`Results`, () => {
    it(`renders without crashing`, () => {
        const div = document.createElement('div')
        const options = { state: 'test' }
        ReactDOM.render(<BrowserRouter>
                        <Results location={options} />
                        </BrowserRouter>, div)
        ReactDOM.unmountComponentAtNode(div)
    })
    it(`matches its snapshot`, () => {
        const options = { state: 'test' }
        const tree = renderer.create(<BrowserRouter>
                                    <Results location={options} />
                                    </BrowserRouter>)
                                    .toJSON()
        expect(tree).toMatchSnapshot()
    })
})