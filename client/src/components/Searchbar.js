import React from 'react';
import Autosuggest from 'react-autosuggest';
import './App.css';
let querystring = require('querystring')

var threeSongs = [];

// https://developer.mozilla.org/en/docs/Web/JavaScript/Guide/Regular_Expressions#Using_Special_Characters
function escapeRegexCharacters(str) {
  return str.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
}

function getSuggestions(value) {
  const escapedValue = escapeRegexCharacters(value.trim());
  
  if (escapedValue === '') {
    return [];
  }

  const regex = new RegExp('^' + escapedValue, 'i');

  return threeSongs.filter(song => regex.test(song.name));
}

function getSuggestionValue(suggestion) {
  return suggestion.name;
}

function renderSuggestion(suggestion) {
  return (
    <span>{suggestion.name} by {suggestion.artist}</span>
  );
}

class Searchbar extends React.Component {
  constructor() {
    super();
    this.state = {
      value: 'Drip Too Hard',
      suggestions: []
    };    
  }

  onChange = async (event, { newValue, method }) => {
    this.setState({
      value: newValue
    });
    if (newValue) {
      console.log('https://api.spotify.com/v1/search?' + 
      querystring.stringify({
        q: newValue,
        type: 'track',
        limit: '3'
      }))
      fetch('https://api.spotify.com/v1/search?' + 
      querystring.stringify({
        q: newValue,
        type: 'track',
        limit: '3'
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
          threeSongs = this.state.songs
        }
      })
      .then(console.log(this.state.songs))
      .then(console.log(threeSongs))
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
      <Autosuggest 
        suggestions={suggestions}
        onSuggestionsFetchRequested={this.onSuggestionsFetchRequested}
        onSuggestionsClearRequested={this.onSuggestionsClearRequested}
        getSuggestionValue={getSuggestionValue}
        renderSuggestion={renderSuggestion}
        inputProps={inputProps} />
    );
  }
}

export default Searchbar
