import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom'

const Main = () => {
    const [ poemType, setPoemType ] = useState('haiku')
    const [ syllables, setSyllables ] = useState(0)
    const [ lines, setLines ] = useState(0)
    const [ profanity, setProfanity ] = useState(false)
    const [ url, setUrl ] = useState('')
    const [ goAllowed, setGoAllowed ] = useState(false)
    const [ errorMessage, setErrorMessage ] = useState('')
    const [ randomId, setRandomId ] = useState(null)

    const options = { poemType, syllables, lines, profanity, url }


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

    function checkUrl(url) {
        const regex = RegExp(/^((?:https?:)?\/\/)?((?:www|m)\.)?((?:youtube\.com|youtu.be))(\/(?:[\w\-]+\?v=|embed\/|v\/)?)([\w\-]+)(\S+)?$/)
        if (regex.test(url)) {
            return true
        } else {
            return false
        }
    }
    function validate(item, type) {
        switch(type) {
            case 'url':
                setUrl(item)
            break
            case 'syllables':
                setSyllables(item)
            break
            case 'lines':
                setLines(item)
            break
        }
    }

    getRandom()

    useEffect(() => {
        if (url) {
            if (poemType === 'custom' && (lines < 1 || lines > 20 || isNaN(lines))) {
                setGoAllowed(false)
                setErrorMessage('line count must be between 1 and 20!')
            } else if (poemType === 'custom' && (syllables < 1 || syllables > 30 || isNaN(syllables))) {
                setGoAllowed(false)
                setErrorMessage('syllable count must be between 1 and 30!')
            } else if (url && !checkUrl(url)) {
                setGoAllowed(false)
                setErrorMessage('please enter a valid youtube url!')
            } else {
                setGoAllowed(true)
                setErrorMessage('')
            }
        }   
    })
    return (
        <div>
            <div className='input'>
                <form className='url-settings'>
                    <fieldset>
                        <legend>paste a video URL:</legend>
                        <input className='url' placeholder='https://www.youtube.com/watch?v=A_x1qvftnPs' onInput={(e) => validate(e.target.value, 'url')} />
                        <Link className={`go ${goAllowed ? '' : 'hidden'}`} to={{ pathname: '/result', state: options }}>GO</Link>
                        <p className='error-message'>{errorMessage}</p>
                        <div className='setting-container'>
                            <label htmlFor='poem-type'>poem type:</label>
                            <select className='poem-type' name='poem-type' onChange={(e) => setPoemType(e.target.value)}>
                                <option value='haiku'>haiku</option>
                                <option value='sonnet'>sonnet</option>
                                <option value='rondel'>rondel</option>
                                <option value='indriso'>indriso</option>
                                <option value='custom'>custom</option>
                            </select>
                            </div>
                            <div className={`settings ${poemType === 'custom' ? '' : 'hidden'}`} id='settings'>
                            <div className='setting-container'>
                                <label htmlFor='syllables'>syllables per line:</label>
                                <input className='syllables' type='text' name='syllables' onChange={(e) => validate(parseInt(e.target.value), 'syllables')} />
                            </div>
                            <div className='setting-container'>
                                <label htmlFor='lines'>number of lines (1-20):</label>
                                <input className='lines' type='text' name='lines' onChange={(e) => validate(parseInt(e.target.value), 'lines')} />
                            </div>
                        </div>
                        <div className='setting-container'>
                            <label htmlFor='profanity'>block profanity?</label>
                            <input type='checkbox' name='profanity' onChange={(e) => setProfanity(!profanity)} />      
                        </div>
                    </fieldset>
                </form>
            </div>
            <p className='sample-poems-label'><a href={`/poem/${randomId}`} className='sample-poem'>random poem</a></p>
            <script src="script.js"></script>
        </div>
    )
}

export default Main;