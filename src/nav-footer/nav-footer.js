import React, { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'

const Nav = (props) => {
        console.log(props.location)
    return (
        <nav className='nav'><h1><Link id='title' className='hero-link' to='/home'>ytPoet</Link></h1></nav>
    )
}

const Footer = () => {
    const [ randomId, setRandomId ] = useState(null)

    function getRandom() {
        const url = `https://infinite-sierra-05503.herokuapp.com/api/random`
        const options = {
          'method': 'GET',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': 'Bearer swag420' 
          }
        }
        
        if (!randomId) {
            fetch(url, options)
            .then(res => res.json())
            .then(data => {
                setRandomId(data.id)
            })
            //.then(id => setRandomId(id))
            .catch(err => console.error(err))
        } else {
            return
        }
    }
    useEffect(() => {
        getRandom()
    })
    return (
        <footer>
            <p className='sample-poems-label'><a href={`/poem/${randomId}`} className='sample-poem'>random poem</a></p>
            &copy; 2020 bryce eklund | <a href='https://github.com/bryceklund'>github</a>
         </footer>
    )
}

const HeadFoot = { Nav, Footer }

export default HeadFoot