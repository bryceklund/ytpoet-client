import React from 'react'
import { Link } from 'react-router-dom'

const Splash = () => {
    return (
        <div>
            <p className='instructions'>
                [welcome instructions]<br />
                Hello and welcome to ytPoet! To get started, paste a link in the box and hit "GO". Don't actually paste a link in there though, this is just a beta. You can hit "GO" though.
            <br />
            </p>
            <div className='continue-container'>
            <Link to='/home'><button className='continue'>continue</button></Link>
            </div>
        </div>
    );
}

export default Splash;
