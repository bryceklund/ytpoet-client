import React, { useState, useEffect } from 'react';
import Loading from '../loading/loading'
import { Link } from 'react-router-dom'

const Results = (props) => {
  const [ loading, setLoading ] = useState(false)
  const [ poemLines, setPoemLines ] = useState([])
  const [ poemTitle, setPoemTitle ] = useState('')

  const options = props.location.state
  //const data = apiResult.items.map(c => c.snippet.topLevelComment.snippet.textDisplay)
  const demoData = {
                    title: 'griffin',
                    body: [ "I like this robot", 
                            "THE ULTIMATE ALPHABET", 
                            "literally just", ]
                    }

  function displayPoem(data) {
    let tempLines = []
    data.body.forEach((line, i) => tempLines.push(<p key={`${i}`} className='poem-line'>{line}</p>))
    setPoemLines(tempLines)
    setPoemTitle(data.title)
  }
              
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
    displayPoem(demoData)
  }

  useEffect(() => {
    generatePoetry(options)
  }, [])

  if (loading) {
    return <Loading loading={loading} />
  } else if (poemLines.length && poemTitle) {
    return (
        <div className='poem-results'>
          <div className='back-regen-buttons'>
            <Link to='/home'>back</Link><button disabled={options ? false : true} onClick={(e) => {
                                                                            e.preventDefault()
                                                                            generatePoetry(options)
                                                                          }}>regenerate</button>
          </div>
          <div className='results'>
            <h2 className='poem-title'>{poemTitle}</h2>
            <div className='poem-body'>
              {poemLines}
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
  } else {
    return (
      <div className='poem-results'>
            
      </div>
    )
  }
}

export default Results;
