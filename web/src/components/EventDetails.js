import axios from 'axios';
import Comments from './Comments';
import { Dialog, FlatButton, RaisedButton, Avatar, Chip, Tabs, Tab } from 'material-ui';
import FontIcon from 'material-ui/FontIcon';
import Home from 'material-ui-icons/Home';
import IconButton from 'material-ui/IconButton';
import React, { Component } from 'react';
import moment from 'moment';

class EventDetails extends Component {
  constructor(props) {
    super(props);
    this.handleLike = this.handleLike.bind(this);
    this.handleClose = this.handleClose.bind(this);
    this.handleAttend = this.handleAttend.bind(this);
  }

  handleClose() {
    this.props.toggleEventDetails();
  }

  handleAttend() {
    let currentEvent = this.props.eventDetails.currentEvent;
    axios.post('/api/attendEvent', { eventId: currentEvent.id })
    .then(res => {
      console.log(res.data);
      this.props.disableButton({ attendDisabled: true });
    })
    .catch(err => { console.log(err); });
  }

  handleLike() {
    let currentEvent = this.props.eventDetails.currentEvent;
    axios.post('/api/likeEvent', { eventId: currentEvent.id })
    .then(res => {
      console.log(res.data);
      this.props.disableButton({ likeDisabled: true });
      this.props.incrementLikes();
    })
    .catch(err => { console.log(err); });
  }

  render() {
    let currentEvent = this.props.eventDetails.currentEvent;

    const actions = [
      <FlatButton
        label="Like"
        onTouchTap={this.handleLike}
        disabled={this.props.eventDetails.likeDisabled}
      />,
      <FlatButton
        label="Attend"
        onTouchTap={this.handleAttend}
        disabled={this.props.eventDetails.attendDisabled}
      />,
      <IconButton style={styles.homeIcon}>
        <Home
          onTouchTap={this.handleClose}
          color='purple'
          hoverColor='blue'
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
          autoScrollBodyContent={true}
          >
          <Tabs>
            <Tab
              label="Event Details"
              style={styles.leftTab}
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
                <p><strong>Participants: </strong>{participants}</p>
                <p><strong>Likes: </strong>{this.props.eventDetails.likeCount}</p>
            </Tab>
            <Tab
              label="Event Comments"
              style={styles.theme}
            >
              <Comments {...this.props}/>
            </Tab>
          </Tabs>
        </Dialog>
      );
    } else { return null; }
  }
}

const styles = {
  image: {
    width: 'auto',
    height: 'auto',
    'max-height': 250,
    'max-width': 300,
  },
  theme: {
    backgroundColor: '#D1C4E9',
  },
  leftTab: {
    backgroundColor: '#D1C4E9',
    borderColor: '#5E35B1',
    borderRightStyle: 'dotted',
    borderWidth: '1px',
  },
  homeIcon: {
    position: 'absolute',
    left: '10',
    bottom: '1'
  }
};

export default EventDetails;
