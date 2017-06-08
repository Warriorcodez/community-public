import React, { Component } from 'react';
import { Dialog, FlatButton, RaisedButton } from 'material-ui';
import axios from 'axios';
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
    let currentEvent = this.props.events[this.props.eventDetails.currentEventIndex];
    axios.post('/api/attendEvent', { eventId: currentEvent.id })
    .then(res => {
      console.log(res.data);
      this.props.disableButton({ attendDisabled: true });
    })
    .catch(err => { console.log(err); });
  }

  handleLike() {
    let currentEvent = this.props.events[this.props.eventDetails.currentEventIndex];
    axios.post('/api/likeEvent', { eventId: currentEvent.id })
    .then(res => {
      console.log(res.data);
      this.props.disableButton({ likeDisabled: true });
    })
    .catch(err => { console.log(err); });
  }

  render() {
    let currentEvent = this.props.events[this.props.eventDetails.currentEventIndex];

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
      <FlatButton
        label="Cancel"
        primary={true}
        onTouchTap={this.handleClose}
      />
    ];

    if (currentEvent) {
      let parsedTime = moment(currentEvent.time).format('MMMM Do YYYY, h:mm a') + ' (' + moment(currentEvent.time).fromNow() + ')';
      let participants = this.props.eventDetails.participants.map(obj => obj.display).join(',');

      return (
        <Dialog
          title={currentEvent.event_name}
          actions={actions}
          modal={false}
          open={this.props.eventDetails.showEventDetails}
          onRequestClose={this.handleClose}
          autoScrollBodyContent={true}
          >
          <div>
            <img id="eventimage" style={styles.image} src={currentEvent.image} alt=''/>
          </div>
          <br />
            <p><strong>Time: </strong>{parsedTime}</p>
            <p><strong>Location: </strong>{currentEvent.location}</p>
            <p><strong>Description: </strong>{currentEvent.description}</p>
            <p><strong>Category: </strong>{currentEvent.category}</p>
            <p><strong>Participants: </strong>{participants}</p>
        </Dialog>
      );
    } else { return null; }
  }
}

const styles = {
  image: {
    width: 'auto',
    height: 'auto',
    'max-width': 500,
    'max-height': 500
  }
};

export default EventDetails;
