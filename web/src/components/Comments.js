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
    this.clearText = this.clearText.bind(this);
  }

  handleChange(event) {
    this.setState({
      text: event.target.value,
      // date + time: null, // do I need date and time?
    });
  }

  handleSubmit(event) {
    event.preventDefault();
    axios.post('/api/comments', {
      text: this.state.text,
      event_id: this.props.eventDetails.currentEventIndex,
      profile_id: null
      // date + time ?
    })
    .then(res => {
      console.log('response object ', res); // FIX CLEAR FORM 
      this.clearText();
    });
    // .catch(error => {
    //
    // });
  }

  clearText() {
    this.setState({
      text: '',
      // date + time ?
    });
  }


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
