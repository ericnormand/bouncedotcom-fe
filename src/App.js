import React, {Component} from 'react';
import PropTypes from 'prop-types';
import logo from './logo.svg';
import './App.css';

import LoginWidget from './components/loginWidget'
import CreateAccountWidget from './components/createAccountWidget'
import BounceList from './components/bounceList'
import UploadWidget from './components/uploadWidget'

import {createAccountPost, saveToken, getBounces} from './api'

const cloudname = 'bouncedotcom-com';

function getToken() {
  return localStorage.getItem('token');
}

function deleteToken() {
  localStorage.removeItem('token');
}

function ensureToken(callback = () => null) {
  const existingToken = getToken();
  if(!existingToken) {
    // fake email + password
    createAccountPost("", "", "", (err, resp) => {
      if (err) {
        callback(err);
      } else {
        saveToken(resp.data.auth_token);
        callback(null, resp.data.auth_token);
      }
    });
  } else {
    callback(null, existingToken);
  }
}

class App extends Component {
  constructor(props) {
    super(props);
    this.state = {
      token: getToken(),
      updateTime: new Date().getTime(),
      width: Math.min(window.innerWidth, 800),
      loading: false,
      bounces: [],
      currentPage: 1,
    };
  }

  componentWillMount() {
    window.onresize = () => {
      this.setState({width: Math.min(window.innerWidth, 800)});
    }

    ensureToken((err, token) => {
      if(err) {
        console.log(err);
      } else {
        this.setState({token});
      }
    });

    this.fetchBounces(this.state)
  }

  componentWillUpdate(nextProps, nextState) {
    if ((this.state.bounces[0] && nextState.bounces[0] && this.state.bounces[0].id !== nextState.bounces[0].id) ||
      this.state.currentPage !== nextState.currentPage) {
      this.fetchBounces(nextState)
    }
  }

  fetchBounces(state) {
    this.setState({loading: true});
    getBounces(state.currentPage, (err, resp) => {
      if (err) {
        this.setState({loading:false});
        console.log('error', err);
      } else {
        this.setState({
          ...resp.data,
          loading: false,
        });
      }
    });
  }

  loginWidget() {
    if (!this.state.token) {
      return (
        <LoginWidget
          onLogin={(err, resp) => {
              if (err) {
                console.log(err);
              } else {
                this.setState({token: resp.auth_token});
              }
            }}
        />
      );
    }
    return null
  }

  uploadWidget() {
    if (this.state.token) {
      return (
        <UploadWidget
          cloudname={cloudname}
          userToken={this.state.token}
          onUpload={() => this.setState({updateTime: new Date().getTime()})}
        />
      );
    } else {
      return (
        <div>Please create an account or log in to upload.</div>
      )
    }
  }

  logout() {
    if (this.state.token) {
      return (
        <button
          onClick={() => {
              this.setState({token: null});
              deleteToken();
            }}
        >Logout</button>
      );
    }
  }

  accountWidget() {
    if (!this.state.token) {
      return (
        <CreateAccountWidget />
      );
    }
  }

  modifyPage(currentPage) {
    this.setState({currentPage})
  }

  render() {
    return (
      <div className="App">
        <div>
          Bounce DOT COM .com
        </div>
        <BounceList
          width={this.state.width}
          updateTime={this.state.updateTime}
          cloudname={cloudname}
          currentPage={this.state.currentPage}
          bounces={this.state.bounces}
          loading={this.state.loading}
          modifyPage={(page) => {this.modifyPage(page)}}
        />
        <div style={{position:'fixed', bottom: 0, right: 0}}>
          {this.uploadWidget()}
        </div>
      </div>
    );
  }
}

export default App;
