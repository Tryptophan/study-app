import React from 'react';
import {
  StyleSheet,
  Text,
  View,
  TextInput,
  TouchableOpacity,
  KeyboardAvoidingView,
  FlatList,
  Keyboard
} from 'react-native';

// import AudioRecord from 'react-native-audio-record';

import Header from '../Header';

import socket from '../socket';

export default class ChatScreen extends React.Component {
  static navigationOptions = {
    title: 'Chats',
    headerStyle: {
      backgroundColor: 'black',
    },
    headerTintColor: '#fff',
    headerTitleStyle: {
      fontWeight: 'bold',
    },
  };
  state = {
    input: '',
    typing: false,
    chats: []
  };

  constructor(props) {
    super(props);

    let { state } = this.props.navigation;
    socket.emit('join', state.params.courseId);
    socket.on('chat', (chat) => {
      chat.key = chat.timestamp + '';
      this.setState({
        chats: this.state.chats.concat(chat)
      });
    });
  }

  sendMessage = () => {
    // read message from component state
    let message = this.state.input;

    socket.emit('chat', { message: message });

    this.setState({
      input: ''
    });
  };

  renderItem({ item }) {
    return (
      <View style={styles.row}>
        <View style={styles.rowText}>
          <Text style={styles.message}>{item.message}</Text>
        </View>
      </View>
    );
  }

  render() {
    let { state } = this.props.navigation;
    console.log('typing', this.state.typing);
    if (this.input) {
      console.log('selected', this.input.selectionState);
    }
    return (
      <View style={styles.container}>
        <Header title={state.params.courseName} />
        <FlatList
          data={this.state.chats}
          renderItem={this.renderItem}
        />
        <KeyboardAvoidingView behavior="padding">
          <View style={styles.footer}>
            <TextInput
              ref={(el) => { this.input = el }}
              onFocus={() => { this.setState({ typing: true }); }}
              onBlur={() => { this.setState({ typing: false }); }}
              value={this.state.input}
              style={styles.input}
              underlineColorAndroid="transparent"
              placeholder="Send Message..."
              onChangeText={text => this.setState({ input: text })}
            />
            <TouchableOpacity onPress={this.sendMessage}>
              <Text style={styles.send}>Send</Text>
            </TouchableOpacity>
          </View>
          {this.state.typing ? <View style={{ height: 80 }} /> : null}
        </KeyboardAvoidingView>
      </View>
    );
  }

  componentDidMount() {
    Keyboard.addListener('keyboardDidHide', this.keyboardDidHide);
  }

  componentWillUnmount() {
    Keyboard.removeListener('keyboardDidHide', this.keyboardDidHide);
  }

  keyboardDidHide = () => {
    console.log('back press');
    if (this.input.isFocused) {
      console.log('blur');
      this.input.blur();
    }
  };
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff'
  },
  row: {
    flexDirection: 'row',
    padding: 20,
    borderBottomWidth: 1,
    borderBottomColor: '#eee'
  },
  avatar: {
    borderRadius: 20,
    width: 40,
    height: 40,
    marginRight: 10
  },
  rowText: {
    flex: 1
  },
  message: {
    fontSize: 18
  },
  sender: {
    fontWeight: 'bold',
    paddingRight: 10
  },
  footer: {
    flexDirection: 'row',
    height: 50
  },
  input: {
    paddingHorizontal: 20,
    fontSize: 18,
    flex: 1,
  },
  send: {
    alignSelf: 'center',
    color: 'lightseagreen',
    fontSize: 16,
    fontWeight: 'bold',
    padding: 20
  }
});
