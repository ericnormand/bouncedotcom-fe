import React, {Component} from 'react'
import PropTypes from 'prop-types';
import {Image, Video, Transformation, CloudinaryContext} from 'cloudinary-react';
import {getUserInfo} from '../api.js';



export default class Profile extends Component {

  constructor(props) {
    super(props);
    this.state = {};

  }

  componentWillMount() {
    getUserInfo(this.props.token, (err, resp) => {
      if(err) {
        console.log(err);
      } else {
        console.log(resp);
        this.setState(resp);
      }
    });
  }

  showUploadWidget(cb = () => {}) {
    window.cloudinary.openUploadWidget({
      cloud_name: this.props.cloudname,
      upload_preset: 'default',
      tags: ['bounce'],
    },
                                       cb);
  }

  upload() {
    this.showUploadWidget((error, result) => {
      if (error) {
        console.log(error);
        return;
      }
    });
  }

  noPic() {
    return (
      <span style={{fontSize:75}}
      onClick={this.upload.bind(this)}
      >+</span>
    );
  }

  profilePic() {
    if(!this.state.payload) {
      return this.noPic();
    }
    const cloudid = this.props.payload.profile_pic_id;
    const mediatype = this.props.payload.profile_pic_type;
    const width = this.props.payload.profile_pic_width;
    if(!cloudid) {
      return (
        this.noPic()
      );
    } else if(mediatype === 'image') {
      return (
        <Image
          cloudName={this.props.cloudname}
          publicId={cloudid}
          width={this.props.pic_width}
        />
      );
    } else {
      return (
        <Video
          cloudName={this.props.cloudname}
          publicId={cloudid}
          width={width}
          poster={`http://res.cloudinary.com/bouncedotcom-com/video/upload/${cloudid}.jpg`}
          autoPlay
        />
      );
    }
  }

  render() {
    return (
      <div>
      <div>
        <div style={{width: '30%'}}>
         {this.profilePic()}
        </div>
        <div style={{width: '70%'}}>

        </div>
      </div>
      </div>
    );
  }
}
