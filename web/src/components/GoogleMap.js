import React, { Component } from 'react';
import { withGoogleMap, GoogleMap, Marker, Circle } from 'react-google-maps';
import canUseDOM from 'can-use-dom';
import Promise from 'bluebird';
import axios from 'axios';
import LocationInput from './LocationInput';

const style = {
  position: 'absolute',
  height: '100%',
  width: '100%',
};

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
      }
    };
    this.handleMapLoad = this.handleMapLoad.bind(this);
    this.handleMapClick = this.handleMapClick.bind(this);
    this.handleMarkerClick = this.handleMarkerClick.bind(this);
    this.handleMarkerRightClick = this.handleMarkerRightClick.bind(this);
    this.handleReverseGeoCode = this.handleReverseGeoCode.bind(this);
  }

  componentDidMount() {
    const nextMarkers = [
      ...this.props.markers,
    ];
    axios.get('/api/retrieveMarkers')
    .then((res) => {
      for (let i = 0; i < res.data.length; i++) {
        let newMarker = {
          position: {lat: Number(res.data[i].lat), lng: Number(res.data[i].lng)},
          defaultAnimation: 3,
        };
        nextMarkers.push(newMarker);
      }
      this.props.setMarkers(nextMarkers);
      // console.log('end of component did mount', this.props.markers);
    })
    .then(() => {
      let context = this;
      geolocation.getCurrentPosition((position) => {
        return new Promise((resolve, reject) => {
          resolve(this.setState({
            center: {
              lat: position.coords.latitude,
              lng: position.coords.longitude,
            }
          }));
        })
        .then(() => {
          context.props.changeCenter(this.state.center);
        });
      });
    })
    .catch((err) => {
      console.log(err);
    });
  }

  handleMapLoad(map) {
    this._mapComponent = map;
  }

  handleMapClick(event) {
    const lat = event.latLng.lat();
    const lng = event.latLng.lng();
    const nextMarkers = [
      ...this.props.markers,
      {
        position: {lat: lat, lng: lng},
        defaultAnimation: 3,
      },
    ];
    console.log(this.state.center);
    this.props.setMarkers(nextMarkers);
    // this.props._mapComponent(lat, lng);
    this.props.changeCenter({lat: lat, lng: lng});
    this.handleReverseGeoCode({lat: lat, lng: lng});
    // console.log(this.props.markers);
  }

  handleMarkerClick(targetMarker) {
    const latlng = {
      lat: targetMarker.position.lat,
      lng: targetMarker.position.lng
    };
    // this.setState({
    //   colorChange: true,
    // });
    // console.log(this.state.icon);
    // this.handleReverseGeoCode(latlng);
  }

  handleMarkerRightClick(targetMarker) {
    const nextMarkers = this.props.markers.filter(marker => marker !== targetMarker);
    this.props.setMarkers(nextMarkers);
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

  render () {
    // console.log('withGmap', this.props.markers);
    // const icon = this.state.colorChange ? 'http://maps.google.com/mapfiles/ms/icons/green-dot.png' : 'http://maps.google.com/mapfiles/ms/icons/blue-dot.png';
    const Map = withGoogleMap(props => (
      <GoogleMap
        ref={props.onMapLoad}
        zoom={14}
        center={this.props.center}
        onClick={props.onMapClick}
        >
        {props.markers.map((marker, index) => (
          <Marker
          {...marker}
          onClick={() => props.onMarkerClick(marker)}
          onRightClick={() => props.onMarkerRightClick(marker)}
          icon={'http://maps.google.com/mapfiles/ms/icons/blue-dot.png'}
          key={index}
          >
          </Marker>
        ))}
      </GoogleMap>
    ));

    return (
      <div style={style}>
        <LocationInput
          markers={this.props.markers}
          setMarkers={this.props.setMarkers}
          changeCenter={this.props.changeCenter}
          handleReverseGeoCode={this.handleReverseGeoCode}
          />
        <Map style={style}
          containerElement={ <div className='map-container' style={style}></div>}
          mapElement={ <div id='map' className='map-section' style={style}></div>}
          onMapLoad={this.handleMapLoad}
          onMapClick={this.handleMapClick}
          markers={this.props.markers}
          onMarkerRightClick={this.handleMarkerRightClick}
          onMarkerClick={this.handleMarkerClick}
        />
      </div>
    );
  }
}

export default Gmap;
