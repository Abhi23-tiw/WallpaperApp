import { TouchableOpacity, StyleSheet, Text, View } from 'react-native';
import React from 'react';
import { StatusBar } from 'expo-status-bar';
import { LinearGradient } from 'expo-linear-gradient';
import { useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import AntDesign from '@expo/vector-icons/AntDesign';
const WelcomeScreen = () => {
  const router = useRouter();

  const handleExplore = () => {
    router.push('/home'); 
  };

  return (
    <>
      <LinearGradient
        colors={['#4c669f', '#3b5998', '#192f6a']}
        style={styles.gradient}
      >
        <StatusBar style="light" />
        <View style={styles.container}>
          <Text style={styles.heading}>WallSphere</Text>
          <Text style={styles.subHeading}>PixelCanvas</Text>
          <Text style={styles.tagLine}>Transform your screen, elevate your vibe.</Text>
          <TouchableOpacity style={styles.exploreButton} onPress={handleExplore}>
            <Text style={styles.buttonText}>Explore<AntDesign name="arrowright" size={24} color="black" /></Text>
          </TouchableOpacity>
        </View>
      </LinearGradient>
    </>
  );
};

export default WelcomeScreen;

const styles = StyleSheet.create({
  gradient: {
    flex: 1,
  },
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 20,
  },
  heading: {
    fontSize: 40,
    fontWeight: '700',
    color: '#fff',
    marginBottom: 10,
  },
  subHeading: {
    fontSize: 28,
    fontWeight: '500',
    color: '#dcdcdc',
    marginBottom: 20,
  },
  tagLine: {
    fontSize: 18,
    fontWeight: '400',
    color: '#f0f0f0',
    textAlign: 'center',
    marginHorizontal: 10,
    marginBottom: 30,
  },
  exploreButton: {
    backgroundColor: 'white', 
    paddingVertical: 12,
    paddingHorizontal: 40,
    borderRadius: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 4,
    elevation: 5, // For Android shadow
  },
  buttonText: {
    fontSize: 25,
    fontWeight: '600',
    color: 'black',
  },
});
