import React, {Component} from 'react'
import PropTypes from 'prop-types';
import {Image, Video, Transformation, CloudinaryContext} from 'cloudinary-react';
import {getUserInfo, userIdFromToken, patchUser} from '../api.js';

import BounceList from './bounceList';

import FacebookProvider, { Like } from 'react-facebook';

export default class Profile extends Component {

  constructor(props) {
    super(props);
    this.state = {};

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
      } else {
        if(result && result.length>0) {
          console.log(result);
          patchUser(this.props.userid, {
            payload: Object.assign({}, this.props.payload, {
              profile_pic_id: result[0].public_id,
              profile_pic_type: result[0].resource_type
            })
          }, this.props.onUpload);
        }

      }
    });
  }

  itsMe() {
    return this.props.token &&
           this.props.userid === ''+ userIdFromToken(this.props.token);
  }

  noPic() {
    if(this.itsMe()) {
      return (
        <button style={{fontSize:75}}
          onClick={this.upload.bind(this)}
        >Take Profile Pic/Vid</button>
      );
    }
    return <div>NO PROFILE PIC/VID</div>;
  }

  media(cloudid, mediatype) {
    if(mediatype === 'image') {
      return (
        <Image
          cloudName={this.props.cloudname}
          publicId={cloudid}
          width={this.props.pic_width}
        />
      );
    } else {
      return (
        <img src={`http://res.cloudinary.com/bouncedotcom-com/video/upload/${cloudid}.gif`} />
      );
    }
  }

  replaceButton() {
    if(this.itsMe()) {
      return (
        <button onClick={this.upload.bind(this)}>Change Pic/Vid</button>
      );
    }
    return null;
  }

  profilePic() {
    const payload = this.props.payload;
    if(!payload) {
      return this.noPic();
    }
    const cloudid   = payload.profile_pic_id;
    const mediatype = payload.profile_pic_type;
    if(!cloudid) {
      return this.noPic();
    }
    return (
      <div>
        {this.media(cloudid, mediatype)}
        <div>
          {this.replaceButton()}
          <FacebookProvider appId="454994558177557">
            <Like href={`http://www.bouncedotcom.com/twerker/${this.props.userid}`} colorScheme="dark"
              showFaces
              share
              size="large"
            />
          </FacebookProvider>
        </div>
      </div>
    );
  }

  render() {
    return (
      <div>
        {this.profilePic()}
        <BounceList
          width={this.props.width}
          cloudname={this.props.cloudname}
          bounces={this.props.bounces.slice().reverse()}
          paging={false}
        />
      </div>
    );
  }
}
