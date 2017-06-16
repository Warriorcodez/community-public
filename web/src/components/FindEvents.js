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
    this.props.setCurrentEventLikes(0);
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
        style={styles.containerChildren}
        containerStyle={styles.container}
        >
        <GridList cellHeight={200} cols={2} style={styles.gridList} >
          {this.props.events.map((tile, i) => (
            <GridTileComponent
              key={i}
              indexID={i}
              title={tile.event_name}
              style={styles.tile}
              actionIcon={<IconButton><StarBorder color="f6f5f0" /></IconButton>}
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
  containerChildren: {
    display: 'flex',
    flexWrap: 'wrap',
    // justifyContent: 'space-around',
  },
  container: {
    height: window.innerHeight * .86,
  },
  theme: {
    fontFamily: 'Roboto',
    fontSize: '20px'
  },
  gridList: {
    overflowY: 'auto',
    marginTop: window.innerHeight * .03,
    paddingLeft: window.innerWidth * .02,
    paddingRight: window.innerWidth * .03,
    height: window.innerHeight * .82
  },
  dropdown: {
    width: 250,
    position: 'relative',
    left: '120'
  },
  tile: {
    margin: 10,
    width: 280,
    height: 180,
    cursor: 'pointer'
  },
};

export default FindEvents;
