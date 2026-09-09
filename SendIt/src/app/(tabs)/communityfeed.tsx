import React from 'react';
import { View, Text, StyleSheet } from 'react-native';


const FEED_POSTS = [
    { id: '1', username: "Alex", content: 'just flashed a v7', likes: '12', comments: '1' },

];

export default function CommunityFeed() { 
    return (
        <View style={styles.section}>
            <Text style={styles.headerText}>Community Feed</Text>

            {FEED_POSTS.map((post) => (
                <View key={post.id} style={styles.postCard}>
                    <View style={styles.postHeader}>
                        <View style={styles.avatar} />
                        <Text style={styles.username}>{post.username}</Text>
                    </View>
                    <Text style={styles.content}>{post.content}</Text>
                    <View style={styles.imagePlaceholder} />
                    <View style={styles.footerRow}>
                        <Text style={styles.footerText}>{post.likes} Likes</Text>
                        <Text style={styles.footerText}>{post.comments} Comments</Text>
                    </View>
                </View>
            ))}
        </View>
    );
}

const styles = StyleSheet.create({
  section: {
    marginTop: 20,
    paddingHorizontal: 12,
  },
  headerText: {
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 10,
    // color: '', // TODO: header text color
  },
  postCard: {
    borderRadius: 12,
    padding: 12,
    marginBottom: 14,
    // backgroundColor: '', // TODO: card background color
  },
  postHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  avatar: {
    width: 36,
    height: 36,
    borderRadius: 18,
    marginRight: 8,
    // backgroundColor: '', // TODO: avatar placeholder color
  },
  username: {
    fontWeight: '600',
    // color: '', // TODO: username text color
  },
  content: {
    marginBottom: 10,
    // color: '', // TODO: post content text color
  },
  imagePlaceholder: {
    width: '100%',
    height: 160,
    borderRadius: 8,
    marginBottom: 10,
    // backgroundColor: '', // TODO: image placeholder color
  },
  footerRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  footerText: {
    fontSize: 12,
    // color: '', // TODO: footer text color
  },
});