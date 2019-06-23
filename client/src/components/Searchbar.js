import React from 'react';
import Autosuggest from 'react-autosuggest';
import './App.css';
import Searchbar2 from './Searchbar2'
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
/* ******************************************************** */

class Searchbar extends React.Component {
  constructor() {
    super();
    this.state = {
      value: '',
      suggestions: []
    };    
  }

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
      .then(async songArray => {
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
          tenSongs = await this.state.songs
        }
      })
      .then(console.log(this.state.songs))
      .then(console.log(tenSongs))
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

  render() {
    const { value, suggestions } = this.state;
    const inputProps = {
      placeholder: 'Song Title',
      value,
      onChange: this.onChange
    };

    return (
      <div>
        <Form action='http://localhost:5000/add' method='post' size='large' >
          <Autosuggest 
            suggestions={suggestions}
            onSuggestionsFetchRequested={this.onSuggestionsFetchRequested}
            onSuggestionsClearRequested={this.onSuggestionsClearRequested}
            getSuggestionValue={getSuggestionValue}
            renderSuggestion={renderSuggestion}
            inputProps={inputProps}>
          </Autosuggest>
          <Searchbar2 
            artists={tenSongs.map(song => {
              return {
                artist: song.artist
              }
            })}
          />
          <Segment inverted stacked>
            <Button type='submit' color='green' fluid size='large'>
              Add Song
            </Button>
          </Segment>
        </Form>
      </div>
    );
  }
}

export default Searchbar
