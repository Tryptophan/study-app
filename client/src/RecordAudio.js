import React, { Component } from 'react';
import axios from 'axios';
import socket from './socket';

import './RecordAudio.css';

export default class RecordAudio extends Component {

  constructor() {
    super();

    this.state = {
      recording: false
    };

    this.recordedData = [];
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
            this.recordedData.push(event.data);
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

      let b = new Blob(this.recordedData);
      let formData = new FormData();
      formData.set("media", b);
      // Post blob to audio endpoint
      let token = process.env.REACT_APP_REV_SPEECH_API
      axios({
        method: 'post',
        url: 'http://localhost:3001/audio',
        data: formData,
        config: { headers: {'Authorization': 'Bearer ' + token, 'Content-Type': 'multipart/form-data'}}
        })
        .then(function (response) {
            //handle success
            console.log(response.data);
        })
        .catch(function (err) {
            //handle error
            console.log(err);
        });
      this.recordedData = [];
    }

    this.setState({
      recording: !this.state.recording
    });
  }
}