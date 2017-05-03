import React, {Component} from 'react';
import PropTypes from 'prop-types';
import logo from './logo.svg';
import './App.css';

import LoginWidget from './components/loginWidget'
import CreateAccountWidget from './components/createAccountWidget'
import BounceList from './components/bounceList'
import UploadWidget from './components/uploadWidget'
import Bounce from './components/bounce';

import {createAccountPost, saveToken, getBounces, getBounce, getUser, userIdFromToken} from './api'
import Profile from './components/profile'

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

function chooseRoute(uri) {
  const tr = uri.match('/twerker/([^?/]+)');
  if(tr) {
    return ['twerker', tr[1]];
  }
  const br = uri.match('/bounce/([^?/]+)');
  if(br) {
    return ['bounce', br[1]];
  }
  return ['home'];
}

class App extends Component {
  constructor(props) {

    const [p, param] = chooseRoute(window.location.pathname);

    super(props);
    this.state = {
      token: getToken(),
      updateTime: new Date().getTime(),
      width: Math.min(window.innerWidth, 800),
      loading: false,
      bounces: [],
      currentPage: 1,
      updateBounces: false,
      pageType: p,
      pageParam: param
    };
  }

  componentWillMount() {
    window.onresize = () => {
      this.setState({width: Math.min(window.innerWidth, 800)});
    }

    ensureToken((err, token) => {
      if(err) {
        console.log(err);
        this.setState({error: err});
      } else {
        this.setState({token});
      }
    });


    this.fetchBounces(this.state);
    this.fetchBounce();
    this.fetchTwerker();
  }

  componentWillUpdate(nextProps, nextState) {
    if ((this.state.bounces[0] && nextState.bounces[0] && this.state.bounces[0].id !== nextState.bounces[0].id) ||
        this.state.currentPage !== nextState.currentPage ||
        nextState.updateBounces) {

          this.setState({updateBounces: false});
          this.fetchBounces(nextState);
    }
  }

  fetchTwerker() {
    if(this.state.pageType === 'twerker') {
      this.setState({loading:true});
      getUser(this.state.pageParam, (err, resp) => {
        if(err) {
          this.setState({loading:false});
          console.log('error', err);
        } else {
          this.setState({
            loading: false,
            twerker: resp
          });
        }
      });
    }
  }

  fetchBounce() {
    if(this.state.pageType === 'bounce') {
      console.log('fetching a bounce');
      this.setState({loading:true});
      getBounce(this.state.pageParam, (err, resp) => {
        if(err) {
          this.setState({loading:false});
          console.log('error', err);
        } else {
          console.log(resp);
          this.setState({
            loading: false,
            bounce: resp.data
          });
        }
      });
    }
  }

  fetchBounces(state) {
    if(state.pageType === 'home') {
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
          onUpload={() => this.setState({
              updateTime: new Date().getTime(),
              updateBounces: true,
              currentPage: 1,
            })}
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

  home() {
    return (
      <BounceList
        width={this.state.width}
        updateTime={this.state.updateTime}
        cloudname={cloudname}
        currentPage={this.state.currentPage}
        bounces={this.state.bounces}
        loading={this.state.loading}
        modifyPage={(page) => {this.modifyPage(page)}}
      />
    );
  }

  profile(tid) {
    const twerker = this.state.twerker;
    console.log(twerker);
    if(twerker) {
      return (
        <Profile
          token={this.state.token}
          cloudname={cloudname}
          userid={tid}
          payload={twerker.payload}
          width={this.state.width}
          bounces={twerker.bounces}
          onUpload={this.fetchTwerker.bind(this)}
        />
      );
    }
    return null;
  }

  bouncePage(bid) {
    const bounce = this.state.bounce;
    console.log(bounce);
    if(bounce) {
      return (
        <Bounce
          width={this.state.width}
          bounceid={bounce.id}
          cloudinary={bounce.cloudinary_id}
          media_type={bounce.media_type}
          updated_at={bounce.updated_at}
          cloudname={cloudname}
          userid={bounce.user_id}
        />
      );
    } else {
      return <div>Loading</div>;
    }
  }

  choose() {
    if(this.state.pageType === 'home') {
      return this.home();
    }

    if(this.state.pageType === 'twerker') {
      return this.profile(this.state.pageParam);
    }

    if(this.state.pageType === 'bounce') {
      return this.bouncePage(this.state.pageParam);
    }
  }

  profileIcon() {
    const userid = this.state.token && userIdFromToken(this.state.token);
    if(userid) {
      return (
        <a className="user-icon" href={`/twerker/${userid}`}></a>
      );
    }
    return null;

  }

  render() {
    return (
      <div className="App">
        <header>
          <h1>BounceDOTCOM.com</h1>
          {this.profileIcon()}
        </header>
        {this.choose()}
        <div style={{position:'fixed', bottom: 0, right: 0}}>
          {this.uploadWidget()}
        </div>
      </div>
    );
  }
}

export default App;
