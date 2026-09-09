import { ScrollView, StyleSheet, Text, View } from 'react-native'
import React from 'react'
import CommunityFeed from './communityfeed'
import CreatePost from './createpost';

const home = () => {
  return (
    <View style={styles.container}> 
    <ScrollView
    contentContainerStyle={styles.scrollContent}
    showsVerticalScrollIndicator={false}
    >
      <CommunityFeed />

      <CreatePost />
    </ScrollView>
    </View>
  );
}




export default home

const styles = StyleSheet.create({

  container: {
    flex: 1,
  },

  scrollContent: {
    paddingBottom: 24,

  },


});