import React, { useState, useEffect } from 'react'
import { Link, useHistory } from 'react-router-dom'
import useRouter from 'use-react-router'
import Loading from '../loading/loading'
import { saveAs } from 'file-saver'
import html2canvas from 'html2canvas';
import download from 'downloadjs'

const Results = (props) => {
  const [ loading, setLoading ] = useState(false)
  const [ poemLines, setPoemLines ] = useState([])
  const [ poemTitle, setPoemTitle ] = useState('')
  const [ copyLink, setCopyLink ] = useState(null)
  const [ copyStatus, setCopyStatus ] = useState('')

  const history = useHistory()
  const options = props.location.state
  //const data = apiResult.items.map(c => c.snippet.topLevelComment.snippet.textDisplay)
  const demoData = {
                    title: 'griffin',
                    body: [ "I like this robot", 
                            "THE ULTIMATE ALPHABET", 
                            "literally just", ]
                    }

  function downloadPoem() {
    html2canvas(document.getElementById('results'))
      .then((canvas) => {
        canvas.toBlob((blob) => {
          saveAs(blob, `${poemTitle}.png`)
        })
    })
  }

  function copyToolTip(message, id) {
    const element = document.getElementById('copy-status').classList
    element.remove('hidden')
    setCopyStatus(message)
    setTimeout(() => {
      element.add('hidden')
      if (id) {
        history.push(`/poem/${id}`)
      }
    }, 2000)
  }

  function savePoem() {
    //push data to db, return uuid and generate url
    const bodyData = {
      title: poemTitle,
      body: poemLines
    }
    const apiUrl = `https://infinite-sierra-05503.herokuapp.com/api/poem`
    const apiOptions = {
      'method': 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': 'Bearer swag420' 
      },
      body: JSON.stringify(bodyData)
    }
  
    fetch(apiUrl, apiOptions)
      .then(res => res.json())
      .then(data => {
        return data.poemId
      })
      .then(id => {
        // send to clipboard, fb connector, ig connector, or twitter connector depending on selection
        if (id) {
          toClipBoard(id)
        } else {
          copyToolTip('Failed to copy!')
          throw new Error('Failed to copy')
        }
      })
      .catch(err => console.error(err))
  }

  function displayPoem(data) {
    console.log(data, data.body, data.title)
    setPoemLines(data.body)
    setPoemTitle(data.title.trim())
    setLoading(false)
  }

  function displayError(err) {
    console.log(err)
    setLoading('error')
  }

  function getPoem(id) {
      //make call to db to get poem
      const tempId = '643d1896-e465-4753-8a14-c5fc80427653'
      const apiUrl = `https://infinite-sierra-05503.herokuapp.com/api/poem/${id}`
      const apiOptions = {
                            'method': 'GET',
                            headers: {
                              'Content-Type': 'application/json',
                              'Authorization': 'Bearer swag420' 
                            }
                          }
      try {
        fetch(apiUrl, apiOptions)
          .then(res => res.json())
          .then(data => displayPoem(data))
          .catch(err => displayError(err))
      } catch {
        return false
      }
  }
  
  function toClipBoard(id) { //all set! just need a tooltip to notify on copy success/failure
    let url = `ytpoet.now.sh/poem/${id}`

    try {
      let textArea = document.createElement("textarea")
      textArea.value = url
      textArea.setAttribute('readonly', '')
      textArea.style.position='-9999px'
      document.body.appendChild(textArea)
      textArea.select()
      document.execCommand('copy')
      document.body.removeChild(textArea)
      copyToolTip('Copied!', id)
      return true
    } catch {
      copyToolTip('Failed to copy!') 
      return false
    }

  }

  function generatePoetry(options) {
    const apiUrl = `https://infinite-sierra-05503.herokuapp.com/api/generate`
    const apiOptions = { 
                          'method': 'POST',
                          headers: {
                            'Content-Type': 'application/json',
                            'Authorization': 'Bearer swag420' 
                          },
                          body: JSON.stringify(options)
                        }
    setLoading(true)
    fetch(apiUrl, apiOptions)
        .then(res => res.json())
        .then(data => displayPoem(data))
        .catch(err => displayError(err))
  }

  useEffect(() => {
    if (options) {
      setCopyLink('new')
      generatePoetry(options)
    } else {
      setCopyLink('copy')
      const { poemId } = props.match.params
      getPoem(poemId)
    }
  }, [])

  if (loading) {
    return <Loading loading={loading} />
  } else if (poemLines && poemLines.length && poemTitle) {
    console.log(`https://ytpoet.now.sh/poem/${props.match.url.split('/')[2]}`)
    return (
        <div className='poem-results'>
        <head>
          <meta content="text/html; charset=UTF-8" name="Content-Type" />
          <meta name="twitter:card" content="summary_large_image" />
          <meta name="twitter:site" content="@nytimes" />
          <meta name="twitter:creator" content="@SarahMaslinNir" />
          <meta name="twitter:title" content="Parade of Fans for Houston’s Funeral" />
          <meta name="twitter:description" content="NEWARK - The guest list and parade of limousines with celebrities emerging from them seemed more suited to a red carpet event in Hollywood or New York than than a gritty stretch of Sussex Avenue near the former site of the James M. Baxter Terrace public housing project here." />
          <meta name="twitter:image" content="http://graphics8.nytimes.com/images/2012/02/19/us/19whitney-span/19whitney-span-articleLarge.jpg" />
          <meta property="og:type" content="website" />
        </head>
          <div className='back-regen-buttons'>
            <Link to='/home'>back</Link><button disabled={options ? false : true} onClick={(e) => {
                                                                            e.preventDefault()
                                                                            generatePoetry(options)
                                                                          }}>regenerate</button>
          </div>
          <div className='results' id='results'>
            <h2 className='poem-title'>{poemTitle}</h2>
            <div className='poem-body'>
              {poemLines.map((line, i) => {
                return <p key={`${i}`} className='poem-line'>{line}</p>
              })}
            </div>
          </div>
          <div className='share-buttons'>
            <div class={`fb-share-button ${options ? 'hidden' : ''}`}
              data-href={`https://ytpoet.now.sh/poem/${props.match.url.split('/')[2]}`}
              data-layout="button">
            </div>
            <a href={`https://twitter.com/intent/tweet?text=https://ytpoet.now.sh${props.match.url}`} class={`twitter-share-button ${options ? 'hidden' : ''}`} data-show-count="false">
              twitter</a>
            
            <button onClick={() => downloadPoem()}>download</button>
            <button onClick={() => copyLink === 'new' ? savePoem() : toClipBoard(props.match.url.split('/')[2])}>generate link</button>
          </div>
          <p className='copy-status-container'><span id='copy-status' className='copy-status hidden'>{copyStatus}</span></p>
        </div>
    )
  } else {
    return (
      <div className='poem-results'>
            
      </div>
    )
  }
}

export default Results