import { Pressable, StyleSheet, Text, FlatList } from 'react-native';
import React from 'react';
import { data } from '../constants/data';
import { theme } from '../constants/theme';
import { wp, hp } from '../helpers/common';
import Animated, { FadeInRight } from 'react-native-reanimated';

const Categories = ({ activeCategory, handleChangeCategory }) => {
  return (
    <FlatList
      horizontal
      contentContainerStyle={styles.flatlistContainer}
      showsHorizontalScrollIndicator={false}
      data={data?.categories || []} // Ensure data is valid
      keyExtractor={(item, index) => `${item}-${index}`} // Unique key for each item
      renderItem={({ item, index }) => (
        <CategoryItem
          index={index} // Pass index for animation
          isActive={activeCategory === item}
          handleChangeCategory={handleChangeCategory}
          title={item}
        />
      )}
    />
  );
};

const CategoryItem = ({ title, index, isActive, handleChangeCategory }) => {
  const color = isActive ? theme.colors.white : theme.colors.neutral(0.8);
  const backgroundColor = isActive ? theme.colors.primary : theme.colors.white;
  const borderColor = isActive ? theme.colors.primary : theme.colors.grayBG;

  return (
    <Animated.View
      entering={FadeInRight.delay(index * 200).duration(1000).springify().damping(14)}
    >
      <Pressable
        onPress={() => handleChangeCategory(isActive ? null : title)}
        style={[
          styles.category,
          { backgroundColor, borderColor },
        ]}
      >
        <Text style={[styles.title, { color }]}>
          {title}
        </Text>
      </Pressable>
    </Animated.View>
  );
};

export default Categories;

const styles = StyleSheet.create({
  flatlistContainer: {
    paddingHorizontal: wp(1.0),
    gap: 12, // Increased gap for better spacing between items
  },
  category: {
    paddingVertical: 10,
    paddingHorizontal: 20, // Increased horizontal padding for a larger touch area
    borderWidth: 1,
    borderColor: theme.colors.grayBG,
    borderRadius: 10,
    marginRight: 2, // Added margin between items
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: theme.colors.white,
    shadowColor: 'aqua',
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 5, // Added elevation for Android shadow
    transition: 'background-color 0.3s ease', // Smooth transition for background color change
  },
  title: {
    fontSize: hp(1.9), // Slightly increased font size for better readability
    fontWeight: theme.fontWeights.medium, // More balanced font weight
    textAlign: 'center',
    letterSpacing: 0.1, // Added letter spacing for a cleaner text appearance
  },
});
