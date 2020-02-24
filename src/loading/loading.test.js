import React from 'react'
import ReactDOM from 'react-dom'
import renderer from 'react-test-renderer'
import { BrowserRouter } from 'react-router-dom'
import Loading from './loading'

describe('Loading', () => {
it('renders without crashing', () => {
    const div = document.createElement('div')
    ReactDOM.render(<BrowserRouter>
                    <Loading loading={true} />
                    </BrowserRouter>, div)
    ReactDOM.unmountComponentAtNode(div)
})
it('matches its snapshot', () => {
    const tree = renderer.create(<BrowserRouter>
                                <Loading loading={true} />
                                </BrowserRouter>)    
                                .toJSON()
    expect(tree).toMatchSnapshot()
})
})