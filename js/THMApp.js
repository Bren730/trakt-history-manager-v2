'use strict'

class THMApp
{

  constructor()
  {

    this._config = {}

  }

  initialise()
  {
    this.trakt = new THMTrakt()

    document.addEventListener(
      this.trakt.events.ALL_WATCHES_COUNT_CHANGED,
      (e) => {
        return this.trakt.getAllWatches()
      },
      false);

      document.addEventListener(
        this.trakt.events.ALL_WATCHES_CHANGED,
        (e) => {
          return this.invalidateWatchedList()
        },
        false);

      // Check if localstorage already holds auth data
      if (this.isLoggedIn())
      {
        console.log("user is logged in")
        this.trakt.getAllWatchesCount()
      }
      else {
        console.log('user not logged in')
        if (getUrlParameterByName('code') !== null)
        {
          this.trakt.getAccessTokenFromCode(getUrlParameterByName('code'))
        }
      }

    }

    invalidateWatchedList() {
      console.log("watched list invalidated")
      ReactDOM.render(
        <WatchedList entries={this.trakt.allWatches} />,
        document.getElementById('watched-list-main')
      )
    }

    isLoggedIn()
    {
      return (this.storage('traktAuth') !== undefined) ? true : false
    }

    storage(key, value)
    {
      key = `THM.${key}`

      if (value === undefined) {

        value = window.localStorage[key]

        try {

          value = JSON.parse(value)

        } catch(err) {}

        return value

      } else {

        window.localStorage[key] = typeof value === 'object' ? JSON.stringify(value) : value

      }

    }

    getConfig()
    {
      if (this.storage('config') !== undefined)
      {

        return this.storage('config')

      }
      else
      {

        return null

      }
    }

  }

  window.THMApp = new THMApp()
