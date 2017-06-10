import axios from 'axios';
import { Card, Dialog, FlatButton, GridList, GridTile, IconButton, Subheader, SelectField, MenuItem } from 'material-ui';
import GridTileComponent from './GridTile.js';
import Promise from 'bluebird';
import React, { Component } from 'react';
import StarBorder from 'material-ui/svg-icons/toggle/star-border';

class FindEvents extends Component {
  constructor(props) {
    super(props);
    this.state = {
      value: 'Select Category...',
    };
    this.handleTileClick = this.handleTileClick.bind(this);
    this.handleChange = this.handleChange.bind(this);
  }

  handleTileClick(i) {
    const lat = this.props.events[i].lat;
    const lng = this.props.events[i].lng;
    this.props.changeCenter({lat: Number(lat), lng: Number(lng)});
    this.props.setCurrentEventParticipants([]);
    this.props.setCurrentEvent(this.props.events[i]);
    this.props.toggleEventDetails();

    axios.post('/api/retrieveParticipants', { eventId: this.props.events[i].id })
    .then(res => {
      // let participants = res.data.filter(entry => entry.is_attending).map(entry => {
      //   return { display: entry.profile.display, email: entry.profile.email };
      // });
      // console.log(participants);
      this.props.setCurrentEventParticipants(res.data);
    })
    .catch(err => { console.log(err); });

    axios.post('/api/connectEventToProfile', { eventId: this.props.events[i].id })
    .then(res => {
      this.props.disableButton({
        attendDisabled: !!res.data.is_attending,
        likeDisabled: !!res.data.liked
      });
    })
    .catch(err => { console.log(err); });
  }

  handleChange(e) {
    axios.get('/api/retrieveCategoryEvents?query=' + e.target.innerHTML)
    .then((data) => {
      this.props.addEvents(data.data);
    })
    .catch((err) => {
      console.log(err);
    });
  }

  render() {
    return (
      <Card
        style={styles.container}
        containerStyle={styles.container}
      >
        <SelectField
         floatingLabelText={this.state.value}
         value={this.state.value}
         onChange={this.handleChange}
       >
         <MenuItem value={7} primaryText="All" />
         <MenuItem value={1} primaryText="Food" />
         <MenuItem value={2} primaryText="Sports" />
         <MenuItem value={3} primaryText="Outdoors" />
         <MenuItem value={4} primaryText="Nightlife" />
         <MenuItem value={5} primaryText="Games" />
         <MenuItem value={6} primaryText="Other" />
       </SelectField>
        <GridList cellHeight={220} cols={2} style={styles.gridList}>
          {this.props.events.map((tile, i) => (
            <GridTileComponent
              key={i}
              indexID={i}
              title={tile.event_name}
              titleBackground="linear-gradient(to top, rgba(94,53,177,0.7) 0%,rgba(94,53,177,0.3) 70%,rgba(94,53,177,0) 100%)"
              style={styles.tile}
              actionIcon={<IconButton><StarBorder color="white" /></IconButton>}
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
    height: '100%'
  },
  theme: {
    fontFamily: 'Vibur',
    fontSize: '20px'
  },
  gridList: {
    height: 490,
    padding: 15,
    overflowY: 'auto'
  },
  tile: {
    margin: 10,
    width: 300
  }
};

export default FindEvents;
