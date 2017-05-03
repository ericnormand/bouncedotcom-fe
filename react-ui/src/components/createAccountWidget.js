import React, {Component} from 'react'
import PropTypes from 'prop-types';
import {createAccountPost, saveToken} from '../api'

export default class CreateAccountWidget extends Component {
  static propTypes = {
    onCreate: PropTypes.func,
  }

  constructor(props) {
    super(props);
    this.state = {
      email: '',
      password: '',
      password_confirmation: '',
    };
  }

  onCreate(err, resp) {
    if (err) {
      console.log(err);
    } else {
      console.log(resp);
      this.setState({token: resp.auth_token});
    }
  }

  handleCreateAccount(email, password, password_confirmation, callback = () => null) {
    createAccountPost(email, password, password_confirmation,
      (err, resp) => {
        if (err) {
          callback(err);
        } else {
          saveToken(resp.data.auth_token);
          callback(null, resp.data);
        }
      });
  }

  createAccount() {
    this.handleCreateAccount(this.state.email,
                             this.state.password,
                             this.state.password_confirmation,
                             this.onCreate);
  }

  render() {
    return (
      <div>
      Create account
      <form
        onSubmit={(e) => {
          e.preventDefault();
          this.createAccount();
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
        <input
          type="password"
          onChange={(e) => this.setState({password_confirmation: e.target.value})}
          value={this.state.password_confirmation}
        />
        <input type="submit" value="Submit" />
      </form>
      </div>
    );
  }
}
