import axios from 'axios';
import React, { Component } from 'react';
import react_time_ago from 'react-time-ago';
import javascript_time_ago from 'javascript-time-ago';
javascript_time_ago.locale(require('javascript-time-ago/locales/en'));
import ReactTimeAgo from 'react-time-ago';
require('javascript-time-ago/intl-messageformat-global');
require('intl-messageformat/dist/locale-data/en');

class Comments extends Component {
  constructor(props) {
    super(props);

    this.state = {
      text: '',
      comments: []
    };

    this.handleSubmit = this.handleSubmit.bind(this);
    this.handleChange = this.handleChange.bind(this);
    this.clearText = this.clearText.bind(this);
  }

  componentDidMount() {
    axios.get('/api/retrieveComments?event_id=' + this.props.eventDetails.currentEvent.id)
    .then(comments => {
      // console.log('Comments === ', comments)
      const commentsArray = comments.data.map(comment => {
        return {
          username: comment.username,
          comment: comment.text,
          createdAt: comment.created_at
        };
      })
      .sort((latest, oldest) => {
        return new Date(oldest.createdAt) - new Date(latest.createdAt);
      });

      console.log('Sorted comments array ---------------------- ', commentsArray)

      this.setState({comments: commentsArray});
      // console.log('state right now ??? === ', this.state )
      // console.log('ALL COMMENTS ? === ', commentsArray);
    });
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
      this.clearText(); //FIX ME
    });
  }

  clearText() {
    this.setState({
      text: '',
    });
  }


  render() {
    // console.log('current state === ', this.state)
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
          {this.state.comments.map(comment => (
            <p>
              <strong>{comment.username} </strong> {comment.comment} {' '}
            {/* <ReactTimeAgo
              // locale='en-GB'
              // timeStyle='twitter'>
            {/* </ReactTimeAgo> */}
            {comment.createdAt}
          </p>
          ))}
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
