import axios from 'axios';
import { Card, Dialog, FlatButton, GridList, GridTile, IconButton, Subheader, SelectField, MenuItem, Popover, RaisedButton, Menu } from 'material-ui';
import GridTileComponent from './GridTile.js';
import Promise from 'bluebird';
import React, { Component } from 'react';
import StarBorder from 'material-ui/svg-icons/toggle/star-border';

class FindEvents extends Component {
  constructor(props) {
    super(props);
    this.handleTileClick = this.handleTileClick.bind(this);
  }

  handleTileClick(i) {
    const lat = this.props.events[i].lat;
    const lng = this.props.events[i].lng;
    this.props.changeCenter({lat: Number(lat), lng: Number(lng)});

    this.props.setCurrentEventParticipants([]);
    this.props.setCurrentEvent(this.props.events[i]);
    this.props.toggleEventDetails();

    axios.post('/api/connectEventToProfile', { eventId: this.props.events[i].id })
    .then(res => {
      this.props.updateButton({
        isAttendingEvent: !!res.data.is_attending,
        hasLikedEvent: !!res.data.liked
      });
    })
    .catch(err => { console.log(err); });

    axios.post('/api/retrieveParticipants', { eventId: this.props.events[i].id })
    .then(res => { this.props.setCurrentEventParticipants(res.data); })
    .catch(err => { console.log(err); });

    axios.post('/api/countLikes', { eventId: this.props.events[i].id })
    .then(res => { this.props.setCurrentEventLikes(res.data.like_count); })
    .catch(err => { console.log(err); });
  }

  render() {
    return (
      <Card
        containerStyle={styles.gridList}
      >
          <GridList cellHeight={220} cols={2} style={styles.container}>
            {this.props.events.map((tile, i) => (
              <GridTileComponent
                key={i}
                indexID={i}
                title={tile.event_name}
                // titleBackground="linear-gradient(to top, rgba(94,53,177,0.7) 0%,rgba(94,53,177,0.3) 70%,rgba(94,53,177,0) 100%)"
                style={styles.tile}
                actionIcon={<IconButton><StarBorder color='white' /></IconButton>}
                imageSRC={tile.image}
                data={this.props.events}
                onClick={() => this.handleTileClick(i)}
                >
                </GridTileComponent>
              ))}
            </GridList>
      </Card>
    );
  }
}

const styles = {
  container: {
    display: 'flex',
    flexWrap: 'wrap',
    justifyContent: 'space-around',
    height: '100%',
    zIndex: 3
  },
  theme: {
    fontFamily: 'Roboto',
    fontSize: '20px'
  },
  gridList: {
    height: '100%',
    marginBottom: 0,
    padding: 15,
    overflowY: 'auto'
  },
  tile: {
    margin: 10,
    width: 270,
    cursor: 'pointer',
  },
  dropdown: {
    width: 250,
    position: 'relative',
    left: '120'
  }
};

export default FindEvents;
