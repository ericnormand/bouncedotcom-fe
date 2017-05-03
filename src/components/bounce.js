import React, {Component} from 'react'
import PropTypes from 'prop-types';
import {Image, Video, Transformation, CloudinaryContext} from 'cloudinary-react';

export default class Bounce extends Component {
  static propTypes = {
    media_type: PropTypes.string,
    width: PropTypes.number,
    bounceid: PropTypes.string,
    updated_at: PropTypes.string,
    cloudname: PropTypes.string,
  }

  constructor(props) {
    super(props);
    this.state = {};
  }

  render() {
    console.log(this.props);
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
