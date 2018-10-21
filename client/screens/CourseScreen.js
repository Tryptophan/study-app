import React from 'react';
import { ScrollView, StyleSheet, TouchableOpacity, Text} from 'react-native';

export default class CourseScreen extends React.Component {
  static navigationOptions = {
    title: 'Courses',
    headerStyle: {
      backgroundColor: 'black',
    },
    headerTintColor: '#fff',
    headerTitleStyle: {
      fontWeight: 'bold',
    },
  };
  state = {
    typing: '',
    messages: []
  };

  render() {
    const { navigate } = this.props.navigation;
    return (
      <ScrollView style={styles.container}>
        <TouchableOpacity
          onPress={() =>
            navigate('Chat', { courseName: 'Algorithms', courseID: '4348' })}>
          <Text style={styles.button}>Advanced Algorithms</Text>
        </TouchableOpacity>
      </ScrollView>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingTop: 15,
    backgroundColor: 'pink',
    padding: 20
  },
  button: {
    color: 'white',
    backgroundColor: 'black',
    textAlign: 'center',
    padding: 20,
    width: '100%',
    flexDirection: 'column',
    justifyContent: 'center',
    borderRadius: 20
  }

});
