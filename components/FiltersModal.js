import { Pressable, StyleSheet, Text, View } from 'react-native';
import React, { useMemo } from 'react';
import {
  BottomSheetModal,
  BottomSheetView,
} from '@gorhom/bottom-sheet';
import { BlurView } from 'expo-blur';
import Animated, { Extrapolation, FadeInDown, interpolate, useAnimatedStyle } from 'react-native-reanimated';
import { hp } from '../helpers/common';
import { ColorFilter, CommonFilterRow, SectionView } from './FiltersView';
import { capitalize } from 'lodash';
import { data } from '../constants/data';
import { LinearGradient } from 'expo-linear-gradient';

const FiltersModal = ({
  modalRef,
  onClose,
  onApply,
  onReset,
  filters,
  setFilters,
}) => {
  const snapPoints = useMemo(() => ['75%'], []);

  return (
    <LinearGradient
      colors={['#ff6a8f', '#4b8bff']} 
      start={{ x: 0, y: 0 }}
      end={{ x: 1, y: 1 }}
      style={styles.gradientBackground}
    >
      <BottomSheetModal
        ref={modalRef}
      >
        <BottomSheetView style={styles.contentContainer}>
          <View style={styles.content}>
            <Text style={styles.filterText}>Filters</Text>

            {Object.keys(sections).map((sectionName, index) => {
              let sectionView = sections[sectionName];
              let sectionData = data.filters[sectionName];
              let title = capitalize(sectionName);
              return (
                <Animated.View
                  entering={FadeInDown.delay(index * 100 + 100).springify().damping(11)}
                  key={sectionName}
                >
                  <SectionView
                    title={title}
                    content={sectionView({
                      data: sectionData,
                      filters,
                      setFilters,
                      filterName: sectionName,
                    })}
                  />
                </Animated.View>
              );
            })}

            {/* Actions */}
            <Animated.View
              entering={FadeInDown.delay(500).springify().damping(11)}
              style={styles.buttons}
            >
              <Pressable style={styles.resetbutton} onPress={onReset}>
                <Text style={styles.buttonTextReset}>Reset</Text>
              </Pressable>
              <Pressable style={styles.applyButton} onPress={onApply}>
                <Text style={styles.buttonTextApply}>Apply</Text>
              </Pressable>
            </Animated.View>
          </View>
        </BottomSheetView>
      </BottomSheetModal>
    </LinearGradient>
  );
};

const sections = {
  order: (props) => <CommonFilterRow {...props} />,
  orientation: (props) => <CommonFilterRow {...props} />,
  type: (props) => <CommonFilterRow {...props} />,
  colors: (props) => <ColorFilter {...props} />,
};

const CustomBackdrop = ({ animatedIndex, style }) => {
  const containerAnimatedStyle = useAnimatedStyle(() => {
    let opacity = interpolate(animatedIndex.value, [-1, 0], [0, 1], Extrapolation.CLAMP);
    return { opacity };
  });
  const containerStyle = [
    StyleSheet.absoluteFillObject,
    style,
    styles.overlay,
    containerAnimatedStyle,
  ];

  return (
    <Animated.View style={containerStyle}>
      <BlurView style={StyleSheet.absoluteFill} tint="dark" intensity={30} />
    </Animated.View>
  );
};

export default FiltersModal;

const styles = StyleSheet.create({
  gradientBackground: {
    flex: 1,
  },
  contentContainer: {
    flex: 1,
    alignItems: 'center',
    backgroundColor: 'transparent', // Make sure the background is transparent for the gradient
  },
  overlay: {
    backgroundColor: 'rgba(0,0,0,0.5)',
  },
  content: {
    flex: 1,
    gap: 20,
    paddingVertical: 15,
    paddingHorizontal: 25,
  },
  filterText: {
    fontSize: hp(4.5), // 18px
    fontWeight: '700', // bold
    color: '#3a3a3a', // Dark gray
    marginBottom: 10,
  },
  buttons: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    gap: 15,
  },
  applyButton: {
    backgroundColor: '#4b8bff', // Primary blue
    paddingVertical: 12,
    paddingHorizontal: 20,
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 12, // Rounded corners
    borderCurve: 'continuous',
    shadowColor: '#4b8bff',
    shadowOffset: { width: 0, height: 5 },
    shadowOpacity: 0.2,
    shadowRadius: 10,
  },
  resetbutton: {
    backgroundColor: '#f4f4f4', // Light gray
    paddingVertical: 12,
    paddingHorizontal: 20,
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 12, // Rounded corners
    borderCurve: 'continuous',
    borderWidth: 2,
    borderColor: '#dcdcdc', // Gray border
    shadowColor: '#dcdcdc',
    shadowOffset: { width: 0, height: 5 },
    shadowOpacity: 0.2,
    shadowRadius: 10,
  },
  buttonTextApply: {
    fontSize: hp(2.4), // 14px
    fontWeight: '600', // Semi-bold
    color: '#ffffff', // White text
  },
  buttonTextReset: {
    fontSize: hp(2.4), // 14px
    fontWeight: '600', // Semi-bold
    color: '#3a3a3a', // Dark gray text
  },
});
