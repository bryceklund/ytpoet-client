import React from 'react'
import { Link } from 'react-router-dom'

const Nav = () => {
    return (
        <nav className='nav'><h1><Link className='hero-link' to='/home'>ytPoet</Link></h1></nav>
    )
}

const Footer = () => {
    return (
        <footer>
            &copy; 2020 bryce eklund | <a href='https://github.com/bryceklund'>github</a>
         </footer>
    )
}

const HeadFoot = { Nav, Footer }

export default HeadFoot