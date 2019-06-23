import PropTypes from 'prop-types'
import React, { Component } from 'react';
import { Link } from 'react-router-dom'
import queryString from 'query-string';
import {
  Button,
  Container,
  Header,
  Responsive,
  Segment,
  Visibility,
} from 'semantic-ui-react'
import './App.css';

const getWidth = () => {
  const isSSR = typeof window === 'undefined'

  return isSSR ? Responsive.onlyTablet.minWidth : window.innerWidth
}

const LoggedInHeading = ({ mobile }) => (
  <Container text>
    <Header
      as='h1'
      inverted
      style={{
        fontSize: mobile ? '2em' : '4em',
        fontWeight: 'normal',
        marginBottom: 0,
        marginTop: mobile ? '1.5em' : '3em',
      }}
    />
  </Container>
)

LoggedInHeading.propTypes = {
  mobile: PropTypes.bool,
}

class DesktopContainer extends Component {
  state = {}

  render() {
    const { children } = this.props

    return (
      <Responsive getWidth={getWidth} minWidth={Responsive.onlyTablet.minWidth}>
        <Visibility
          once={false}
        >
          <Segment
            inverted
            textAlign='center'
            style={{ minHeight: 725, padding: '1em 0em'}}
            vertical
          >
            <LoggedInHeading/>
            {children}
          </Segment>
        </Visibility>
      </Responsive>
    )
  }
}

DesktopContainer.propTypes = {
  children: PropTypes.node,
}

class MobileContainer extends Component {
  state = {}

  render() {
    const { children } = this.props

    return (
      <Responsive
        getWidth={getWidth}
        maxWidth={Responsive.onlyMobile.maxWidth}
      >
          <Segment
            inverted
            textAlign='center'
            style={{ minHeight: 350, padding: '1em 0em' }}
            vertical
          >
            <LoggedInHeading mobile />
            {children}
          </Segment>
      </Responsive>
    )
  }
}

MobileContainer.propTypes = {
  children: PropTypes.node,
}

const ResponsiveContainer = ({ children }) => (
  <div>
    <DesktopContainer>{children}</DesktopContainer>
    <MobileContainer>{children}</MobileContainer>
  </div>
)

ResponsiveContainer.propTypes = {
  children: PropTypes.node,
}

class LoggedIn extends Component {
  constructor() {
    super();
    this.state = {
      serverData: {},
      filterString: '',
    }
  }

  componentDidMount() {
    let parsed = queryString.parse(window.location.search);
    let accessToken = parsed.access_token;

    fetch('https://api.spotify.com/v1/me', {
      headers: {'Authorization': 'Bearer ' + accessToken}
    }).then(response => response.json())
    .then(data => this.setState({
      user: {
        name: data.display_name
      }
    }))

    fetch('https://api.spotify.com/v1/me/playlists', {
      headers: {'Authorization': 'Bearer ' + accessToken}
    }).then(response => response.json())
    .then(playlistData => {
      let playlists = playlistData.items
      let trackDataPromises = playlists.map(playlist => {
        let responsePromise = fetch(playlist.tracks.href, {
          headers: {'Authorization': 'Bearer ' + accessToken}
        })
        let trackDataPromise = responsePromise
          .then(response => response.json())
        return trackDataPromise
      })
      let allTracksDataPromises = 
        Promise.all(trackDataPromises)
      let playlistsPromise = allTracksDataPromises.then(trackDatas => {
        trackDatas.forEach((trackData, i) => {
          playlists[i].trackDatas = trackData.items
            .map(item => item.track)
            .map(trackData => ({
              name: trackData.name,
              duration: trackData.duration_ms / 1000
            }))
        })
        return playlists
      })
      return playlistsPromise
    })
    .then(playlists => this.setState({
      playlists: playlists.map(item => {
        return {
          name: item.name,
          imageUrl: item.images[0].url, 
          songs: item.trackDatas
        }
    })
    }))

  }

  render() {
    let parsed = queryString.parse(window.location.search);
    let accessToken = parsed.access_token;
    let playlistRender = 
      this.state.user &&
      this.state.playlists
        ? this.state.playlists.map(function(playlist){
          return <Link to={`/playlist/?selected=${playlist.name}&access_token=${accessToken}`} key={`${playlist.name}`}>
            <Button style={{marginBottom:'1rem'}}>{playlist.name}</Button>
          </Link>;
      }) : []
    
    return (
      <ResponsiveContainer>
      <div className="App">
        {this.state.user && this.state.playlists ?
        <Container text>
          <Segment.Group style={{textAlign: 'center'}}>
            <h1>{this.state.user.name}</h1>
            <p>Select the playlist you want to edit</p>
            {playlistRender}
          </Segment.Group>
        </Container> : <p>Loading</p>
        }
      </div>
      </ResponsiveContainer>
    )
  }
}

export default LoggedIn