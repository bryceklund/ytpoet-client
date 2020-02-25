import React, { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { API_BASE_URL, API_TOKEN } from '../config.js'

const Nav = (props) => {
        console.log(props.location)
    return (
        <nav className='nav'><h1><Link id='title' className='hero-link' to='/home'>ytPoet</Link></h1></nav>
    )
}

const Footer = () => {
    const [ randomId, setRandomId ] = useState(null)

    function getRandom() {
        const url = `${API_BASE_URL}/random`
        const options = {
          'method': 'GET',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${API_TOKEN}`
          }
        }
        
        if (!randomId) {
            fetch(url, options)
            .then(res => res.json())
            .then(data => setRandomId(data.id))
            .catch(err => console.error(err))
        } else {
            return
        }
    }
    useEffect(() => {
        getRandom()
    })
    return (
        <div className='foot-wrapper'>
            <footer>
                <p className='sample-poems-label'><a href={`/poem/${randomId}`} className='sample-poem'>random poem</a></p>
                <p>&copy; 2020 bryce eklund | <a href='https://github.com/bryceklund'>github</a></p>
            </footer>  
        </div>

    )
}

const HeadFoot = { Nav, Footer }

export default HeadFoot