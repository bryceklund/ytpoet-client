import React, { useEffect } from 'react'
import { Link } from 'react-router-dom'

const Loading = (props) => {
    function showLetters() {
        const word = ' GENERATING '
        const element = document.getElementById('loading')
        for (let i = 0; i < word.length + 1; i++) {
            if (!props.loading) {
                break
            }
            setTimeout(function() { 
                if (!element) {
                    return
                }
                if (element.textContent !== word) {
                    element.append(word[i]) 
                } else {
                    element.innerHTML = ''
                    showLetters()
                }
            }, i * 100)
        }
    }
    function checkError() {
        document.getElementById('loading').append('An error occurred.')
    }
    useEffect(() => {
        if (props.loading !== 'error') {
            showLetters()
        }
        
    })
    if (props.loading === 'error') {
        return <p className='error'>Something went wrong. <Link to='/result'>Give it another try.</Link></p>
    } else {
        return (
            <div className='loading' id='loading'>
            </div>
        )
    }
    
}

export default Loading;
