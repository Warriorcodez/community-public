import { AppBar, Drawer, MenuItem } from 'material-ui';
import axios from 'axios';
import React, { Component } from 'react';

class Header extends Component {
  constructor(props) {
    super(props);

    this.state = {
      open: false
    };

    this.toggleDrawer = this.toggleDrawer.bind(this);
    this.handleClose = this.handleClose.bind(this);
    this.handleLogout = this.handleLogout.bind(this);
    this.handleEditProfile = this.handleEditProfile.bind(this);
  }

  toggleDrawer() {
    this.setState({
      open: !this.state.open
    });
  }

  handleClose(event) {
    this.setState({
      open: false
    });
  }

  handleEditProfile() {
    axios.get('/profile');
  }

  handleLogout() {
    axios.get('/logout');
  }

  render () {
    return (
      <div>
        <AppBar
          title="Community"
          style={styles.theme}
          titleStyle={styles.title}
          onLeftIconButtonTouchTap={this.toggleDrawer}
        />
          <Drawer
            open={this.state.open}
            onRequestChange={open => this.setState({ open })}
          >
            <AppBar
              title="Community"
              showMenuIconButton={false}
              style={styles.theme}
              titleStyle={styles.title}
            />
            <MenuItem
              onTouchTap={this.handleClose}
              onTouchTap={this.handleEditProfile}
              primaryText="User Profile"
              href={'/profile'}
            />
            <MenuItem
              onTouchTap={this.handleClose}
              onTouchTap={this.handleLogout}
              primaryText="Logout"
              href={'/login'}
            />
          </Drawer>
      </div>
    );
  }
}

const styles = {
  title: {
    fontFamily: 'Vibur',
    fontSize: '34px'
  },
  theme: {
    backgroundColor: '#5E35B1',
  }
};

export default Header;
