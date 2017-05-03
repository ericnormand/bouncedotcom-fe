import React, {Component} from 'react'
import PropTypes from 'prop-types';
import {Image, Video, Transformation, CloudinaryContext} from 'cloudinary-react';
import FacebookProvider, { Like } from 'react-facebook';
import ReactDOM from 'react-dom';

export default class Bounce extends Component {
  static propTypes = {
    media_type: PropTypes.string,
    width: PropTypes.number,
    bounceid: PropTypes.number,
    updated_at: PropTypes.string,
    cloudname: PropTypes.string,
    cloudinary: PropTypes.string,
  }

  constructor(props) {
    super(props);
    this.state = {};
  }

  chooseMedia() {
    if (this.props.media_type === 'image') {
      return (
        <Image
          className="cloudinary-img"
          cloudName={this.props.cloudname}
          publicId={this.props.cloudinary}
          width={this.props.width}
        />
      )
    } else {
      return (
        <div style={{position:'relative'}}
        onClick={(e)=> {
          if(this.video) {
            if(this.state.playing)
              this.video.pause();
            else
              this.video.play()
          }
        }}
        >
        <Video
        className="cloudinary-vid"
        cloudName={this.props.cloudname}
        publicId={this.props.cloudinary}
        width={this.props.width}
        poster={`http://res.cloudinary.com/bouncedotcom-com/video/upload/${this.props.cloudinary}.jpg`}
          ref={(v)=>this.video = ReactDOM.findDOMNode(v)}
          onPlay={()=>this.setState({playing:true})}
          onEnded={()=>this.setState({playing:false})}
          onPause={()=>this.setState({playing:false})}
        />
        <img style={{position:'absolute', top:0, bottom:0, right:0, left:0, margin:'auto', height:102.5, width:107,
          display: this.state.playing ? 'none':'inline-block'}}
          src="/assets/butt icon.png"/>
        </div>
      );
    }
  }

  render() {
    return (
      <div className="media-container">
        {this.chooseMedia()}
        <div className="link-container">
          <a className="user-link" href={`/twerker/${this.props.userid}`}>TWERKER</a>
          {' '}
          <a className="page-link" href={`/bounce/${this.props.bounceid}`}>LINK</a>

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
