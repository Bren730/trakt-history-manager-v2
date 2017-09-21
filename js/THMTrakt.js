'use strict'

class THMTrakt
{

  constructor() {

    this.baseUrl = "https://api.trakt.tv/"
    this.clientId = "9f5448819b44fbf0e7a0df12f8bb772e2f8f129a288943832c527cc40c291201"
    this.clientSecret = "636c56c2eeb439828c8e41d419959d8405591f8d5698ae48a1ffdb4e7ed60074"
    this.redirectUri = "http://www.barbrenne.nl/"

    this.watchedMoviesCount = null
    this.watchedEpisodesCount = null
    this.allWatchesCount = null

    this.watchedMovies = []
    this.watchedEpisodes = []
    this.allWatches = []

    this.events = {
      USER_LOGGED_IN: 'userLoggedIn',
      WATCHED_MOVIES_COUNT_CHANGED: 'watchedMoviesCountChanged',
      WATCHED_MOVIES_CHANGED: 'watchedMoviesChanged',
      WATCHED_EPISODES_COUNT_CHANGED: 'watchedEpisodesCountChanged',
      WATCHED_EPISODES_CHANGED: 'watchedEpisodesChanged',
      ALL_WATCHES_COUNT_CHANGED: 'allWatchesCountChanged',
      ALL_WATCHES_CHANGED: 'allWatchesChanged'
    }

  }

  getAccessTokenFromCode(code) {
    //
    // var xhr = new XMLHttpRequest();
    //
    // xhr.open("POST", this.baseUrl + "oauth/token", true)
    // xhr.setRequestHeader("Content-Type", "application/json")
    //
    var options = {}

    options.code = String(code)
    options.client_id = this.clientId
    options.client_secret = this.clientSecret
    options.redirect_uri = this.redirectUri
    options.grant_type = "authorization_code"

    var xhr = this.post("oauth/token", options)

    xhr.onreadystatechange = function () {

      if(xhr.readyState === XMLHttpRequest.DONE && xhr.status === 200) {

        console.log(xhr.responseText);
        window.THMApp.storage('traktAuth', xhr.responseText)

      }
    }

    xhr.send(JSON.stringify(options))

  }

  getAccessToken() {

    if (window.THMApp.isLoggedIn()) {

      return window.THMApp.storage('traktAuth').access_token

    }
  }

  getWatchedMoviesCount()
  {
    if (this.watchedMoviesCount === null)
    {

      var options = {}

      var xhr = this.get('sync/history/movies?limit=1', options)

      xhr.onreadystatechange = () => {

        if(xhr.readyState === XMLHttpRequest.DONE && xhr.status === 200) {

          console.log(JSON.parse(xhr.responseText));
          this.watchedMoviesCount = parseInt(xhr.getResponseHeader('x-pagination-item-count'))
          customEvent(this.events.WATCHED_MOVIES_COUNT_CHANGED, {'watchedMoviesCount': this.watchedMoviesCount})

        }

      }

    } else {

      return this.watchedMoviesCount

    }
  }

  getWatchedMovies() {
    if (this.watchedMoviesCount !== null) {

      var options = {}
      var xhr = this.get('sync/history/movies?limit=' + String(this.watchedMoviesCount), options)

      xhr.onreadystatechange = () => {

        if(xhr.readyState === XMLHttpRequest.DONE && xhr.status === 200) {

          console.log(JSON.parse(xhr.responseText));
          this.watchedMovies = JSON.parse(xhr.responseText)
          customEvent(this.events.WATCHED_MOVIES_CHANGED, {})

        }
      }
    }
  }

  getWatchedEpisodesCount()
  {
    if (this.watchedEpisodesCount === null)
    {

      var options = {}

      var xhr = this.get('sync/history/shows?limit=1', options)

      xhr.onreadystatechange = () => {

        if(xhr.readyState === XMLHttpRequest.DONE && xhr.status === 200) {

          console.log(JSON.parse(xhr.responseText));
          this.watchedEpisodesCount = parseInt(xhr.getResponseHeader('x-pagination-item-count'))
          customEvent(this.events.WATCHED_EPISODES_COUNT_CHANGED, {'watchedMoviesCount': this.watchedMoviesCount})

        }

      }

    } else {

      return this.watchedEpisodesCount

    }
  }

  getWatchedEpisodes() {
    if (this.watchedEpisodesCount !== null) {

      var options = {}
      var xhr = this.get('sync/history/shows?limit=' + String(this.watchedEpisodesCount), options)

      xhr.onreadystatechange = () => {

        if(xhr.readyState === XMLHttpRequest.DONE && xhr.status === 200) {

          console.log(JSON.parse(xhr.responseText));
          this.watchedEpisodes = JSON.parse(xhr.responseText)
          customEvent(this.events.WATCHED_EPISODES_CHANGED, {})

        }
      }
    }
  }

  getAllWatchesCount() {
    if (this.allWatchesCount === null)
    {

      var options = {}

      var xhr = this.get('sync/history?limit=1', options)

      xhr.onreadystatechange = () => {

        if(xhr.readyState === XMLHttpRequest.DONE && xhr.status === 200) {

          console.log(JSON.parse(xhr.responseText));
          this.allWatchesCount = parseInt(xhr.getResponseHeader('x-pagination-item-count'))
          console.log("all watches count:", this.allWatchesCount)
          customEvent(this.events.ALL_WATCHES_COUNT_CHANGED, {'watchedMoviesCount': this.watchedMoviesCount})

        }

      }

    } else {

      return this.allWatchesCount

    }
  }

  getAllWatches() {

    if (this.allWatchesCount !== null) {

      var options = {}

      var xhr = this.get('sync/history?limit=' + String(this.allWatchesCount), options)

      xhr.onreadystatechange = () => {

        if(xhr.readyState === XMLHttpRequest.DONE && xhr.status === 200) {

          console.log(JSON.parse(xhr.responseText));
          this.allWatches = JSON.parse(xhr.responseText)
          customEvent(this.events.ALL_WATCHES_CHANGED, {})

        }
      }
    }
  }

  get(endpoint, options) {

    var xhr = new XMLHttpRequest();

    xhr.open("GET", this.baseUrl + endpoint, true)

    xhr.setRequestHeader('Content-Type', 'application/json');
    xhr.setRequestHeader('Authorization', 'Bearer ' + this.getAccessToken());
    xhr.setRequestHeader('trakt-api-version', '2');
    xhr.setRequestHeader('trakt-api-key', this.clientId);

    console.log("Making GET request with", options)

    xhr.send(JSON.stringify(options))
    return xhr

  }

  post(endpoint, options) {
    var xhr = new XMLHttpRequest();

    xhr.open("POST", this.baseUrl + endpoint, true)

    xhr.setRequestHeader('Content-Type', 'application/json');
    xhr.setRequestHeader('Authorization', 'Bearer ' + this.getAccessToken());
    xhr.setRequestHeader('trakt-api-version', '2');
    xhr.setRequestHeader('trakt-api-key', this.clientId);

    console.log("Making POST request with", options)

    xhr.send(JSON.stringify(options))
    return xhr
  }
}
