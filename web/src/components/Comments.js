import axios from 'axios';
import React, { Component } from 'react';

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
    });
  }

  handleSubmit(event) {
    event.preventDefault();
    axios.post('/api/comments', {
      text: this.state.text,
      event_id: this.props.eventDetails.currentEvent.id,
      profile_id: null
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
