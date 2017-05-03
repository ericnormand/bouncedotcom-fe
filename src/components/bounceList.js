import React, {Component} from 'react'
import PropTypes from 'prop-types';
import ReactList from 'react-list';

import Bounce from './bounce'

export default class BounceList extends Component {
  static propTypes = {
    width: PropTypes.number,
    cloudname: PropTypes.string,
    bounces: PropTypes.array,
    modifyPage: PropTypes.func,
    currentPage: PropTypes.number,
    loading: PropTypes.bool,
  }

  prevPage() {
    if (this.props.currentPage === 1) {
      return "Prev"
    } else {
      return <button onClick={() => { this.props.modifyPage(this.props.currentPage - 1) }}>Prev</button>
    }
  }

  nextPage() {
    if (this.props.bounces.length < 15) {
      return "Next"
    } else {
      return <button onClick={() => { this.props.modifyPage(this.props.currentPage + 1) }}>Next</button>
    }
  }

  renderItem(index, _key) {
    const bounce = this.props.bounces[index];
    return (
      <div key={bounce.cloudinary_id}>
        <Bounce
          width={this.props.width}
          bounceid={bounce.cloudinary_id}
          media_type={bounce.media_type}
          updated_at={bounce.updated_at}
          cloudname={this.props.cloudname}
        />
      </div>
    );
  }

  loading() {
    if (this.props.loading) {
      return <div>Loading</div>;
    }
    return null
  }

  render() {
    return (
      <div>
        {this.loading()}
        {this.prevPage()}
        <ReactList
          itemRenderer={this.renderItem.bind(this)}
          length={this.props.bounces.length}
          type="variable"
          threshold={0}
        />
        {this.nextPage()}
      </div>
    );
  }
}
