import React, { Component } from 'react';
import queryString from 'query-string';
import './App.css';

class LoggedIn extends Component {
  constructor() {
    super();
    this.state = {
      serverData: {},
      filterString: '',
      playlist: null
    }
  }

  componentDidMount() {
    let parsed = queryString.parse(window.location.search);
    let accessToken = parsed.access_token;

    fetch('https://api.spotify.com/v1/me/playlists', {
      headers: {'Authorization': 'Bearer ' + accessToken}
    }).then(response => response.json())
      .then(data => this.setState({playlist: data.items[0].name}))
  }

  render() {
    return (
      <div className='App'>
        <div>
          Now Playing: {this.state.playlist}
        </div>
      </div>
    )
  }
}

export default LoggedIn