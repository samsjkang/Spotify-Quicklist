import React from 'react';
import Autosuggest from 'react-autosuggest';
import './App.css';
import SearchResults from './SearchResults'
import {
  Button,
  Form,
  Segment,
} from 'semantic-ui-react'
let querystring = require('querystring');

var tenSongs = [];

function escapeRegexCharacters(str) {
  return str.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
}

/* ********************** Song Title ********************** */
function getSuggestions(value) {
  const escapedValue = escapeRegexCharacters(value.trim());
  
  if (escapedValue === '') {
    return [];
  }
  return tenSongs;
}

function getSuggestionValue(suggestion) {
  return suggestion.name;
}

function renderSuggestion(suggestion) {
  return (
    <span>{suggestion.name} by {suggestion.artist}</span>
  );
}

function shouldRenderSuggestions(value) {
  return false;
}
/* ******************************************************** */

class Forms extends React.Component {
  constructor() {
    super();
    this.state = {
      value: '',
      suggestions: [],
      childData: '' // contains info on song we want to add 
    };    
  }

  // dynamic search fetch
  onChange = async (event, { newValue, method }) => {
    this.setState({
      value: newValue
    });
    if (newValue) {
      fetch('https://api.spotify.com/v1/search?' + 
      querystring.stringify({
        q: newValue,
        type: 'track',
        limit: '10'
      }) , {
        headers: {'Authorization': 'Bearer ' + this.props.access_token}
      }).then(response => (response.json()))
      .then(data => (data.tracks))
      .then(songs => (songs.items))
      .then(songArray => {
        if(songArray[0]) {
          this.setState({
            songs: songArray.map(item => {
              return {
                name: item.name,
                artist: item.artists[0].name,
                uri: item.uri
              }
            })
          });
          tenSongs = this.state.songs
        }
      })
      // .then(console.log(tenSongs))
      // .then(console.log(this.state.childData))
    }
  };
  
  onSuggestionsFetchRequested = ({ value }) => {
    this.setState({
      suggestions: getSuggestions(value)
    });
  };

  onSuggestionsClearRequested = () => {
    this.setState({
      suggestions: []
    });
  };

  // retrieve data (button clicked) from child component
  getData = (data) => {
    this.setState({
      childData: data
    });
  }

  // add to playlist
  playlistUpdate = async () => {
    await fetch('https://api.spotify.com/v1/playlists/' + this.props.playlist_id + '/tracks?' +
      querystring.stringify({
        uris: this.state.childData.uri
      }), { 
        headers: {'Authorization': 'Bearer ' + this.props.access_token},
        method: 'POST'
      }
    )
    window.location.reload();
  }

  render() {
    const { value, suggestions } = this.state;
    const inputProps = {
      placeholder: 'Song Title',
      value,
      onChange: this.onChange
    };
    let songQueue = 
      this.state.childData
        ? this.state.childData.name + ' by ' + this.state.childData.artist
        : ''

    return (
      <div>
        <Form size='large'>
          <Segment inverted stacked>
            <Autosuggest 
              suggestions={suggestions}
              onSuggestionsFetchRequested={this.onSuggestionsFetchRequested}
              onSuggestionsClearRequested={this.onSuggestionsClearRequested}
              getSuggestionValue={getSuggestionValue}
              renderSuggestion={renderSuggestion}
              inputProps={inputProps}
              shouldRenderSuggestions={shouldRenderSuggestions}
            />
          </Segment>
        </Form>
        <SearchResults
          sendData={this.getData}
          songs={tenSongs.map(song => {
            return {
              name: song.name,
              artist: song.artist,
              uri: song.uri
            }
          })}
        />
        <Form size='large' >
          <Segment inverted stacked>
            <p>Song in add queue: {songQueue}</p>
            <Button onClick={this.playlistUpdate} type='submit' color='green' fluid size='large'>
              Add Song
            </Button>
          </Segment>
        </Form>
      </div>
    );
  }
}

export default Forms
