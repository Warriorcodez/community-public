import React, { Component } from 'react';
import { Dialog, FlatButton, RaisedButton, Avatar, Chip, Tabs, Tab } from 'material-ui';
import axios from 'axios';
import Comments from './Comments';
import FontIcon from 'material-ui/FontIcon';
import Clear from 'material-ui-icons/Clear';
import IconButton from 'material-ui/IconButton';
import moment from 'moment';

class EventDetails extends Component {
  constructor(props) {
    super(props);

    this.handleLike = this.handleLike.bind(this);
    this.handleUnlike = this.handleUnlike.bind(this);
    this.handleClose = this.handleClose.bind(this);
    this.handleAttend = this.handleAttend.bind(this);
    this.handleUnattend = this.handleUnattend.bind(this);
  }

  handleClose() {
    this.props.toggleEventDetails();
  }

  handleAttend() {
    let currentEvent = this.props.eventDetails.currentEvent;
    axios.post('/api/attendEvent', { eventId: currentEvent.id })
    .then(res => {
      console.log(res.data);
      this.props.updateButton({ isAttendingEvent: true });
    })
    .catch(err => { console.log(err); });
  }

  handleUnattend() {
    let currentEvent = this.props.eventDetails.currentEvent;
    axios.post('/api/unattendEvent', { eventId: currentEvent.id })
    .then(res => {
      console.log(res.data);
      this.props.updateButton({ isAttendingEvent: false });
    })
    .catch(err => { console.log(err); });
  }

  handleLike() {
    let currentEvent = this.props.eventDetails.currentEvent;
    axios.post('/api/likeEvent', { eventId: currentEvent.id })
    .then(res => {
      console.log(res.data);
      this.props.updateButton({ hasLikedEvent: true });
      this.props.incrementLikes();
    })
    .catch(err => { console.log(err); });
  }

  handleUnlike() {
    let currentEvent = this.props.eventDetails.currentEvent;
    axios.post('/api/unlikeEvent', { eventId: currentEvent.id })
    .then(res => {
      console.log(res.data);
      this.props.updateButton({ hasLikedEvent: false });
      this.props.decrementLikes();
    })
    .catch(err => { console.log(err); });
  }

  render() {
    let currentEvent = this.props.eventDetails.currentEvent;

    const actions = [
      <FlatButton
        label={this.props.eventDetails.hasLikedEvent ? 'Unlike' : 'Like'}
        onTouchTap={this.props.eventDetails.hasLikedEvent ? this.handleUnlike : this.handleLike}
        style={{color: '#31575B'}}
      />,
      <FlatButton
        label={this.props.eventDetails.isAttendingEvent ? 'Unattend' : 'Attend'}
        onTouchTap={this.props.eventDetails.isAttendingEvent ? this.handleUnattend : this.handleAttend}
        style={{color: '#31575B'}}
      />,
      <IconButton style={styles.homeIcon}>
        <Clear
          onTouchTap={this.handleClose}
          color='#31575B'
          hoverColor='#C22B33'
        />
      </IconButton>
    ];

    if (currentEvent) {
      let parsedTime = moment(currentEvent.time).format('MMMM Do YYYY, h:mm a') + ' (' + moment(currentEvent.time).fromNow() + ')';
      let participants = this.props.eventDetails.participants;

      return (
        <Dialog
          title={currentEvent.event_name}
          actions={actions}
          modal={false}
          open={this.props.eventDetails.showEventDetails}
          onRequestClose={this.handleClose}
          autoScrollBodyContent='true'
          >
            <div style={{height: 500}}>
            <Tabs
              inkBarStyle={{backgroundColor: '#C22B33', marginBottom: 20}}
              >
              <Tab
                label={<span style={{ color: '#31575B' }}>Event Details</span>}
                style={styles.tab}
              >
                <div style={styles.left}>
                  <img id="eventimage" style={styles.image} src={currentEvent.image} alt=''/>
                </div>
                <div style={styles.right}>
                  <img src="https://image.flaticon.com/icons/png/128/148/148836.png" width='20' alt="likes" />
                  {this.props.eventDetails.likeCount}
                  <p><strong>Time: </strong>{parsedTime}</p>
                  <p><strong>Location: </strong>{currentEvent.location}</p>
                  <p><strong>Description: </strong>{currentEvent.description}</p>
                  <p><strong>Category: </strong>{currentEvent.category}</p>
                  <p><strong>Participants: </strong>
                  {participants.map(participant => {
                    return (
                      <div style={styles.wrapper}>
                        <Chip onTouchTap={() => console.log('clicked')} style={styles.chip} >
                          <Avatar src={participant.profile_picture} size={50} />
                          {participant.display}
                        </Chip>
                      </div>
                    );
                  })}
                  </p>
                </div>
              </Tab>
              <Tab
                style={styles.tab}
                label={<span style={{ color: '#31575B' }}>Event Comments</span>}
              >
                <Comments {...this.props}/>
              </Tab>
            </Tabs>
          </div>
        </Dialog>
      );
    } else { return null; }
  }
}

const styles = {
  left: { float: 'left' },
  right: { float: 'left', paddingLeft: 7 },
  image: {
    width: 'auto',
    height: 'auto',
    maxWidth: 300,
    maxHeight: 350
  },
  chip: {
    margin: 4,
  },
  wrapper: {
    display: 'flex',
    flexWrap: 'wrap',
  },
  homeIcon: {
    position: 'absolute',
    left: '10',
    bottom: '1'
  },
  tab: {
    borderRightStyle: 'solid',
    borderWidth: '1px',
    boxShadow: '0 1px 3px 0 rgba(3, 3, 3, 0.2)',
    borderColor: 'white',
    color: '#31575B',
    borderBottom: 'red'
  }
};

export default EventDetails;
