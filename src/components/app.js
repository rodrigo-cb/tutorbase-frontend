/* eslint-disable */
import React from 'react';
import { connect } from 'react-redux';
import { BrowserRouter as Router, Route, Switch } from 'react-router-dom';
// import axios from 'axios';
import '../style.scss';
import Landing from './landing';
import SideBar from './sideBar';
import Profile from './Profile';
import SignUp from './sign-up';
import SignIn from './sign-in';
import MyPosts from './myPosts';
import Matches from './matches';
import MyRequests from './MyRequests';
import IncomingRequests from './IncomingRequests';
import Tutors from './tutors';
import Tutees from './tutees';
import Fallback from './fallback';

const withSidebar = (Component) => {
  const result = () => (
    <SideBar>
      <Component />
    </SideBar>
  );
  return result;
};

class App extends React.Component {
  render() {
    return (
      <Router>
        <div>
          <Switch>
            <Route exact path="/" component={Landing} />
            <Route exact path="/about" render={() => <Landing pageNum={1} />} />
            <Route path="/tutors" component={Tutors} />
            <Route exact path="/tutees" component={Tutees} />
            <Route exact path="/posts" component={withSidebar(MyPosts)} />
            <Route exact path="/requests" component={withSidebar(MyRequests)} />
            <Route
              exact
              path="/incomingrequests"
              component={withSidebar(IncomingRequests)}
            />
            <Route exact path="/matches" component={withSidebar(Matches)} />
            <Route exact path="/profile" component={Profile} />
            <Route path="/signup" component={SignUp} />
            <Route path="/signin" component={SignIn} />
            <Route component={Fallback} />
          </Switch>
        </div>
      </Router>
    );
  }
}

function mapStateToProps(reduxState) {
  return {
    auth: reduxState.auth.authenticated,
  };
}

export default connect(mapStateToProps, null)(App);
