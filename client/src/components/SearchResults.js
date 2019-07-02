import React from 'react';
import './App.css';
import { Button } from 'semantic-ui-react'

class SearchResults extends React.Component { // component for search results
  addSong = (song) => {
    this.props.sendData(song)
  }

  render() {
    let optionsLength = this.props.songs.length
    let optionRender;
    if(optionsLength > 0) {
      var count = 0;
      optionRender = this.props.songs.map(song => {
        count++;
        return <Button onClick={() => this.addSong(song)} inverted key={song.uri} style={{marginBottom:'1rem'}}>
          {count}. {song.name} by {song.artist}
        </Button>
      })
    }
    return (
      <div>
        {optionRender}
      </div>
    );
  }
}

export default SearchResults