import React, {Component} from 'react';
import PropTypes from 'prop-types';
import {loginPost, saveToken} from '../api'

export default class LoginWidget extends Component {
  static propTypes = {
    backend: PropTypes.string,
    onLogin: PropTypes.func,
  }

  constructor(props) {
    super(props);
    this.state = {
      email: '',
      password: '',
    }
  }

  handleLogin(email, password, callback = () => null) {
    loginPost(email, password, (err, resp) => {
      if (err) {
        callback(err);
      } else {
        saveToken(resp.data.auth_token);
        callback(null, resp.data);
      }
    });
  }

  login() {
    this.handleLogin(this.state.email,
          this.state.password,
          this.props.onLogin);
  }

  render() {
    return (
      <div>
        Login
        <form
          onSubmit={(e) => {
            e.preventDefault();
            this.login();
          }}
        >
          <input
            type="email"
            onChange={(e) => this.setState({email: e.target.value})} value={this.state.email}
          />
          <input
            type="password"
            onChange={(e) => this.setState({password: e.target.value})}
            value={this.state.password}
          />
          <input type="submit" value="Submit" />
        </form>
      </div>
    )
  }
}
