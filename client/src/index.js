import React from 'react';
import ReactDOM from 'react-dom';
import { BrowserRouter, Route } from 'react-router-dom'
import Home from './components/Home.js';
import LoggedIn from './components/LoggedIn'
import * as serviceWorker from './serviceWorker';

class App extends React.Component {
  render() {
    return (
      <BrowserRouter>
        <Route path={'/'} component={Home} exact />
        <Route path={'/loggedin'} component={LoggedIn}/> 
      </BrowserRouter>  
    )
  }
}

ReactDOM.render(< App />, document.getElementById('root'));

serviceWorker.unregister();
