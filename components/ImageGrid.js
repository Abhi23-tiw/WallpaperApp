import { StyleSheet, View } from 'react-native';
import React from 'react';
import { MasonryFlashList } from "@shopify/flash-list";
import ImageCard from './ImageCard';
import { getColumnCount, wp } from '../helpers/common';

const ImageGrid = ({ images , router}) => {
  const columns = getColumnCount();

  return (
    <View style={styles.container}>
      <MasonryFlashList
        data={images || []} // Ensure images is valid
        numColumns={columns} // Use dynamic column count
        initialNumToRender={20} // Optimize rendering
        contentContainerStyle={styles.listContainerStyle} // Corrected typo
        renderItem={({ item, index }) => (
          <ImageCard router = {router} item={item} columns={columns} index={index} />
        )}
        estimatedItemSize={200} // Optimize item size estimation
      />
    </View>
  );
};

export default ImageGrid;

const styles = StyleSheet.create({
  container: {
    flex: 1, // Ensures the container takes up available space
    width: wp(100),
  },
  listContainerStyle: {
    padding: wp(4),
  },
});
