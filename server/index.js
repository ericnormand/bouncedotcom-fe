const express = require('express');
const path = require('path');
const axios = require('axios');

const app = express();
const PORT = process.env.PORT || 5000;

const mustacheExpress = require('mustache-express');

// Register '.html' extension with The Mustache Express
app.engine('html', mustacheExpress());

app.set('view engine', 'mustache');
app.set('views', path.resolve(__dirname, '../react-ui/build'));

// Priority serve any static files.
app.use(express.static(path.resolve(__dirname, '../react-ui/build')));

const backend = 'http://www.bouncedotcom.com';

app.get('/twerker/:tid', function(request, response) {
  axios({
    method: 'get',
    url: `${backend}/users/${request.params.tid}`,
  }).then((resp) => {
    const pid = resp.data.payload && resp.data.payload.profile_pic_id;
    const pty = resp.data.payload && resp.data.payload.profile_pic_type;

    var imageurl = "http://www.bouncedotcom.com/default.jpg";

    if(pid && pty === 'image') {
      imageurl = `http://res.cloudinary.com/bouncedotcom-com/image/upload/${pid}.jpg`;
    }
    if(pid && pty === 'video') {
      imageurl = `http://res.cloudinary.com/bouncedotcom-com/video/upload/${pid}.jpg`;
    }
    response.render('index.html', {
      image: imageurl,
      description: "Twerkin' for the money!",
      title: "One fabulous twerker",
      type: "video.movie",
      url: `http://www.bouncedotcom.com/twerker/${request.params.tid}`
    });
  }).catch(err => {
    response.render('index.html', {
      image: "http://www.bouncedotcom.com/default.jpg", // TODO
      description: "Twerkin' for the money!",
      title: "One fabulous twerker",
      type: "video.movie",
      url: `http://www.bouncedotcom.com/twerker/${request.params.tid}`
    });
  });
});

app.get('/bounce/:bid', function(request, response) {
  axios({
    method: 'get',
    url: `${backend}/users/${request.params.tid}`,
  }).then((resp) => {
    const pid = resp.data.cloudinary_id;
    const pty = resp.data.media_type;

    var imageurl = "http://www.bouncedotcom.com/default.jpg";

    if(pid && pty === 'image') {
      imageurl = `http://res.cloudinary.com/bouncedotcom-com/image/upload/${pid}.jpg`;
    }
    if(pid && pty === 'video') {
      imageurl = `http://res.cloudinary.com/bouncedotcom-com/video/upload/${pid}.jpg`;
    }
    response.render('index.html', {
      image: imageurl,
      description: "Twerkin' for the money!",
      title: "One fabulous twerker",
      type: "video.movie",
      url: `http://www.bouncedotcom.com/bounce/${request.params.bid}`
    });
  }).catch(err => {
    response.render('index.html', {
      image: "http://www.bouncedotcom.com/default.jpg", // TODO
      description: "Twerkin' for the money!",
      title: "One fabulous twerker",
      type: "video.movie",
      url: `http://www.bouncedotcom.com/bounce/${request.params.bid}`
    });
  });
});
// All remaining requests return the React app, so it can handle routing.
app.get('*', function(request, response) {
  response.render('index.html', {
    image: "",
    description: "Twerkin' for the money!",
    title: "Bounce DOT COM .com",
    type: "video.movie",
    url: "http://www.bouncedotcom.com/"
  });
});

app.listen(PORT, function () {
  console.log(`Listening on port ${PORT}`);
});
