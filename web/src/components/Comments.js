import axios from 'axios';
import React, { Component } from 'react';
import { RaisedButton, TextField } from 'material-ui';
import moment from 'moment';

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
          this.handleSubmit();
        })}>
          <TextField
            type="text"
            name="name"
            onChange={this.handleChange}
            style={styles.inputField}
            value={this.state.text}
            onKeyPress={(event) => {
              if (event.key === 'Enter') {
                this.handleSubmit();
              }
            }}
          />
          {this.state.text === '' ?
          <RaisedButton
            label="Comment"
            labelColor={'#5E35B1'}
            onTouchTap={this.handleSubmit}
            style={styles.button}
            disabled='true'
          />
          :
          <RaisedButton
            label="Comment"
            labelColor={'#5E35B1'}
            onTouchTap={this.handleSubmit}
            style={styles.button}
          />
          }
        </form>
        <div>
          {this.state.comments.map(comment => (
          <div style={styles.container}>
            <div style={styles.colLeft}>
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
    borderColor: '#eee #ddd #bbb',
    borderRadius: '5',
    borderStyle: 'solid',
    borderWidth: '1',
    boxShadow: '0 1 3 rgba(0, 0, 0, 0.15)',
    margin: '5',
    padding: '20',
    width: '673'
  },
  button: {
    border: '1px solid #5E35B1',
    borderRadius: '10px',
    marginLeft: '18px',
    float: 'right',
    marginRight: '10',
    marginTop: '10'
  },
  inputField: {
    borderColor: '#5E35B1',
    width: '555',
    marginTop: '10',
    marginLeft: '7',
    marginBottom: '10'
  },
  colLeft: {
    float: 'left',
  },
  comment: {
    display: 'inline-block',
    width: '560',
    marginTop: '10',
    wordWrap: 'normal',
  },
  time: {
    float: 'right',
    display: 'inline-block',
  },
  refresh: {
    float: 'right',
    position: 'absolute',
    bottom: '75',
  }
};

export default Comments;
