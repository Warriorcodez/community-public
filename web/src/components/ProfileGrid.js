import axios from 'axios';
import { Card, Dialog, FlatButton, GridList, GridTile, IconButton, Subheader } from 'material-ui';
import GridTileComponent from './GridTile.js';
import Promise from 'bluebird';
import React, { Component } from 'react';
import StarBorder from 'material-ui/svg-icons/toggle/star-border';

class ProfileGrid extends Component {
  constructor(props) {
    super(props);
    this.onGridClick = this.onGridClick.bind(this);
  }

  onGridClick(i) {
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
    .then(res => {
      // let participants = res.data.filter(entry => entry.is_attending).map(entry => {
      //   return { display: entry.profile.display, email: entry.profile.email };
      // });
      // console.log(participants);
      this.props.setCurrentEventParticipants(res.data);
    })
    .catch(err => { console.log(err); });

    axios.post('/api/countLikes', { eventId: this.props.events[i].id })
    .then(res => { this.props.setCurrentEventLikes(res.data.like_count); })
    .catch(err => { console.log(err); });
  }

  render() {
    return (
      <Card
        style={styles.container}
        containerStyle={styles.container}
      >
        <GridList style={styles.gridList}>
          {this.props.events.map((tile, i) => (
            <GridTileComponent
              key={i}
              indexID={i}
              title={tile.event_name}
              // titleBackground="linear-gradient(to top, rgba(127,0,255,0.7) 0%,rgba(127,0,255,0.3) 70%,rgba(127,0,255,0) 100%)"
              style={styles.tile}
              actionIcon={<IconButton><StarBorder color="white" /></IconButton>}
              imageSRC={tile.image}
              data={this.props.events}
              onClick={() => this.onGridClick(i)}
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
  },
  theme: {
    fontFamily: 'Roboto',
    fontSize: '20px'
  },
  gridList: {
    // display: 'flex',
    flexWrap: 'nowrap',
    flexDirection: 'row',
    width: 1150,
    height: 200,
    overflowX: 'auto',
    padding: 10,
    alignItems: 'left'
  },
  tile: {
    margin: 10,
    width: 280,
    height: 180,
    cursor: 'pointer'
  },
};

export default ProfileGrid;
