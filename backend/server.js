require('dotenv').config()
let express = require('express')
let request = require('request')
let querystring = require('querystring')

let app = express()

let redirect_uri = 
  process.env.REDIRECT_URI || 
  'http://localhost:5000/callback'

app.get('/login', function(req, res) { // oAuth Spotify request
  res.redirect('https://accounts.spotify.com/authorize?' +
    querystring.stringify({
      response_type: 'code',
      client_id: process.env.SPOTIFY_CLIENT_ID,
      scope: 'user-read-private user-read-email, \
        playlist-modify-public playlist-modify-private',
      redirect_uri
    }))
})

app.get('/callback', function(req, res) { // callback from Spotify with token
  let code = req.query.code || null
  let authOptions = {
    url: 'https://accounts.spotify.com/api/token',
    form: {
      code: code,
      redirect_uri,
      grant_type: 'authorization_code'
    },
    headers: {
      'Authorization': 'Basic ' + (new Buffer(
        process.env.SPOTIFY_CLIENT_ID + ':' + process.env.SPOTIFY_CLIENT_SECRET
      ).toString('base64'))
    },
    json: true
  }
  request.post(authOptions, function(error, response, body) { // redirect to client side with token
    let access_token = body.access_token
    let uri = process.env.FRONTEND_URI || 'http://localhost:3000/loggedin'
    res.redirect(uri + '?access_token=' + access_token)
  })
})

let port = process.env.PORT || 5000
console.log(`Listening on port ${port}.`)
app.listen(port)