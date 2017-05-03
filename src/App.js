import React, {Component} from 'react';
import PropTypes from 'prop-types';
import logo from './logo.svg';
import './App.css';

import LoginWidget from './components/loginWidget'
import CreateAccountWidget from './components/createAccountWidget'
import BounceList from './components/bounceList'
import UploadWidget from './components/uploadWidget'

const cloudname = 'bouncedotcom-com';

function getToken() {
  return localStorage.getItem('token');
}

function deleteToken() {
  localStorage.removeItem('token');
}

class App extends Component {
  constructor(props) {
    super(props);
    this.state = {
      token: getToken(),
      updateTime: new Date().getTime(),
      width: Math.min(window.innerWidth, 800)
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

  get loginWidget() {
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

  get uploadWidget() {
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

  render() {
    return (
      <div className="App">
      {(()=>{
        if(!this.state.token) {
          return (
            <CreateAccountWidget
              onCreate={(e,r)=>{
                  if(e) {
                    console.log(e);
                  } else {
                    console.log(r);
                    this.setState({token: r.auth_token});
                  }
                }}
            />
          );
        }
      })()}

      {this.loginWidget}

      {(()=> {
        if(this.state.token) {
          return (
            <button onClick={() => {
                this.setState({token:null});
                deleteToken();
              }}>Logout</button>
          );
        }
      })()}


      {this.uploadWidget}

      <BounceList
        width={this.state.width}
        updateTime={this.state.updateTime}
        cloudname={cloudname}
      />
      </div>
    );
  }
}

export default App;
