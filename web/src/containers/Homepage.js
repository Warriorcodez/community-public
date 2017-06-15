import axios from 'axios';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import { GridList, Dialog } from 'material-ui';
import {
  changeHeader,
  updateForm,
  changeCenter,
  setMarkers,
  addGeolocation,
  addEvents,
  setCurrentEvent,
  toggleEventDetails,
  setCurrentEventParticipants,
  disableButton,
  incrementLikes,
  setCurrentEventLikes,
  toggleCreateEvent
} from '../actions';
import Header from '../components/Header';
import CreateEventForm from '../components/CreateEventForm';
import FindEvents from '../components/FindEvents';
import EventDetails from '../components/EventDetails';
import Tools from '../components/Tools';
import Gmap from '../components/GoogleMap';
import React, { Component } from 'react';

class Homepage extends Component {

  componentWillMount() {
    axios.get('/api/retrieveEvents')
    .then((data) => {
      this.props.addEvents(data.data);
    });
  }

  render() {
    return (
      <div>
        <Header header={this.props.header} />
        <GridList>
          <div>
            <Tools {...this.props} geolocation={this.props.googleMap.geolocation} />
            <FindEvents
              events={this.props.events}
              googleMap={this.props.googleMap}
              setCurrentEvent={this.props.setCurrentEvent}
              toggleEventDetails={this.props.toggleEventDetails}
              setCurrentEventParticipants={this.props.setCurrentEventParticipants}
              disableButton={this.props.disableButton}
              changeCenter={this.props.changeCenter}
              addEvents={this.props.addEvents}
              setCurrentEventLikes={this.props.setCurrentEventLikes}
              geolocation={this.props.googleMap.geolocation}
            />
          </div>
          <div>
            <Gmap
              addEvents={this.props.addEvents}
              addGeolocation={this.props.addGeolocation}
              center={this.props.googleMap.center}
              changeCenter={this.props.changeCenter}
              events={this.props.events}
              geolocation={this.props.googleMap.geolocation}
              googleMap={this.props.googleMap.center}
              markers={this.props.googleMap.markers}
              setCurrentEvent={this.props.setCurrentEvent}
              toggleEventDetails={this.props.toggleEventDetails}
              style={styles.location}
            />
          </div>
        </GridList>
        <EventDetails
          toggleEventDetails={this.props.toggleEventDetails}
          eventDetails={this.props.eventDetails}
          disableButton={this.props.disableButton}
          incrementLikes={this.props.incrementLikes}
          events={this.props.events}
        />
        <CreateEventForm
          createEventForm={this.props.createEventForm}
          updateForm={this.props.updateForm}
          markers={this.props.googleMap.markers}
          changeCenter={this.props.changeCenter}
          addEvents={this.props.addEvents}
          events={this.props.events}
          toggleCreateEvent={this.props.toggleCreateEvent}
        />
      </div>
    );
  }
}

const styles = {
  container: {
    position: 'absolute',
    height: 'calc(100% - 112px)',
    width: '50%',
  },
  gridContainer: {
    height: '100%',
  },
  theme: {
    borderColor: '#ddd',
    fontFamily: 'Roboto',
    color: '#3EB1E0',
    borderRightStyle: 'solid',
    borderWidth: '1px',
    boxShadow: '0 1px 3px 0 rgba(3, 3, 3, 0.2)',
    color: '#31575B'
  },
  location: {
    fontFamily: 'Roboto'
  }
};

const mapStateToProps = (state) => {
  return {
    header: state.header,
    createEventForm: state.createEventForm,
    googleMap: state.googleMap,
    events: state.events.allEvents,
    eventDetails: state.eventDetails,
  };
};

const matchDispatchToProps = (dispatch) => {
  return bindActionCreators({
    addEvents: addEvents,
    addGeolocation: addGeolocation,
    changeCenter: changeCenter,
    changeHeader: changeHeader,
    updateForm: updateForm,
    toggleEventDetails: toggleEventDetails,
    setCurrentEvent: setCurrentEvent,
    setCurrentEventParticipants: setCurrentEventParticipants,
    disableButton: disableButton,
    setCurrentEventLikes: setCurrentEventLikes,
    incrementLikes: incrementLikes,
    toggleCreateEvent: toggleCreateEvent
  }, dispatch);
};

export default connect(mapStateToProps, matchDispatchToProps)(Homepage);
