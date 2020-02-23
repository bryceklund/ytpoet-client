import React from 'react'
import { Link } from 'react-router-dom'

const Splash = () => {
    return (
        <div>
            <p className='instructions'>
                [welcome instructions]<br />
                Hello and welcome to ytPoet!<br />
                To get started, paste a YouTube video in the text box<br />
                Next, choose your poem type from the drop-down menu<br />
                Finally, hit "GO" to generate a poem<br />
                Click "generate link" to save your poem and make it sharable<br />
                Once generated, use a social share link to post it to Facebook or Twitter<br />
                At any given moment, click the "random poem" button to be taken to a random saved poem<br />
            <br />
            </p>
            <div className='continue-container'>
            <Link to='/home'><button className='continue'>continue</button></Link>
            </div>
        </div>
    );
}

export default Splash;
