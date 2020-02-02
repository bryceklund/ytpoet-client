import React from 'react'

const Nav = () => {
    return (
        <nav className='nav'><h1>ytPoet</h1></nav>
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