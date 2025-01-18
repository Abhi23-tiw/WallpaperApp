import { View, Text, Pressable, StyleSheet, ScrollView, TextInput, ActivityIndicator } from 'react-native';
import React, { useCallback, useEffect, useRef, useState } from 'react';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Feather, FontAwesome6, Ionicons } from '@expo/vector-icons';
import { theme } from '../../constants/theme';
import { wp, hp } from '../../helpers/common';
import Categories from '../../components/Categories';
import { apiCall } from '../../api';
import ImageGrid from '../../components/ImageGrid';
import { debounce } from 'lodash';
import FiltersModal from '../../components/FiltersModal';
import { useRouter } from 'expo-router';
import { LinearGradient } from 'expo-linear-gradient';

var page = 1;

const HomeScreen = () => {
  const { top } = useSafeAreaInsets();
  const paddingTop = top > 0 ? top + 10 : 30;
  const [search, setSearch] = useState('');
  const [activeCategory, setActivecategory] = useState(null);
  const [images, setImages] = useState([]);
  const [filters, setFilters] = useState(null);
  const searchInputRef = useRef(null);
  const modalRef = useRef(null);
  const scrollRef = useRef(null);
  const [isEndReached, setIsEndReached] = useState(false);
  const [isLoading, setIsLoading] = useState(false); // New loading state
  const router = useRouter();

  useEffect(() => {
    fetchImages();
  }, []);

  const fetchImages = async (params = { page: 1 }, append = true) => {
    setIsLoading(true); // Start loading
    let res = await apiCall(params);
    if (res.success && res?.data?.hits) {
      if (append) setImages([...images, ...res.data.hits]);
      else setImages([...res.data.hits]);
    }
    setIsLoading(false); // End loading
  };

  const openFiltersModal = () => {
    modalRef?.current?.present();
  };
  const closeFiltersModal = () => {
    modalRef?.current?.close();
  };

  const applyFilters = () => {
    if (filters) {
      page = 1;
      setImages([]);
      let params = {
        page,
        ...filters,
      };
      if (activeCategory) params.category = activeCategory;
      if (search) params.q = search;
      fetchImages(params, false);
    }
    closeFiltersModal();
  };

  const resetFilters = () => {
    if (filters) {
      page = 1;
      setFilters(null);
      setImages([]);
      let params = {
        page,
      };
      if (activeCategory) params.category = activeCategory;
      if (search) params.q = search;
      fetchImages(params, false);
    }
    setFilters(null);
    closeFiltersModal();
  };

  const clearThisFilter = (filterName) => {
    let filterz = { ...filters };
    delete filterz[filterName];
    setFilters({ ...filterz });
    page = 1;
    setImages([]);
    let params = {
      page,
      ...filterz,
    };
    if (activeCategory) params.category = activeCategory;
    if (search) params.q = search;
    fetchImages(params, false);
  };

  const handleChangeCategory = (cat) => {
    setActivecategory(cat);
    clearSearch();
    setImages([]);
    page = 1;
    let params = {
      page,
      ...filters,
    };
    if (cat) params.category = cat;
    fetchImages(params, false);
  };

  const handleSearch = (text) => {
    setSearch(text);
    if (text.length > 2) {
      setImages([]);
      setActivecategory(null);
      fetchImages({ page, q: text, ...filters }, false);
    }

    if (text === '') {
      page = 1;
      searchInputRef?.current?.clear();
      setImages([]);
      setActivecategory(null);
      fetchImages({ page, ...filters }, false);
    }
  };

  const clearSearch = () => {
    setSearch('');
    searchInputRef?.current?.clear();
  };

  const handleScroll = (event) => {
    const contentHeight = event.nativeEvent.contentSize.height;
    const scrollViewHeight = event.nativeEvent.layoutMeasurement.height;
    const scrollOffset = event.nativeEvent.contentOffset.y;
    const bottomPosition = contentHeight - scrollViewHeight;

    if (scrollOffset >= bottomPosition - 1) {
      if (!isEndReached) {
        setIsEndReached(true);
        ++page;
        let params = {
          page,
          ...filters,
        };
        if (activeCategory) params.category = activeCategory;
        if (search) params.q = search;
        fetchImages(params);
      }
    } else if (isEndReached) {
      setIsEndReached(false);
    }
  };

  const handleScrollUp = () => {
    scrollRef?.current?.scrollTo({
      y: 0,
      animated: true,
    });
  };

  const handleTextDebounce = useCallback(debounce(handleSearch, 400), []);

  return (
    <LinearGradient
      colors={['#eeaeca', '#94bbe9']}
      style={[styles.container, { paddingTop }]}
    >
      <View style={styles.header}>
        <Pressable onPress={handleScrollUp}>
          <Text style={styles.title}>PixelCanvas</Text>
        </Pressable>
        <Pressable onPress={openFiltersModal}>
          <FontAwesome6 name="bars-staggered" size={22} color={theme.colors.neutral(0.7)} />
        </Pressable>
      </View>
      <ScrollView
        onScroll={handleScroll}
        scrollEventThrottle={5}
        ref={scrollRef}
        contentContainerStyle={{ gap: 15 }}
      >
        <View style={styles.searchBar}>
          <View style={styles.searchIcon}>
            <Feather name="search" size={24} color={theme.colors.neutral(0.4)} />
          </View>
          <TextInput
            placeholder="Search for photos..."
            ref={searchInputRef}
            onChangeText={handleTextDebounce}
            style={styles.searchInput}
          />
          {search && (
            <Pressable onPress={() => handleSearch('')} style={styles.closeIcon}>
              <Ionicons name="close" size={24} color={theme.colors.neutral(0.6)} />
            </Pressable>
          )}
        </View>
        <View style={styles.categories}>
          <Categories activeCategory={activeCategory} handleChangeCategory={handleChangeCategory} />
        </View>
        {filters && (
          <View>
            <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.filter}>
              {Object.keys(filters).map((key, index) => {
                return (
                  <View key={key} style={styles.filterItem}>
                    {key === 'colors' ? (
                      <View
                        style={{
                          height: 20,
                          width: 30,
                          borderRadius: 7,
                          backgroundColor: filters[key],
                        }}
                      />
                    ) : (
                      <Text style={styles.filterItemText}>{filters[key]}</Text>
                    )}
                    <Pressable style={styles.filterCloseIcons} onPress={() => clearThisFilter(key)}>
                      <Ionicons name="close" size={14} color={theme.colors.neutral(0.9)} />
                    </Pressable>
                  </View>
                );
              })}
            </ScrollView>
          </View>
        )}
        <View>
          {images.length > 0 && <ImageGrid images={images} router={router} />}
        </View>

        {/* Loading state */}
        {isLoading && (
          <View style={styles.activityIndicatorContainer}>
            <ActivityIndicator size="large" color={theme.colors.primary} />
            <Text style={styles.loadingText}>Loading...</Text>
          </View>
        )}
      </ScrollView>

      <FiltersModal
        modalRef={modalRef}
        filters={filters}
        setFilters={setFilters}
        onClose={closeFiltersModal}
        onApply={applyFilters}
        onReset={resetFilters}
      />
    </LinearGradient>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingBottom: 10,
  },
  header: {
    marginHorizontal: wp(4),
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 15,
  },
  title: {
    fontSize: hp(4),
    fontWeight: theme.fontWeights.bold,
    color: theme.colors.primary,
  },
  searchBar: {
    marginHorizontal: wp(4),
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: theme.colors.white,
    borderRadius: theme.radius.lg,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
    padding: 10,
    marginBottom: 20,
  },
  searchIcon: {
    marginRight: 10,
  },
  searchInput: {
    flex: 1,
    fontSize: hp(2),
    color: theme.colors.neutral(0.8),
  },
  closeIcon: {
    backgroundColor: theme.colors.grayBG,
    padding: 6,
    borderRadius: theme.radius.sm,
  },
  categories: {
    marginHorizontal: wp(4),
    marginBottom: 15,
  },
  filters: {
    paddingHorizontal: wp(4),
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 10,
    marginBottom: 15,
  },
  filterItem: {
    backgroundColor: theme.colors.grayBG,
    flexDirection: 'row',
    alignItems: 'center',
    borderRadius: theme.radius.md,
    padding: 8,
    paddingHorizontal: 12,
    gap: 8,
  },
  filterItemText: {
    fontSize: hp(1.8),
    color: theme.colors.neutral(0.9),
  },
  filterCloseIcons: {
    backgroundColor: theme.colors.neutral(0.3),
    padding: 4,
    borderRadius: theme.radius.xs,
  },
  activityIndicatorContainer: {
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 20,
    marginBottom: 70,
  },
  loadingText: {
    fontSize: hp(2),
    color: theme.colors.primary,
    marginTop: 10,
  },
});

export default HomeScreen;
