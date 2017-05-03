import React, {Component} from 'react'
import PropTypes from 'prop-types';
import {Image, Video, Transformation, CloudinaryContext} from 'cloudinary-react';

export default class Bounce extends Component {
  static propTypes = {
    media_type: PropTypes.string,
    width: PropTypes.number,
    cloudname: PropTypes.string,
    bounceid: PropTypes.string,
  }

  render() {
    if (this.props.media_type === 'image') {
      return (
        <Image
          cloudName={this.props.cloudname}
          publicId={this.props.bounceid}
          width={this.props.width}
        />
      )
    } else {
      return (
        <Video
          cloudName={this.props.cloudname}
          publicId={this.props.bounceid}
          width={this.props.width}
          poster={`http://res.cloudinary.com/bouncedotcom-com/video/upload/${this.props.bounceid}.jpg`}
          controls
        />
      );
    }
  }
}
