import React, { useState, useEffect } from 'react'
import { Link, useHistory } from 'react-router-dom'
import useRouter from 'use-react-router'
import Loading from '../loading/loading'
import { saveAs } from 'file-saver'
import html2canvas from 'html2canvas';
import { TwitterShareButton } from 'react-twitter-embed'
import ShareLink from 'react-facebook-share-link'
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

  function loadFb() {
    (function(d, s, id) {
      var js, fjs = d.getElementsByTagName(s)[0];
      if (d.getElementById(id)) return;
      js = d.createElement(s); js.id = id;
      js.src = "https://connect.facebook.net/en_US/sdk.js#xfbml=1&version=v3.0";
      fjs.parentNode.insertBefore(js, fjs);
    }(document, 'script', 'facebook-jssdk'))
  }

  useEffect(() => {
    if (options) {
      setCopyLink('new')
      generatePoetry(options)
    } else {
      setCopyLink('copy')
      const { poemId } = props.match.params
      getPoem(poemId)
      loadFb()
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
                return <p key={`${i}`} className='poem-line'>{line}</p>
              })}
            </div>
          </div>
          <div className='share-buttons'>
            <ShareLink>
              {link => (
                <a href={link} target='_blank'>Share this on Facebook</a>
              )}
            </ShareLink>
            <div class="fb-share-button" data-href={`https://ytpoet.now.sh${props.match.url}`}  data-layout="button" data-size="small"></div>
            <TwitterShareButton url={`https://ytpoet.now.sh${props.match.url}`} options={{ text: 'check out my poem on #ytpoet' }} />
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