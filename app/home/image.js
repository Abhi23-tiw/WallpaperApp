import { Alert, Button, Image, Platform, Pressable, StyleSheet, Text, View } from 'react-native';
import React, { useState } from 'react';
import { BlurView } from 'expo-blur';
import { hp, wp } from '../../helpers/common';
import Animated, { FadeInDown, useReducedMotion } from 'react-native-reanimated';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { theme } from '../../constants/theme';
import { ActivityIndicator } from 'react-native';
import { Entypo, Octicons } from '@expo/vector-icons';
import * as FileSystem from 'expo-file-system';
import * as Sharing from 'expo-sharing';
import Toast from 'react-native-toast-message';

const ImageScreen = () => {
  const router = useRouter();
  const item = useLocalSearchParams();

  const [status, setStatus] = useState('');
  let uri = item?.webformatURL;
  const fileName = item?.previewURL?.split('/').pop();
  const imageUrl = uri;
  const filePath = `${FileSystem.documentDirectory}${fileName}`;

  const getSize = () => {
    const aspectRatio = item?.getimageWidth / item?.imageHeight;
    const maxWidth = Platform.OS === 'web' ? wp(50) : wp(92);
    let calculateHeight = maxWidth / aspectRatio;
    let calculateWidth = maxWidth;

    if (aspectRatio < 1) {
      calculateWidth = calculateHeight * aspectRatio;
    }
    return {
      width: 300,
      height: 300,
    };
  };

  const onLoad = () => {
    setStatus('');
  };

  const handleDownloadImage = async () => {
    setStatus('downloading');
    let uri = await downloadFile();
    if (uri) showToast('Image Downloaded');
  };

  const handleShareImage = async () => {
    setStatus('sharing');
    let uri = await downloadFile();
    if (uri) {
      await Sharing.shareAsync(uri);
    }
  };

  const downloadFile = async () => {
    try {
      const downloadUri = await FileSystem.downloadAsync(imageUrl, filePath);
      const downloadedFileUri = downloadUri.uri;

      setStatus('');
      console.log('File downloaded', downloadedFileUri);
      return downloadedFileUri;
    } catch (error) {
      console.log(error);
      Alert.alert('Image', error.message);
      setStatus('');
      return null;
    }
  };

  const showToast = (message) => {
    Toast.show({
      type: 'success',
      text1: message,
      position: 'bottom',
    });
  };

  const toastConfig = {
    success: ({ text1, props, ...rest }) => {
      return (
        <View style={styles.toastConfig}>
          <Text style={styles.toastText}>{text1}</Text>
        </View>
      );
    },
  };

  return (
    <BlurView style={styles.container} tint="dark" intensity={60}>
      <View style={getSize()}>
        <View style={styles.loading}>
          {status === 'loading' && <ActivityIndicator size="large" color="white" />}
        </View>
        <Image transition={100} style={[styles.image, getSize()]} source={{ uri }} onLoad={onLoad} />
      </View>
      <View style={styles.buttons}>
        <Animated.View entering={FadeInDown.springify()}>
          <Pressable style={styles.button} onPress={() => router.back()}>
            <Octicons name="x" size={24} color="white" />
          </Pressable>
        </Animated.View>
        <Animated.View entering={FadeInDown.springify().delay(100)}>
          {status === 'downloading' ? (
            <View style={styles.button}>
              <ActivityIndicator size="small" color="white" />
            </View>
          ) : (
            <Pressable style={styles.button} onPress={handleDownloadImage}>
              <Octicons name="download" size={24} color="white" />
            </Pressable>
          )}
        </Animated.View>
        <Animated.View entering={FadeInDown.springify().delay(200)}>
          {status === 'downloading' ? (
            <View style={styles.button}>
              <ActivityIndicator size="small" color="white" />
            </View>
          ) : (
            <Pressable style={styles.button} onPress={handleShareImage}>
              <Entypo name="share" size={24} color="white" />
            </Pressable>
          )}
        </Animated.View>
      </View>
      <Toast config={toastConfig} visibilityTime={2500} />
    </BlurView>
  );
};

export default ImageScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: wp(4),
    backgroundColor: 'rgba(141, 54, 54, 0.5)',
  },
  image: {
    borderRadius: theme.radius.lg,
    borderWidth: 2,
    backgroundColor: 'rgba(255,255,255,0.1)',
    borderColor: 'rgba(255,255,255,0.1)',
  },
  loading: {
    position: 'absolute',
    width: '100%',
    height: '100%',
    justifyContent: 'center',
    alignItems: 'center',
  },
  buttons: {
    marginTop: 40,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 50,
  },
  button: {
    height: hp(6),
    width: hp(6),
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(255,255,255,0.2)',
    borderRadius: theme.radius.lg,
    borderCurve: 'continuous',
  },
  toastConfig: {
    padding: 15,
    paddingHorizontal: 30,
    borderRadius: theme.radius.xl,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(255,255,255,0.15)',
  },
  toastText: {
    fontSize: hp(1.8),
    fontWeight: theme.fontWeights.bold,
    color: theme.colors.white,
  },
});
