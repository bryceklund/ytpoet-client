import React from 'react'
import { Link } from 'react-router-dom'

const Splash = (e) => {

    function toggleInstructions() {
        document.getElementById('intro-iframe').classList.toggle('hidden')
    }
    return (
        <div className='splash'>
            <p className='instructions'>
                Hello and welcome to ytPoet!<br />
                <a href='#' onClick={() => toggleInstructions(e)}>click here</a> to display some instructions, otherwise proceed by clicking "continue" below
                <br />
                <iframe id='intro-iframe' className='intro-md hidden' src='https://ytpoet-instructions--bryceklund.repl.co/'></iframe>
            <br />
            </p>
            <div className='continue-container'>
            <Link to='/home'><button className='continue'>continue</button></Link>
            </div>
        </div>
    );
}

export default Splash;
