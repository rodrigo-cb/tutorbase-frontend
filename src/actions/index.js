/* eslint-disable */
import axios from 'axios';

// API URLs - localhost for testing and heroku for the real deal
const ROOT_URL = 'https://tutor-base.herokuapp.com/api'; // Heroku back-end/db
// const ROOT_URL = 'http://localhost:9090/api'; // Local back-end/db

export const ActionTypes = {
  FETCH_POST: 'FETCH_POST',
  // All tutors/tutees
  FETCH_POSTS: 'FETCH_POSTS',
  AUTH_USER: 'AUTH_USER',
  DEAUTH_USER: 'DEAUTH_USER',
  AUTH_ERROR: 'AUTH_ERROR',
  FETCH_MY_TUTOR_POSTS: 'FETCH_MY_TUTOR_POSTS',
  FETCH_MY_TUTEE_POSTS: 'FETCH_MY_TUTEE_POSTS',
  FETCH_REQUESTS: 'FETCH_REQUESTS',
  FETCH_MY_REQUESTS: 'FETCH_MY_REQUESTS',
  FETCH_MATCHES: 'FETCH_MATCHES',
  FETCH_MY_REQUESTED_POST_IDS: 'FETCH_MY_REQUESTED_POST_IDS',
};

const getMyRequestsHelper = (dispatch) => {
  axios
    .get(`${ROOT_URL}/myrequests`, {
      headers: { authorization: localStorage.getItem('token') },
    })
    .then((response) => {
      dispatch({
        type: ActionTypes.FETCH_MY_REQUESTS,
        payload: response.data,
      });
    })
    .catch((error) => {
      console.log(error);
    });
};

export function fetchPosts(type, options) {
  let opt = '';
  if (options) {
    opt = options;
  }
  return (dispatch) => {
    axios
      .get(`${ROOT_URL}/${type}${opt}`)
      .then((response) => {
        dispatch({ type: ActionTypes.FETCH_POSTS, payload: response.data });
      })
      .catch((error) => {
        dispatch({ type: ActionTypes.ERROR_SET, error });
      });
  };
}

export function fetchMyPosts(type) {
  let action = ActionTypes.FETCH_MY_TUTOR_POSTS;
  if (type === 'tutees') {
    action = ActionTypes.FETCH_MY_TUTEE_POSTS;
  }
  return (dispatch) => {
    axios
      .get(`${ROOT_URL}/${type}ByUser`, {
        headers: { authorization: localStorage.getItem('token') },
      })
      .then((response) => {
        dispatch({ type: action, payload: response.data });
      })
      .catch((error) => {
        console.log(error);
        dispatch({ type: ActionTypes.ERROR_SET, error });
      });
  };
}
/**
 *
 * @param {*} id id of the post - generated by the api
 */

export function fetchPost(id) {
  return (dispatch) => {
    axios
      .get(`${ROOT_URL}/posts/${id}`)
      .then((response) => {
        dispatch({ type: ActionTypes.FETCH_POST, payload: response.data });
      })
      .catch((error) => {
        dispatch({ type: ActionTypes.ERROR_SET, error });
      });
  };
}

export function addPost(post, type) {
  return (dispatch) => {
    axios
      .post(`${ROOT_URL}/${type}`, post, {
        headers: { authorization: localStorage.getItem('token') },
      })
      .then((response) => {
        dispatch(fetchPosts(type, 'Grouped'));
      })
      .catch((error) => {
        console.log('error');
        dispatch({ type: ActionTypes.ERROR_SET, error });
      });
  };
}

export function deletePost(postID) {
  return (dispatch) => {
    axios
      .delete(`${ROOT_URL}/posts/${postID}`, {
        headers: { authorization: localStorage.getItem('token') },
      })
      .then((response) => {
        dispatch(fetchMyPosts('tutors'));
        dispatch(fetchMyPosts('tutees'));
      })
      .catch((error) => {
        console.log(error);
        // dispatch({ type: ActionTypes.ERROR_SET, error });
      });
  };
}

