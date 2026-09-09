import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { useRouter } from 'expo-router';

export default function CreatePost() {
    const router = useRouter();

    const handleCreatePost = () => {
        // Navigate to the post creation screen
        router.push('/createpost');
    };

    return (
        <TouchableOpacity style= {styles.container} onPress={handleCreatePost} activeOpacity={0.7}>
             <View style={styles.avatar}>
        {/* backgroundColor: '' // TODO: avatar placeholder color */}
      </View>
 
      {/* Fake input-looking prompt */}
      <View style={styles.promptBox}>
        <Text style={styles.promptText}>Create A Post</Text>
      </View>
 
      {/* Optional icon/button for attaching media, could be its own component later */}
      <View style={styles.iconPlaceholder} />
    </TouchableOpacity>
    )
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 12,
    marginHorizontal: 12,
    marginTop: 12,
    borderRadius: 12,
    // backgroundColor: '', // TODO: card background color
  },
  avatar: {
    width: 40,
    height: 40,
    borderRadius: 20,
    marginRight: 10,
    // backgroundColor: '', // TODO: avatar placeholder color
  },
  promptBox: {
    flex: 1,
    paddingVertical: 10,
    paddingHorizontal: 14,
    borderRadius: 20,
    // backgroundColor: '', // TODO: input background color
  },
  promptText: {
    // color: '', // TODO: placeholder text color
  },
  iconPlaceholder: {
    width: 28,
    height: 28,
    marginLeft: 10,
    // backgroundColor: '', // TODO: icon placeholder
  },
});