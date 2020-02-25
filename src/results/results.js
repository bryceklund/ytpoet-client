import React, { useState, useEffect } from 'react'
import { Link, useHistory } from 'react-router-dom'
import { API_BASE_URL, API_TOKEN } from '../config.js'
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
  const [ colorScheme, setColorScheme ] = useState('')
  const [ titleColor, setTitleColor ] = useState('')

  const history = useHistory()
  const options = props.location.state
  //const data = apiResult.items.map(c => c.snippet.topLevelComment.snippet.textDisplay)
  const demoData = {
                    title: 'abcdefghij 123 123',
                    body: [ "I like this robot", 
                            "THE ULTIMATE ALPHABET", 
                            "literally just", ]
                    }

  function hashString(str) {
    let result = 0
    for (let i = 0; i < str.length; i++) {
      result += str.charCodeAt(i)
    }
    return (result % 3) + 1
  }

  function getScheme(title) {
    const hash = hashString(title)
    switch(hash) {
      case(1):
        setColorScheme('bg-blue')
        setTitleColor('#ff9a00')
      break
      case(2):
        setColorScheme('bg-pink')
        setTitleColor('#0eb900')
      break
      case(3):
        setColorScheme('bg-green')
        setTitleColor('#f599ff')
      break
      default:
        return
    }
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
    const apiUrl = `${API_BASE_URL}/poem`
    const apiOptions = {
      'method': 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${API_TOKEN}`
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
    getScheme(data.title.trim())
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
      const apiUrl = `${API_BASE_URL}/poem/${id}`
      const apiOptions = {
                            'method': 'GET',
                            headers: {
                              'Content-Type': 'application/json',
                              'Authorization': `Bearer ${API_TOKEN}`
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
    let url = `https://ytpoet.now.sh/poem/${id}`
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
    const apiUrl = `${API_BASE_URL}/generate`
    const apiOptions = { 
                          'method': 'POST',
                          headers: {
                            'Content-Type': 'application/json',
                            'Authorization': `Bearer ${API_BASE_URL}`
                          },
                          body: JSON.stringify(options)
                        }
    setLoading(true)
    fetch(apiUrl, apiOptions)
        .then(res => res.json())
        .then(data => displayPoem(data))
        .catch(err => displayError(err))
  }

  async function loadPage() {
    let promise = new Promise((resolve, reject) => {
      if (!(poemTitle && poemLines)) {
        if (options) {
          setCopyLink('new')
          generatePoetry(options)
          resolve(true)
        } else {
          setCopyLink('copy')
          const { poemId } = props.match.params
          getPoem(poemId)
          resolve(true)
        }
      } else {
        reject(false)
      }
    })
    let result = await promise
    return result
  }

  useEffect(() => {
    loadPage()
      .then(() => {
        if (colorScheme && titleColor) {
          document.body.style.backgroundImage = `url(null)`
          document.body.style.backgroundColor = ``
          document.body.classList.add(colorScheme) 
          document.getElementById('title').style.color = titleColor
        }
      })
 
    return () => {
      document.body.style.backgroundImage = `url('/static/media/TILE_FINAL.ff6afcf4.png')`
      document.body.style.backgroundColor = `#ecfeff`
      document.getElementById('title').style.color = '#df7cb5'
      if (colorScheme) {
        document.body.classList.remove(colorScheme)
      }
    }
  }, [colorScheme])

  if (loading) {
    return <Loading loading={loading} />
  } else if (poemLines && poemLines.length && poemTitle) {
    return (
        <div className={`poem-results ${colorScheme}`}>
          <div className='back-regen-buttons'>
            <Link to='/home'>back</Link><button disabled={options ? false : true} onClick={(e) => {
                                                                            e.preventDefault()
                                                                            generatePoetry(options)
                                                                          }}>regenerate</button>
          </div>
          <div className={`results ${colorScheme}-card`} id='results'>
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