// function to send request to either tutor or tutee
export function sendTRequest(request, type) {
  return (dispatch) => {
    axios
      .post(`${ROOT_URL}/${type}Req`, request, {
        headers: { authorization: localStorage.getItem('token') },
      })
      .then((response) => {
        dispatch(getMyRequests());
      })
      .catch((error) => {
        console.log(error);
      });
  };
}

// fetch requests made to the user
export function receiveTRequest() {
  return (dispatch) => {
    axios
      .get(`${ROOT_URL}/requests`, {
        headers: { authorization: localStorage.getItem('token') },
      })
      .then((response) => {
        dispatch({ type: ActionTypes.FETCH_REQUESTS, payload: response.data });
      })
      .catch((error) => {
        console.log(error);
        // dispatch({ type: ActionTypes.ERROR_SET, error });
      });
  };
}

// fetch requests made by the user
export function getMyRequests() {
  return (dispatch) => {
    getMyRequestsHelper(dispatch);
  };
}

// will accept the requests
export function acceptRequest(accept) {
  return (dispatch) => {
    axios
      .post(`${ROOT_URL}/accept`, accept, {
        headers: { authorization: localStorage.getItem('token') },
      })
      .then((response) => {
        dispatch(receiveTRequest());
      })
      .catch((error) => {
        console.log(error);
      });
  };
}

// will decline the request by deleting it
export function declineRequest(id) {
  return (dispatch) => {
    axios
      .delete(`${ROOT_URL}/decline/${id}`, {
        headers: { authorization: localStorage.getItem('token') },
      })
      .then((response) => {
        dispatch(receiveTRequest());
      })
      .catch((error) => {
        console.log(error);
      });
  };
}

export function getMatches() {
  return (dispatch) => {
    axios
      .get(`${ROOT_URL}/matches`, {
        headers: { authorization: localStorage.getItem('token') },
      })
      .then((response) => {
        dispatch({ type: ActionTypes.FETCH_MATCHES, payload: response.data });
      })
      .catch((error) => {
        console.log(error);
      });
  };
}

export function clearMatches() {
  const clearArray = [];
  const update = {
    clearArray,
  };
  return (dispatch) => {
    axios
      .post(`${ROOT_URL}/clear`, update, {
        headers: { authorization: localStorage.getItem('token') },
      })
      .then((response) => {
        dispatch(getMatches());
      })
      .catch((error) => {
        console.log(error);
      });
  };
}

// deletes token from localstorage
// and deauths
export function signoutUser() {
  return (dispatch) => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    dispatch({ type: ActionTypes.DEAUTH_USER });
  };
}

export function signinUser({ email, password }, history) {
  return (dispatch) => {
    axios
      .post(`${ROOT_URL}/signin`, { email, password })
      .then((response) => {
        getMyRequestsHelper(dispatch);
        dispatch({ type: ActionTypes.AUTH_USER, payload: response.data.user });
        localStorage.setItem('token', response.data.token);
        localStorage.setItem('user', JSON.stringify(response.data.user));
        history.push('/');
      })
      .catch((error) => {
        dispatch({ type: ActionTypes.AUTH_ERROR, error });
      });
  };
}

// eslint-disable-next-line object-curly-newline
export function signupUser({ name, year, email, password }, history) {
  return (dispatch) => {
    // eslint-disable-next-line object-curly-newline
    axios
      .post(`${ROOT_URL}/signup`, {
        name,
        year,
        email,
        password,
      })
      .then((response) => {
        dispatch({ type: ActionTypes.AUTH_USER, payload: response.data.user });
        localStorage.setItem('token', response.data.token);
        localStorage.setItem('user', JSON.stringify(response.data.user));
        history.push('/');
      })
      .catch((error) => {
        console.log(error);
        history.push('/');
      });
  };
}
