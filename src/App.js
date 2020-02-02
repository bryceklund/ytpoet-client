import React, { useState } from 'react';
import { Switch } from 'react-router'
import { HashRouter, Route } from 'react-router-dom'
import Main from './main/main'
import Splash from './splash/splash'
import Results from './results/results'
import HeadFoot from './nav-footer/nav-footer'
import Loading from './loading/loading'
import './App.css';

const { Nav, Footer } = HeadFoot

function App() {
    return (
      <HashRouter>
        <Nav />
          <React.Fragment className="App">
            <Route exact path='/' component={Splash} />
            <Route path='/home' render={() => <Main />} />
            <Route path='/result' component={Results} />
            <Route path='/poem/:poemId'>
              <Results />
            </Route>
          </React.Fragment>
          <Route path='/loading' component={Loading} />
        <Footer />
      </HashRouter>
    )
}

export default App;
