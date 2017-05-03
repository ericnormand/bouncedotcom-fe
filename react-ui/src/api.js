import axios from 'axios';

// const backend = 'http://localhost:3001';
const backend = 'https://bouncedotcom-backend.herokuapp.com';

export function saveToken(token) {
  localStorage.setItem('token', token);
}

export function userIdFromToken(token) {
  const parts = token.split('.');
  const user_info = JSON.parse(atob(parts[1]));
  return user_info.user_id;
}

export function getUserInfo(token, callback = () => null) {
  const userid = userIdFromToken(token);

  axios({
    method: 'get',
    url: `${backend}/users/${userid}`
  }).then((resp) => callback(null, resp.data))
    .catch((err) => callback(err));
}

export function createAccountPost(email, password, password_confirmation, callback = () => null) {
  const payload = {email, password, password_confirmation}

  axios({
    method: 'post',
    url: `${backend}/users`,
    responseType: 'json',
    data: {
      user: {email, password, password_confirmation, payload},
    },
  }).then((response) => callback(null, response))
    .catch((error) => callback(error));
}

export function loginPost(email, password, callback = () => null) {
  axios({
    method: 'post',
    url: `${backend}/users/login`,
    responseType: 'json',
    data: {email, password},
  }).then((response) => callback(null, response))
    .catch((error) => callback(error));
}

export function getBounces(page, callback = () => null) {
  axios({
    method: 'get',
    url: `${backend}/bounces?page=${page}`,
  }).then((resp) => {
    callback(null, resp);
  }).catch((err) => {
    callback(err)
  });
}

export function createBounce(token, user_id, cloudinary_id, title, media_type, callback = ()=>null) {
  const payload = {token, user_id, cloudinary_id, title, media_type}

  axios({
    url: `${backend}/bounces`,
    method: 'post',
    responseType: 'json',
    headers: {
      Authorization: token
    },
    data: {
      user_id, cloudinary_id, title, media_type, payload,
    }
  }).then((response) => callback(null, response))
    .catch((error) => callback(error));
}
