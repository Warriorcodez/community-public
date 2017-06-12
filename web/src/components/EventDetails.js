import React, { Component } from 'react';
import { Dialog, FlatButton, RaisedButton, Avatar, Chip, Tabs, Tab } from 'material-ui';
import axios from 'axios';
import moment from 'moment';
import Comments from './Comments';

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
      <FlatButton
        label="Cancel"
        primary={true}
        onTouchTap={this.handleClose}
      />
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
            <Comments {...this.props}/>
            <Tabs>
              <Tab
                label="Event Details"
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
                  <p><strong>Likes: </strong>{this.props.eventDetails.likeCount}</p>
              </Tab>
              <Tab
                label="Event Comments"
              >
                <Comments {...this.props}/>
              </Tab>
            </Tabs>
          <Tabs>
            <Tab
              label="Event Details"
              style={styles.leftTab}
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
  left: { float: 'left' },
  right: { float: 'left', paddingLeft: 7 },
  image: {
    width: 'auto',
    height: 'auto',
    'max-height': 250,
    'max-width': 300,
  },
  chip: {
    margin: 4,
  },
  wrapper: {
    display: 'flex',
    flexWrap: 'wrap',
  },
  theme: {
    backgroundColor: '#D1C4E9',
  },
  leftTab: {
    backgroundColor: '#D1C4E9',
    borderColor: '#5E35B1',
    borderRightStyle: 'dotted',
    borderWidth: '1px',
  }
};

export default EventDetails;
