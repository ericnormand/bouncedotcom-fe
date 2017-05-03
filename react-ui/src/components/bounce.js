import React, {Component} from 'react'
import PropTypes from 'prop-types';
import {Image, Video, Transformation, CloudinaryContext} from 'cloudinary-react';

import FacebookProvider, { Like } from 'react-facebook';

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

  comp() {
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

  render() {
    return (
      <div style={{maxWidth: 800, margin: 'auto'}}>
        {this.comp()}
        <div>
          <a href={`/bounce/${this.props.bounceid}`}>LINK</a>
          <FacebookProvider appId="454994558177557">
            <Like href={`http://www.bouncedotcom.com/bounce/${this.props.bounceid}`} colorScheme="dark"
              showFaces
              share
              size="large"
            />
          </FacebookProvider>
        </div>
      </div>
    );
  }
}
