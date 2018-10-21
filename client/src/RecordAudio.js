import React, { Component } from 'react';

import './RecordAudio.css'

export default class RecordAudio extends Component {

  constructor() {
    super();

    this.state = {
      recording: false
    };
  }

  render() {
    return (
      <div className='RecordAudio'>
        <div onClick={this.onToggleRecordAudio}><i className='fa fa-microphone' /></div>
      </div>
    );
  }

  onToggleRecordAudio = () => {
    if (!this.state.recording) {
      navigator.mediaDevices.getUserMedia({ video: false, audio: true }).then(stream => {
        this.stream = stream;

        // Record stream into chunks
        this.recorder = new MediaRecorder(this.stream, { mimeType: 'audio/webm;codec=wav;' });

        this.recorder.ondataavailable = (event) => {
          if (event.data.size) {
            console.log(event.data);
          }
        }

        this.recorder.start(1000);
      });
    } else {
      this.stream.getTracks().forEach(track => {
        track.stop();
      });
      this.stream = null;
      this.recorder.stop();
      this.recorder = null;
    }

    this.setState({
      recording: !this.state.recording
    });
  }
}