import React, { useState, useEffect } from 'react'
import { Link, useHistory } from 'react-router-dom'
import Loading from '../loading/loading'
import { saveAs } from 'file-saver'
import html2canvas from 'html2canvas';
import { TwitterShareButton } from 'react-twitter-embed'
import { FacebookShareButton, FacebookIcon } from 'react-share'

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

  function shareButtons() {
    if (options) {
      return (<div className={`share-buttons`}>
        <button onClick={() => downloadPoem()}>download</button>
        <button onClick={() => copyLink === 'new' ? savePoem() : toClipBoard(props.match.url.split('/')[2])}>generate link</button>
      </div>)
    } else {
      return (<div className={`share-buttons`}>
        <FacebookShareButton url={`https://ytpoet.now.sh${props.match.url}`} quote='check out my poem on #ytpoet: '><FacebookIcon size={20} round={false} /></FacebookShareButton>
        <TwitterShareButton url={`https://ytpoet.now.sh${props.match.url}`} options={{ text: 'check out my poem on #ytpoet: ' }} />
        <button onClick={() => downloadPoem()}>download</button>
        <button onClick={() => copyLink === 'new' ? savePoem() : toClipBoard(props.match.url.split('/')[2])}>copy link</button>
      </div>)
    }
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
    return (
        <div className='poem-results'>
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
                if (line === null) {
                  return <p key={`${i}`} className='poem-line-empty' />
                } else {
                  return <p key={`${i}`} className='poem-line'>{line}</p>

                }
              })}
            </div>
          </div>
          {shareButtons()}
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