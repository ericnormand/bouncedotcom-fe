import React, { Component } from 'react';
import logo from './logo.svg';
import './App.css';

import { Image, Video, Transformation, CloudinaryContext } from 'cloudinary-react';

import axios from 'axios';
import ReactList from 'react-list';

const cloudname = 'bouncedotcom-com';
const backend = 'https://bouncedotcom-backend.herokuapp.com'; //'//192.168.0.138:3001';

function saveToken(token) {
  localStorage.setItem('token', token);
}

function getToken() {
  return localStorage.getItem('token');
}

function deleteToken() {
  localStorage.removeItem('token');
}

function createAccountPost(email,
                           password,
                           password_confirmation,
                           callback = () => null) {
                             axios({
                               method: 'post',
                               url: `${backend}/users`,
                               responseType: 'json',
                               data:   {
                                 user: { email, password, password_confirmation }
                               }
                             }).then((response) => callback(null, response))
                               .catch((error) => callback(error));
}

function createAccount(email, password, password_confirmation, callback = () => null) {
  createAccountPost(email, password, password_confirmation,
                    (err, resp) => {
                      if(err) {
                        callback(err);
                      } else {
                        saveToken(resp.data.auth_token);
                        callback(null, resp.data);
                      }
                    });
}

class CreateAccountWidget extends Component {
  constructor(props) {
    super(props);
    this.state = {
      email: '',
      password: '',
      password_confirmation: ''
    };
  }

  createAccount() {
    createAccount(this.state.email,
                  this.state.password,
                  this.state.password_confirmation,
                  this.props.onCreate);
  }

  render() {
    return (
      <div>
      Create account
      <form onSubmit={(e) => {
        e.preventDefault();
        console.log('hello');
        this.createAccount();
      }}>
      <input type="email"
      onChange={(e)=>this.setState({email:e.target.value})} value={this.state.email} />
      <input type="password"
      onChange={(e)=>this.setState({password:e.target.value})}
      value={this.state.password} />
      <input type="password"
      onChange={(e)=>this.setState({password_confirmation:e.target.value})}
      value={this.state.password_confirmation} />
      <input type="submit" value="Submit" />
      </form>
      </div>
    );
  }
}

function loginPost(email, password, callback = ()=>null) {
  axios({
    method: 'post',
    url: `${backend}/users/login`,
    responseType: 'json',
    data: { email, password }
  }).then((response) => callback(null, response))
    .catch((error) => callback(error));
}

function login(email, password, callback = ()=>null) {
  loginPost(email, password, (err, resp) => {
    if(err) {
      callback(err);
    } else {
      saveToken(resp.data.auth_token);
      callback(null, resp.data);
    }
  });
}

function getBounces(callback = ()=>null) {
  axios({
    method: 'get',
    url: `${backend}/bounces`
  }).then((resp) => {
    console.log(resp);
    callback(null, resp);
  }).catch((err) => {
    callback(err)
  });
}

class Bounce extends Component {
  constructor(props) {
    super(props);
    this.state = {};
    
    // less than a minute old? let's rerender soon
    console.log(props);
    console.log(this.props);
    console.log(new Date() - new Date(this.props.updated_at));
    if(new Date() - new Date(this.props.updated_at) < 60000) {
      setTimeout(()=>{
        this.setState({reload: true});
      }, 10000);
    } else {
      this.state.reload = true;
    }
  }
  render() {
    if(this.props.media_type === 'image') {
      return (
        <Image cloudName={cloudname}
        publicId={this.props.bounceid}
        width={this.props.width}
        />
      );
    } else {
      if(this.state.reload) {
        return (
          <Video cloudName={cloudname}
            publicId={this.props.bounceid}
            width={this.props.width}
            poster={`http://res.cloudinary.com/bouncedotcom-com/video/upload/${this.props.bounceid}.jpg`}
            controls />
        );
      } else {
        return (
          <Image cloudName={cloudname}
            publicId={this.props.bounceid}
            width={this.props.width}
            url={`http://res.cloudinary.com/bouncedotcom-com/video/upload/${this.props.bounceid}.jpg`}
          />
        );

      }
      
    }
  }
}

