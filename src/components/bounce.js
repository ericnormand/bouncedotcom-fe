import React, {Component} from 'react'
import PropTypes from 'prop-types';
import {Image, Video, Transformation, CloudinaryContext} from 'cloudinary-react';

export default class Bounce extends Component {
  static propTypes = {
    media_type: PropTypes.string,
    width: PropTypes.number,
    cloudname: PropTypes.string,
    bounceid: PropTypes.string,
    updated_at: PropTypes.string,
    cloudname: PropTypes.string,
  }

  constructor(props) {
    super(props);
    this.state = {};
  }

  componentWillMount() {
    // less than a minute old? let's rerender soon
    if (new Date() - new Date(this.props.updated_at) < 60000) {
      setTimeout(() => {
        this.setState({reload: true});
      }, 10000);
    } else {
      this.setState({reload: true});
    }
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
    } else if (this.state.reload) {
      return (
        <Video
          cloudName={this.props.cloudname}
          publicId={this.props.bounceid}
          width={this.props.width}
          poster={`http://res.cloudinary.com/bouncedotcom-com/video/upload/${this.props.bounceid}.jpg`}
          controls
        />
      );
    } else {
      return (
        <Image
          cloudName={this.props.cloudname}
          publicId={this.props.bounceid}
          width={this.props.width}
          url={`http://res.cloudinary.com/bouncedotcom-com/video/upload/${this.props.bounceid}.jpg`}
        />
      );
    }
  }
}
