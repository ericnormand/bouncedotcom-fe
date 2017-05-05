import React, {Component} from 'react'
import PropTypes from 'prop-types';
import {createBounce, userIdFromToken} from '../api'

export default class UploadWidget extends Component {
  static propTypes = {
    userToken: PropTypes.string,
    onUpload: PropTypes.func,
    cloudname: PropTypes.string,
  }

  showUploadWidget(cb = () => {}) {
    window.cloudinary.openUploadWidget({
      cloud_name: this.props.cloudname,
      upload_preset: 'default',
      tags: ['bounce'],
      theme: 'purple',
      max_file_size: 95000000
    },
    cb);
  }

  upload() {
    this.showUploadWidget((error, result) => {
      if (error) {
        console.log(error);
        alert(error.message);
        return;
      }
      result.forEach((thing) => {
        createBounce(
          this.props.userToken,
          userIdFromToken(this.props.userToken),
          thing.public_id,
          'My Bounce',
          thing.resource_type,
          (err, upResult) => {
            if (this.props.onUpload) {
              this.props.onUpload(err, upResult);
            }
          }
        );
      });
    });
  }

  render() {
    return (
      <div >
        <button className="upload-btn btn-default-styles" onClick={this.upload.bind(this)}>Upload a video</button>
      </div>
    );
  }

}
