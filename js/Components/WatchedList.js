class WatchedList extends React.Component {

  constructor(props) {
    super(props)
  }

  handleClick(e) {
    console.log(e.target)
    console.log('index', $(e.target).index())
  }

  render() {
    const entries = this.props.entries
    const listItems = entries.map((entry) =>
    <WatchedListItem watchDetails={entry} key={entry.id} />
    )

    return (
      <ul className="watched-list"  >
      {listItems}
      </ul>
    )
  }
}
