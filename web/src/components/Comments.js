import axios from 'axios';
import moment from 'moment';
import React, { Component } from 'react';
import { RaisedButton, TextField } from 'material-ui';

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
    this.getLatestComments = this.getLatestComments.bind(this);
  }

  componentDidMount() {
    this.getLatestComments();
  }

  getLatestComments() {
    axios.get('/api/retrieveComments?event_id=' + this.props.eventDetails.currentEvent.id)
    .then(comments => {
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

      this.setState({comments: commentsArray});
    });
  }

  handleChange(event) {
    this.setState({
      text: event.target.value,
    });
  }

  handleSubmit() {
    axios.post('/api/comments', {
      text: this.state.text,
      event_id: this.props.eventDetails.currentEvent.id,
      profile_id: null
    })
    .then(() => {
      this.clearText();
    })
    .then(() => {
      this.getLatestComments();
    });
  }

  clearText() {
    this.setState({
      text: '',
    });
  }

  render() {
    return (
      <div>
        <form onSubmit={(event => {
          event.preventDefault();
        })}>
          <TextField
            type="text"
            name="comment"
            onChange={this.handleChange}
            style={styles.inputField}
            value={this.state.text}
            onKeyPress={(event) => {
              if (event.key === 'Enter' && this.state.text !== '') {
                this.handleSubmit();
              }
            }}
            underlineStyle={{color: '#31575B'}}
            underlineFocusStyle={styles.underline}
          />
          {this.state.text === '' ?
          <RaisedButton
            label="Comment"
            labelColor='white'
            onTouchTap={this.handleSubmit}
            style={styles.button}
            disabled='true'
            backgroundColor='#31575B'
          />
          :
          <RaisedButton
            label="Comment"
            labelColor='white'
            onTouchTap={this.handleSubmit}
            style={styles.button}
            backgroundColor='#31575B'
          />
          }
        </form>
        <div>
          {this.state.comments.map(comment => (
          <div style={styles.container}>
            <div style={styles.username}>
              <strong>{comment.username}</strong>
            </div>
            <div style={styles.time}>
              {moment(comment.createdAt).fromNow()}
            </div>
            <div style={styles.comment}>
              {comment.comment}
            </div>
        </div>
         ))}
        </div>
      </div>
    );
  }
}

const styles = {
  container: {
    display: 'inline-block',
    lineHeight: '16px',
    borderBottom: '1px dotted #31575B',
    borderWidth: '1',
    margin: '5',
    padding: '20',
    width: '673'
  },
  button: {
    border: '1px solid #31575B',
    marginLeft: '18px',
    float: 'right',
    marginRight: '10',
    marginTop: '10'
  },
  inputField: {
    width: '555',
    marginTop: '10',
    marginLeft: '7',
    marginBottom: '10'
  },
  username: {
    color: '#C22B33'
  },
  comment: {
    display: 'inline-block',
    width: '560',
    marginTop: '10',
    wordWrap: 'normal',
    color: '#31575B'
  },
  time: {
    float: 'right',
    display: 'inline-block',
    color: '#31575B'
  },
  underline: {
    borderColor: '#C22B33'
  },
};

export default Comments;
