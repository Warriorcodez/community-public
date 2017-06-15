import axios from 'axios';
import canUseDOM from 'can-use-dom';
import { Circle, GoogleMap, Marker, withGoogleMap } from 'react-google-maps';
import FontIcon from 'material-ui/FontIcon';
import IconButton from 'material-ui/IconButton';
import LocationInput from './LocationInput';
import LocationSearching from 'material-ui-icons/LocationSearching';
import Autorenew from 'material-ui-icons/Autorenew';
import Paper from 'material-ui/Paper';
import Promise from 'bluebird';
import React, { Component } from 'react';

const geolocation = (
  canUseDOM && navigator.geolocation ?
  navigator.geolocation :
  ({
    getCurrentPosition(success, failure) {
      if (failure) {
        console.log('Your browser does not support geolocation.');
      }
    },
  })
);

class Gmap extends Component {
  constructor(props) {
    super(props);
    this.state = {
      center: {
        lat: 40.758895,
        lng: -73.985131,
      },
      userLocation: {
        lat: '',
        lng: ''
      }
    };
    this.handleMapLoad = this.handleMapLoad.bind(this);
    this.handleMarkerClick = this.handleMarkerClick.bind(this);
    this.handleReverseGeoCode = this.handleReverseGeoCode.bind(this);
    this.recenter = this.recenter.bind(this);
    this.onRefresh = this.onRefresh.bind(this);
    // this.onMapClick = this.onMapClick.bind(this);
  }

  componentDidMount() {
    let context = this;
    geolocation.getCurrentPosition((position) => {
      return new Promise((resolve, reject) => {
        resolve(this.setState({
          center: {
            lat: position.coords.latitude,
            lng: position.coords.longitude
          },
          userLocation: {
            lat: position.coords.latitude,
            lng: position.coords.longitude,
          },
        }));
      })
      .then(() => {
        context.props.addGeolocation([{
          position: {
            lat: this.state.center.lat,
            lng: this.state.center.lng,
          },
          defaultAnimation: 3,
        }]);
        context.props.changeCenter(this.state.center);
      })
      .catch((err) => {
        console.log(err);
      });
    });
  }

  handleMapLoad(map) {
    this._mapComponent = map;
  }

  handleMarkerClick(targetMarker, index) {
    this.props.setCurrentEvent(this.props.events[index]);
    this.props.toggleEventDetails();
    // this._mapComponent.panTo({lat: Number(targetMarker.lat), lng: Number(targetMarker.lng)});
    this.props.changeCenter({
      lat: Number(targetMarker.lat),
      lng: Number(targetMarker.lng)
    });
  }

  handleReverseGeoCode(latlng) {
    axios.post('/api/reverseGeoCode', {lat: latlng.lat, lng: latlng.lng})
    .then((res) => {
      console.log(res.data);
    })
    .catch((err) => {
      console.log(err);
    });
  }

  // onMapClick () {
  //   this._mapComponent.panTo({lat: 37.821593, lng: -121.999961});
  // }

  //25.0330 lat
  //121.5654 lng

  onRefresh() {
    axios.get('/api/retrieveEvents')
    .then((data) => {
      this.props.addEvents(data.data);
    });
  }

  recenter() {
    this._mapComponent.panTo({lat: this.state.userLocation.lat, lng: this.state.userLocation.lng});
    // this.props.changeCenter(this.state.userLocation);
  }

  render () {
    const Map = withGoogleMap(props => (
      <GoogleMap
        ref={props.onMapLoad}
        zoom={14}
        center={this.props.center}
        // onClick={this.onMapClick}
        >
        {this.props.events.map((marker, index) => (
          <Marker
          defaultAnimation={3}
          event_name={marker.event_name}
          position={{lat: Number(marker.lat), lng: Number(marker.lng)}}
          onClick={() => props.onMarkerClick(marker, index)}
          icon={'http://chart.apis.google.com/chart?chst=d_map_pin_letter&chld=%E2%80%A2|C22B33'}
          key={'marker_' + index}
          >
          </Marker>
        ))}
        {props.geolocation.map((marker, index) => (
          <Marker
            defaultAnimation={3}
            position={{lat: this.state.center.lat, lng: this.state.center.lng}}
            key={'geo_' + index}
            icon={'http://maps.google.com/mapfiles/ms/icons/blue-dot.png'}
          >
          </Marker>
        ))}
      </GoogleMap>
    ));

    return (
      <div style={styles.container}>
        <LocationInput
          markers={this.props.markers}
          setMarkers={this.props.setMarkers}
          changeCenter={this.props.changeCenter}
          handleReverseGeoCode={this.handleReverseGeoCode}
          />
        <Map style={styles.container}
          containerElement={ <div className='map-container' style={styles.container}></div>}
          mapElement={ <div id='map' className='map-section' style={styles.mapSize}></div>}
          onMapLoad={this.handleMapLoad}
          markers={this.props.markers}
          onMarkerRightClick={this.handleMarkerRightClick}
          onMarkerClick={this.handleMarkerClick}
          geolocation={this.props.geolocation}
        />
        <IconButton style={styles.recenter}>
          <Paper style={styles.circle} zDepth={2} circle={true} >
            <LocationSearching
              onTouchTap={this.recenter}
              color={'#31575B'}
            />
          </Paper>
        </IconButton>
        <IconButton style={styles.refresh}>
          <Paper style={styles.circle} zDepth={2} circle={true} >
            <Autorenew
              onTouchTap={this.onRefresh}
              color={'#31575B'}
            />
          </Paper>
        </IconButton>
      </div>
    );
  }
}

const styles = {
  container: {
    width: '100%',
    height: '100%'
  },
  mapSize: {
    position: 'absolute',
    height: 'calc(100% - 112px)',
    width: '50%',
  },
  recenter: {
    position: 'absolute',
    top: '112px',
    right: '0px'
  },
  refresh: {
    position: 'absolute',
    top: '150px',
    right: '0px',
  },
  circle: {
    height: 100,
    width: 100,
    // margin: 20,
    display: 'inline-block',
  }
};


export default Gmap;
