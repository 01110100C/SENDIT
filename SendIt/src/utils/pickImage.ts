import * as ImagePicker from 'expo-image-picker';
import { Alert } from 'react-native';

/** Opens the photo library and returns the chosen image's URI, or null if cancelled. */
export async function pickImage(aspect: [number, number]): Promise<string | null> {
  const permission = await ImagePicker.requestMediaLibraryPermissionsAsync();
  if (!permission.granted) {
    Alert.alert('Permission needed', 'Allow photo access in Settings to upload images.');
    return null;
  }

  const result = await ImagePicker.launchImageLibraryAsync({
    mediaTypes: ['images'],
    allowsEditing: true,
    aspect,
    quality: 0.8,
  });

  return result.canceled ? null : result.assets[0].uri;
}
