import React, { Component } from 'react';
import { Switch, Route } from 'react-router-dom';
import { withRouter } from 'react-router-dom';

import 'font-awesome/css/font-awesome.min.css';
import 'bulma/css/bulma.min.css';
import './App.css';

import Courses from './Courses';
import Chat from './Chat';

import axios from 'axios';

class App extends Component {

  render() {
    return (
      <div className='App'>
        <Switch>
          <Route exact path='/' component={Courses.js} />
          <Route path='/chat/:courseId' component={Chat} />
        </Switch>
      </div>
    );
  }
}

export default withRouter(App);
