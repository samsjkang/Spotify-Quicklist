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

const PlaylistHeading = ({ mobile }) => (
  <Container text>
    <Link to='/'><Button>Home</Button></Link>
    <Header
      as='h1'
      inverted
      style={{
        fontSize: mobile ? '2em' : '4em',
        fontWeight: 'normal',
        marginBottom: 0,
        marginTop: mobile ? '1.5em' : '1em',
      }}
    />
  </Container>
)

PlaylistHeading.propTypes = {
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
            style={{ minHeight: 700, padding: '1em 0em'}}
            vertical
          >
            <PlaylistHeading/>
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
            <PlaylistHeading mobile />
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

class Playlist extends Component {
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
    let selectedPlaylist = parsed.selected;
    let myPlaylist = 
      this.state.user &&
      this.state.playlists
        ? this.state.playlists.filter(function(playlist){
          return playlist.name === selectedPlaylist;
      }) : []

    let mySongs = 
      myPlaylist[0] &&
      myPlaylist[0].songs
        ? myPlaylist[0].songs.map(function(song){
          return <Button style={{marginBottom:'1rem'}}>{song.name}</Button>
      }) : []

    return (
      <ResponsiveContainer>
      <div className="App">
        {this.state.user && this.state.playlists ?
        <Container text>
          <Segment.Group style={{textAlign: 'center'}}>
            <h1>{selectedPlaylist}</h1>
            {mySongs}
          </Segment.Group>
        </Container> : <p textAlign='center'>Loading</p>
        }
      </div>
      </ResponsiveContainer>
    )
  }
}

export default Playlist