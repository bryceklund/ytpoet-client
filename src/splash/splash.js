import React from 'react'
import { Link } from 'react-router-dom'

const Splash = () => {
    return (
        <div>
            <p className='instructions'>
                [welcome instructions]<br />
                Lorem ipsum dolor sit amet, consectetur adipiscing elit. Vivamus bibendum magna ac sem consectetur dictum. Maecenas non mi rhoncus, lacinia arcu ut, maximus metus. Curabitur feugiat turpis at justo auctor rhoncus quis non purus. Sed pretium eros iaculis mi viverra, quis rhoncus lectus porta. Curabitur vitae odio justo. Nullam vitae commodo augue. Cras vitae metus nec lectus luctus faucibus id id augue.
            <br />
            </p>
            <div className='continue-container'>
            <Link to='/home'><button className='continue'>continue</button></Link>
            </div>
        </div>
    );
}

export default Splash;
