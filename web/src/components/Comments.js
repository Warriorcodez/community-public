import axios from 'axios';
import React, { Component } from 'react';

const profile_id = 1; // FIX ME

class Comments extends Component {
  constructor(props) {
    super(props);

    this.state = {
      text: ''
    };

    this.handleSubmit = this.handleSubmit.bind(this);
    this.handleChange = this.handleChange.bind(this);
    this.clearInputField = this.clearInputField.bind(this);
  }

  handleChange(event) {
    this.setState({
      text: event.target.value,
      // date: null, // do I need date and time?
      // time: null
    });
  }

  handleSubmit(event) {
    event.preventDefault();
    axios.post('/api/comments', {
      text: this.state.text,
      event_id: this.props.eventDetails.currentEventIndex,
      profile_id: null
    })
    .then(res => {
      console.log('response object ', res);
    });
  }

  clearInputField() {
    this.setState({
      text: '',
      // date: null, // do i need date and time?
      // time: null
    });
  }

/*
the server will send a response data object back
the response data object will be the same as the request object
the client will render the data object on the comments section with the latest comment appended to the top of the list

make a post request to the server
send a request object
the request object will have the text from the input field as a property
receive the latest comment back in a response object from the server
Showing existing comments
Make a get request to the server ‘/comments’
With query parameters for the event id (?event_id=number)
*/

// event_id = this.props.eventDetails.currentEventIndex


  render() {
    // console.log('PROPS ===??? ', this.props);
    // console.log('props in comments ', this.props);
    // console.log('current event index = ', this.props.eventDetails.currentEventIndex)
    return (
      <div>
        <form style={styles.container}>
          <input
            type="text"
            name="name"
            onChange={this.handleChange}
          />
          <input
            type="submit"
            name="comment"
            onClick={this.handleSubmit}
          />
        </form>
        <div>
          *** THIS SECTION WILL HAVE ALL COMMENTS RELATED TO THE EVENT ***
        </div>
      </div>
    );
  }
}

const styles = {
  container: {
    height: '20%',
    widtgh: '10%'
  }
};

export default Comments;
