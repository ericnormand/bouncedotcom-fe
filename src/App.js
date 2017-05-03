import React, {Component} from 'react';
import PropTypes from 'prop-types';
import logo from './logo.svg';
import './App.css';

import LoginWidget from './components/loginWidget'
import CreateAccountWidget from './components/createAccountWidget'
import BounceList from './components/bounceList'
import UploadWidget from './components/uploadWidget'

import {createAccountPost, saveToken} from './api'

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
      currentPage: 1,
      bounceCount: 0,
    };


    setInterval(() => {
      console.log('updating');
      this.setState({updateTime: new Date().getTime()});
    },
                60000);
    window.onresize = () => {
      this.setState({width: Math.min(window.innerWidth, 800)});
    }
  }

  componentWillMount() {

    ensureToken((err, token) => {
      if(err) {
        console.log(err);
      } else {
        this.setState({token});
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
          onUpload={() => this.setState({updateTime: new Date().getTime()})}/>
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

  prevPage() {
    if (this.state.currentPage === 1) {
      return "Prev"
    } else {
      return <button onClick={() => {this.setState({currentPage: this.state.currentPage - 1})}}>Prev</button>
    }
  }

  nextPage() {
    if (this.state.bounceCount < 15) {
      return "Next"
    } else {
      return <button onClick={() => {this.setState({currentPage: this.state.currentPage + 1})}}>Next</button>
    }
  }

  updateBounceCount(bounceCount) {
    this.setState({bounceCount})
  }

  render() {
    return (
      <div className="App">
        <div>
          Bounce DOT COM .com
        </div>
        {this.prevPage()}
        <BounceList
          width={this.state.width}
          updateTime={this.state.updateTime}
          cloudname={cloudname}
          page={this.state.currentPage}
          onFetch={(c) => {this.updateBounceCount(c)}}
        />
        {this.nextPage()}
        <div style={{position:'fixed', bottom: 0, right: 0}}>
          {this.uploadWidget()}
        </div>
      </div>
    );
  }
}

export default App;
