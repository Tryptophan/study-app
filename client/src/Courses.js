import React, { Component } from 'react';
import { Link } from 'react-router-dom';

import './Courses.css';

class Courses extends Component {

  constructor() {
    super();

    this.state = {
      courses: [
        {
          id: '21301923123',
          name: 'Algorithms'
        }
      ]
    };
  }

  render() {
    return (
      <div className='Courses'>
      </div>
    );
  }
}

export default Courses;
