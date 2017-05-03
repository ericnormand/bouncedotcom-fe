import React, {Component} from 'react'
import PropTypes from 'prop-types';
import ReactList from 'react-list';

import Bounce from './bounce'
import {getBounces} from '../api'

export default class BounceList extends Component {
  static propTypes = {
    width: PropTypes.number,
    cloudname: PropTypes.string,
    page: PropTypes.number,
    onFetch: PropTypes.func,
  }

  constructor(props) {
    super(props);
    this.state = {
      bounces: [],
      loading: true,
    };

  }

  componentWillMount() {
    this.fetchBounces(this.props.page)
  }

  componentWillReceiveProps(nextProps) {
    if (nextProps.page !== this.props.page) {
      this.fetchBounces(nextProps.page)
    }
  }

  fetchBounces(page) {
    this.setState({loading: true});
    getBounces(page, (err, resp) => {
      if (err) {
        console.log('error', err);
      } else {
        this.setState({
          ...resp.data,
          loading: false,
        });
        this.props.onFetch(this.state.bounces.length)
      }
    });
  }

  renderItem(index, _key) {
    const bounce = this.state.bounces[index];

    return (
      <div key={bounce.cloudinary_id}>
        <Bounce
          width={this.props.width}
          bounceid={bounce.cloudinary_id}
          media_type={bounce.media_type} updated_at={bounce.updated_at}
          cloudname={this.props.cloudname}
        />
      </div>
    );
  }

  loading() {
    if (this.state.loading) {
      return <div>Loading</div>;
    }
    return null
  }

  render() {
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
