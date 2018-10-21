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
        },
        {
          id: '20123',
          name: 'OPL'
        },
        {
          id: '2130123',
          name: 'OS'
        }
      ]
    };
  }

  render() {
    console.log(this.state.courses[0].id);
    let courses = this.state.courses.map(course => (
      <Link to={'/chat/' + course.id} key={course.id}>
        <div>{course.name}</div>
      </Link>
    ));
    return (
      <div className='Courses'>
          {courses}
      </div>
    );
  }
}

export default Courses;
