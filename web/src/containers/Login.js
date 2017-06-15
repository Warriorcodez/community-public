import axios from 'axios';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import { changeHeader, updateForm, changeCenter, setMarkers, addGeolocation, addEvents, setCurrentEvent, toggleEventDetails, setCurrentEventParticipants } from '../actions';
import { Card, MenuItem, RaisedButton, SelectField, TextField } from 'material-ui';
import React, { Component } from 'react';
import beachVideo from '../../../public/assets/beach.mp4';

class Login extends Component {
  constructor(props) {
    super(props);
  }

  render() {
    return (
      <div style={styles.container}>
        <div style={styles.fullscreen}>
          <video loop muted autoPlay style={styles.video}>
            <source src='/assets/beach.mp4' type="video/mp4"/>
          </video>
        </div>
        <h1 style={styles.title}>Community</h1>
        <a href="/auth/facebook"><img src="https://www.bunditcenter.com/images/fb_signin.png" width="250" /></a>
      </div>
    );
  }
}

const styles = {
  fullscreen: {
    position: 'fixed',
    top: '0',
    right: '0',
    bottom: '0',
    left: '0',
    overflow: 'hidden',
    zIndex: '-100',
  },
  video: {
    position: 'absolute',
    top: '0',
    left: '0',
    width: '100%',
    height: '100%',
    objectFit: 'inherit'
  },
  container: {
    position: 'absolute',
    bottom: '25%',
    textAlign: 'center',
    width: '100%',
  },
  title: {
    fontFamily: 'Vibur',
    color: 'white',
    fontSize: '90px',
    marginBottom: '25px'
  }
};

const mapStateToProps = (state) => {
  return {
    header: state.header,
    events: state.events.allEvents,
    eventDetails: state.eventDetails,
  };
};

const matchDispatchToProps = (dispatch) => {
  return bindActionCreators({
    addEvents: addEvents,
    toggleEventDetails: toggleEventDetails,
    setCurrentEvent: setCurrentEvent,
    setCurrentEventParticipants: setCurrentEventParticipants
  }, dispatch);
};

export default connect(mapStateToProps, matchDispatchToProps)(Login);
