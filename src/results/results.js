import React, { useState, useEffect } from 'react';
import Loading from '../loading/loading'
import { Link } from 'react-router-dom'

const Results = (props) => {
  const [ loading, setLoading ] = useState(false)
  const options = props.location.state
  function generatePoetry(options) {
    const { url, type, syllables, lines, rhyme } = options
    setLoading(true)
    console.log(url, type, syllables, lines, rhyme)

    setTimeout(function() { //simluate API call
      setLoading(false)
      return
    }, 3000)
    //actual steps:
    //loading = true
    //get request for comments
    //parse out comment data
    //choose random chunk
    //use syllable to find n chunks of words
    //push chunks to an array in state
    //iterate through array, appending to the '.poem-body'
    //loading = false
  }
  useEffect(() => {
    generatePoetry(options)
  }, [])
  if (loading) {
    return <Loading loading={loading} />
  } else {
    return (
        <div className='poem-results'>
          <div className='back-regen-buttons'>
            <Link to='/home'>back</Link><button disabled={options ? false : true} onClick={(e) => {
                                                                            e.preventDefault()
                                                                            generatePoetry(options)
                                                                          }}>regenerate</button>
          </div>
          <div className='results'>
            <h2 className='poem-title'>Poem Title</h2>
            <div className='poem-body'>
              <p className='poem-line'>Lorem ipsum dolor sit amet, consectetur adipiscing elit</p>
              <p className='poem-line'>Vivamus bibendum magna ac sem consectetur dictum</p>
              <p className='poem-line'>Maecenas non mi rhoncus, lacinia arcu ut, maximus metus</p>
              <p className='poem-line'>Curabitur feugiat turpis at justo auctor rhoncus quis non purus</p>
              <p className='poem-line'>Sed pretium eros iaculis mi viverra, quis rhoncus lectus porta</p>
            </div>
          </div>
          <div className='share-buttons'>
            <a href='' target='_blank'>fb</a>
            <a href='' target='_blank'>ig</a>
            <a href='' target='_blank'>twitter</a>
            <a href='' target='_blank'>download</a>
            <a href='' target='_blank'>copy link</a>
          </div>
        </div>
    )
  }
}

export default Results;
