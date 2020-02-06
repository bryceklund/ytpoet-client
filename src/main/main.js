import React, { useState } from 'react';
import { Link } from 'react-router-dom'

const Main = () => {
    const [ poemType, setPoemType ] = useState('haiku')
    const [ syllables, setSyllables ] = useState(0)
    const [ lines, setLines ] = useState(0)
    const [ profanity, setProfanity ] = useState(false)
    const [ url, setUrl ] = useState('')
    const options = { poemType, syllables, lines, profanity, url }
    return (
        <div>
            <div className='input'>
                <form className='url-settings'>
                    <fieldset>
                        <legend>paste a video URL:</legend>
                        <input className='url' placeholder='https://www.youtube.com/watch?v=A_x1qvftnPs' onChange={(e) => setUrl(e.target.value)} /><Link className='go'
                                                                                                                                                        to={{ 
                                                                                                                                                            pathname: '/result', 
                                                                                                                                                            state: options }}>GO</Link>
                        <div className='setting-container'>
                            <label htmlFor='poem-type'>poem type:</label>
                            <select className='poem-type' name='poem-type' onChange={(e) => setPoemType(e.target.value)}>
                                <option value='haiku'>haiku</option>
                                <option value='sonnet'>sonnet</option>
                                <option value='custom'>custom</option>
                            </select>
                            </div>
                            <div className={`settings ${poemType === 'custom' ? '' : 'hidden'}`} id='settings'>
                            <div className='setting-container'>
                                <label htmlFor='syllables'>syllables per line:</label>
                                <input className='syllables' type='text' name='syllables' onChange={(e) => setSyllables(parseInt(e.target.value))} />
                            </div>
                            <div className='setting-container'>
                                <label htmlFor='lines'>number of lines:</label>
                                <input className='lines' type='text' name='lines' onChange={(e) => setLines(parseInt(e.target.value))} />
                            </div>
                            <div className='setting-container'>
                                <label htmlFor='profanity'>block profanity?</label>
                                <input type='checkbox' name='profanity' onChange={(e) => setProfanity(!profanity)} />      
                            </div>
                        </div>
                    </fieldset>
                </form>
            </div>
            <p className='sample-poems-label'>check out some generated content:</p>
            <div className='sample-poems'>
                <a href='' target='_blank' className='sample-poem'>Poem 1</a>
                <a href='' target='_blank' className='sample-poem'>Poem 2</a>
                <a href='' target='_blank' className='sample-poem'>Poem 3</a>
                <a href='' target='_blank' className='sample-poem'>Poem 4</a>
                <a href='' target='_blank' className='sample-poem'>Poem 5</a>
            </div>
            <script src="script.js"></script>
        </div>
    );
};

export default Main;