class BounceList extends Component {
  constructor(props) {
    super(props);
    this.state = {
      bounces: [],
      loading: true
    };

  }

  componentWillMount() {
    this.setState({loading:true});
    getBounces((err, resp) => {
      if(err) {
        console.log('error');
        console.log(err);
      } else {
        this.setState({bounces: resp.data,
                       loading: false});
      }
    });

  }

  componentWillReceiveProps() {
    this.setState({loading:true});
    getBounces((err, resp) => {
      if(err) {
        console.log('error');
        console.log(err);
      } else {
        this.setState({bounces: resp.data,
                       loading: false});
      }
    });
  }

  renderItem(index, key) {
    const bounce = this.state.bounces[index];
    return (
      <div key={bounce.cloudinary_id}>
        <Bounce width={this.props.width} bounceid={bounce.cloudinary_id}
          media_type={bounce.media_type} updated_at={bounce.updated_at}
        />
      </div>
    );
  }

  loading() {
    if(this.state.loading) {
      return <div>Loading</div>;
    }
  }

  render() {
    console.log(this.state.bounces.length);
    return (
      <div>
      {this.loading()}
      <ReactList
      itemRenderer={this.renderItem.bind(this)}
      length={this.state.bounces.length}
      type="variable"
      threshold={0}

      />
      </div>
    );
  }
}

class LoginWidget extends Component {
  constructor(props) {
    super(props);
    this.state = {
      email: '',
      password: ''
    };
  }

  login() {
    login(this.state.email,
          this.state.password,
          this.props.onLogin);
  }

  render() {
    return (
      <div>
        Login
        <form onSubmit={(e) => {
            e.preventDefault();
            this.login();
          }}>
          <input type="email"
            onChange={(e)=>this.setState({email:e.target.value})} value={this.state.email} />
          <input type="password"
            onChange={(e)=>this.setState({password:e.target.value})}
            value={this.state.password} />
          <input type="submit" value="Submit" />
        </form>
      </div>
    );
  }
}

function createBounce(token, user_id, cloudinary_id, title, media_type, callback = ()=>null) {
  axios({
    url: `${backend}/bounces`,
    method: 'post',
    responseType: 'json',
    headers: {
      Authorization: token
    },
    data: {
      user_id, cloudinary_id, title, media_type
    }
  }).then((response) => callback(null, response))
    .catch((error) => callback(error));
}

function showUploadWidget(cb = function(){}) {
  window.cloudinary.openUploadWidget({
    cloud_name: cloudname,
    upload_preset: 'default',
    tags:['bounce']
  },
                                     cb);
}

function userIdFromToken(token) {
  const parts = token.split('.');
  const user_info = JSON.parse(atob(parts[1]));
  return user_info.user_id;
}


class UploadWidget extends Component {

  upload() {
    showUploadWidget((error, result) => {
      if(error) {
        console.log(error);
        return;
      }
      result.forEach((thing) => {
        console.log(thing);
        createBounce(this.props.userToken,
                     userIdFromToken(this.props.userToken),
                     thing.public_id,
                     'My Bounce',
                     thing.resource_type,
                     (err, result) => {
                       if(this.props.onUpload)
                         this.props.onUpload(err, result);
                     });
      });
    });
  }

  render() {
    return (
      <div>
        <button onClick={this.upload.bind(this)}>Upload</button>
      </div>
    );
  }

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

      {(()=>{
        if(!this.state.token) {
          return (
            <LoginWidget
              onLogin={(e,r)=>{
                  if(e) {
                    console.log(e);
                  } else {
                    this.setState({token: r.auth_token});
                  }
                }}
            />
          );
        }
      })()}
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


      {(()=>{
        if(this.state.token) {
          return (
            <UploadWidget userToken={this.state.token}
              onUpload={()=>this.setState({updateTime:new Date().getTime()})}/>
          );
        } else {
          return (
            <div>Please create an account or log in to upload.</div>
          )
        }
      })()}

      <BounceList width={this.state.width} updateTime={this.state.updateTime}/>
      </div>
    );
  }
}

export default App;
