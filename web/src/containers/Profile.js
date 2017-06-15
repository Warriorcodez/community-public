import axios from 'axios';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import { Card, Avatar } from 'material-ui';
import {
  addEvents,
  setCurrentEvent,
  toggleEventDetails,
  setCurrentEventParticipants,
  setCurrentEventLikes,
  updateButton,
  incrementLikes,
  decrementLikes,
  toggleLoadingIndicator
  } from '../actions';
import Header from '../components/Header';
import ProfileGrid from '../components/ProfileGrid';
import EventDetails from '../components/EventDetails';
import React, { Component } from 'react';
const Spinner = require('react-spinkit');

class Profile extends Component {
  constructor(props) {
    super(props);
    this.state = {
      pastEvents: [],
      upcomingEvents: [],
    };
  }

  componentWillMount() {
    this.props.toggleLoadingIndicator();

    axios.post('/api/retrieveUserEvents')
    .then((res) => {
      let parsed = res.data.map(entry => entry.event);
      let now = new Date();
      let upcoming = [];
      let past = [];
      parsed.forEach(entry => {
        let eventTime = new Date(entry.time);
        if (eventTime.getTime() > now.getTime()) {
          upcoming.push(entry);
        } else { past.push(entry); }
      });
      this.setState({
        pastEvents: past,
        upcomingEvents: upcoming,
      }, () => {
        this.props.toggleLoadingIndicator();
      });
    });
  }

  render() {
    return (
      <div>
        {this.props.isLoading ?
          (<div style={styles.loadingContainer}>
            <div style={styles.loadingOverlay}></div>
            <Spinner name='three-bounce' color="#C22B33" fadeIn="none" style={styles.loading}/>
          </div>) : null
        }
        <Header header={this.props.header}/>
        <Card style={styles.container} >
          <div style={styles.welcome} >Welcome, {JSON.parse(window.user).first}</div>
          <Avatar src={JSON.parse(window.user).profile_picture} size={100} />
          <h3 style={styles.heading} >Upcoming Events</h3>
          <ProfileGrid
            events={this.state.upcomingEvents}
            setCurrentEvent={this.props.setCurrentEvent}
            eventDetails={this.props.eventDetails}
            toggleEventDetails={this.props.toggleEventDetails}
            updateButton={this.props.updateButton}
            setCurrentEventParticipants={this.props.setCurrentEventParticipants}
          />
          <br />
          <h3 style={styles.heading} >Past Events</h3>
          <ProfileGrid
            events={this.state.pastEvents}
            setCurrentEvent={this.props.setCurrentEvent}
            eventDetails={this.props.eventDetails}
            toggleEventDetails={this.props.toggleEventDetails}
            updateButton={this.props.updateButton}
            setCurrentEventParticipants={this.props.setCurrentEventParticipants}
            setCurrentEventLikes={this.props.setCurrentEventLikes}
          />
        </Card>
        <EventDetails
          toggleEventDetails={this.props.toggleEventDetails}
          eventDetails={this.props.eventDetails}
          updateButton={this.props.updateButton}
          incrementLikes={this.props.incrementLikes}
          decrementLikes={this.props.decrementLikes}
          setCurrentEventParticipants={this.props.setCurrentEventParticipants}
          events={this.props.events}
        />
      </div>
    );
  }
}

const styles = {
  container: {
    margin: 10,
    padding: 10
  },
  welcome: {
    fontSize: 20,
    fontFamily: 'Roboto',
    align: 'center',
    color: '#31575B'
  },
  heading: {
    fontSize: 20,
    fontFamily: 'Roboto',
    color: '#31575B'
  },
  loadingContainer: {
    width: '100%',
    height: '100%',
    position: 'absolute',
    top: '0',
    bottom: '0',
    right: '0',
    left: '0'
  },
  loadingOverlay: {
    width: '100%',
    height: '100%',
    position: 'absolute',
    top: '0',
    bottom: '0',
    right: '0',
    left: '0',
    zIndex: '800',
    backgroundColor: '#242424',
    opacity: '0.4'
  },
  loading: {
    width: '100',
    position: 'absolute',
    margin: 'auto',
    top: '0',
    bottom: '0',
    right: '0',
    left: '0',
    zIndex: '1000'
  }
};


const mapStateToProps = (state) => {
  return {
    header: state.header,
    events: state.events.allEvents,
    eventDetails: state.eventDetails,
    isLoading: state.loadingIndicator.isLoading
  };
};

const matchDispatchToProps = (dispatch) => {
  return bindActionCreators({
    addEvents: addEvents,
    toggleEventDetails: toggleEventDetails,
    setCurrentEvent: setCurrentEvent,
    setCurrentEventParticipants: setCurrentEventParticipants,
    setCurrentEventLikes: setCurrentEventLikes,
    updateButton: updateButton,
    incrementLikes: incrementLikes,
    decrementLikes: decrementLikes,
    toggleLoadingIndicator: toggleLoadingIndicator
  }, dispatch);
};

export default connect(mapStateToProps, matchDispatchToProps)(Profile);
