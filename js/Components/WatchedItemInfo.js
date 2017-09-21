class WatchedItemInfo extends React.Component {

  constructor(props) {
    super(props)
  }

  render() {
    var episodeDetails

    if (this.props.episode) {

      var season = this.props.episode.season
      var episodeNr =  this.props.episode.number

      episodeDetails = <h3 className="episode-details">{`${season}x${episodeNr}`}</h3>
    }

    return (
      <div className="watched-list-item-details">
        <h2>{this.props.title}</h2>
        <h3 className="subtitle">{this.props.subtitle}</h3>
        <div className="watch-date-container">
          <h3 className="watch-date watch-date-date">{this.props.date.toLocaleDateString()}</h3>
          <h3 className="watch-date watch-date-time">{this.props.date.toLocaleTimeString()}</h3>
        </div>
        {episodeDetails}
      </div>
    )
  }
}
