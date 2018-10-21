import React, { Component } from 'react';
import { Scrollbars } from 'react-custom-scrollbars';

import socket from './socket';

import './Chat.css';

class Chat extends Component {

  constructor(props) {
    super(props);

    socket.on('chat', this.onChat);

    this.state = {
      chats: []
    };
  }

  render() {

    let chats = this.state.chats.map((chat) =>
      <div key={chat.timestamp}>{chat.message}</div>
    );

    return (
      <div className='Chat'>
        <div className='ChatTitle'>Title</div>
        {/* Render all previous chats and incoming */}
        <Scrollbars ref={el => { this.scroll = el }}><div className='Messages'>{chats}</div></Scrollbars>
        <div className='ChatControls'>
          <div className='field has-addons'>
            <div className='control Input'>
              <input className='input' ref={el => { this.input = el }} onKeyPress={this.onKeyPress} type='text' placeholder='Type here!' />
            </div>
            <div className='control'>
              <button onClick={this.send} className='button'><i className='fa fa-send' /></button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  componentDidMount() {
    // Join the chat room
    let { courseId } = this.props.match.params;
    socket.emit('join', courseId);
  }

  componentWillUnmount() {
    // Leave chat room
    let { courseId } = this.props.match.params;
    socket.emit('leave', courseId);
  }

  componentDidUpdate() {
    this.scroll.scrollToBottom();
  }

  onKeyPress = (event) => {
    if (event.key === 'Enter') {
      this.send();
    }
  }

  send = () => {
    let message = this.input.value;

    socket.emit('chat', {
      message: message
    });

    this.input.value = null;
  }

  onChat = (chat) => {
    this.setState({
      chats: this.state.chats.concat(chat)
    });
  }
}

export default Chat;
