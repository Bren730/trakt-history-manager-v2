class WatchedListItem extends React.Component {

  constructor(props) {
    super(props)
    this.state = {selected: false}
  }

  handleClick(e) {
    const isSelected = this.state.selected
    this.setState({selected: !isSelected})
  }

  toggleSelection() {

  }

  componentDidMount() {

  }

  componentWillUnmount() {

  }

  render() {
    var episode = this.props.watchDetails.episode
    var title
    var subtitle
    var date = new Date(this.props.watchDetails.watched_at)

    if (episode) {

      title = this.props.watchDetails.show.title
      subtitle = episode.title

    } else {

      title = this.props.watchDetails[this.props.watchDetails.type].title

    }

    var defaultClassList = "watched-list-item"

    return <li className={this.state.selected ? defaultClassList + ' selected': defaultClassList} onClick={(e) => this.handleClick(e)}>
    <WatchedItemInfo
    title={title}
    date={date}
    episode={episode}
    subtitle={subtitle} />
    </li>
  }
}
