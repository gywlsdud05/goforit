import React, { useState, useRef, useEffect } from 'react';
import { Search, Trophy, FileText, Zap, Clock, Shirt, Wine, Tent, Footprints, X } from 'lucide-react';
import { supabase } from '../supabase.client';
import { debounce } from 'lodash';
import styles from './SearchPopover.module.css';

const SearchPopover = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [searchResults, setSearchResults] = useState([]);
  const inputRef = useRef(null);

  const categories = [
    { icon: <Clock className={styles.categoryIcon} />, name: "마감임박" },
    { icon: <Trophy className={styles.categoryIcon} />, name: "스토어BEST" },
    { icon: <FileText className={styles.categoryIcon} />, name: "매너후기" },
    { icon: <Zap className={styles.categoryIcon} />, name: "중고가전" },
  ];

  const recentSearches = ["신발", "화장품", "젤스"];

  const popularCategories = [
    { icon: <Shirt className={styles.categoryIcon} />, name: "패션" },
    { icon: <Wine className={styles.categoryIcon} />, name: "뷰티" },
    { icon: <Tent className={styles.categoryIcon} />, name: "캠핑" },
    { icon: <Footprints className={styles.categoryIcon} />, name: "스포츠" },
  ];

  const handleInputFocus = () => {
    setIsOpen(true);
  };

  const handleInputChange = (e) => {
    const value = e.target.value;
    setSearchTerm(value);
    if (!isOpen) {
      setIsOpen(true);
    }
    debouncedSearch(value);
  };

  const searchSupabase = async (term) => {
    if (term.length < 2) {
      setSearchResults([]);
      return;
    }

    const { data, error } = await supabase
      .from('products') // 여기서 'products'는 실제 테이블 이름으로 변경해야 합니다
      .select('id, name')
      .ilike('name', `%${term}%`)
      .limit(5);

    if (error) {
      console.error('Error fetching search results:', error);
    } else {
      setSearchResults(data);
    }
  };

  const debouncedSearch = useRef(
    debounce((term) => {
      searchSupabase(term);
    }, 300)
  ).current;

  useEffect(() => {
    return () => {
      debouncedSearch.cancel();
    };
  }, [debouncedSearch]);

  return (
    <div className={styles.container}>
      <div className={styles.searchBox}>
        <Search className={styles.searchIcon} />
        <input
          ref={inputRef}
          type="text"
          value={searchTerm}
          placeholder="새로운 일상이 필요하신가요?"
          className={styles.input}
          onFocus={handleInputFocus}
          onChange={handleInputChange}
        />
      </div>
      
      {isOpen && (
        <div className={styles.popover}>
          <button 
            className={styles.closeButton}
            onClick={() => setIsOpen(false)}
          >
            <X className={styles.closeIcon} />
          </button>

          {searchResults.length > 0 ? (
            <div className={styles.searchResults}>
              <h3 className={styles.sectionTitle}>검색 결과</h3>
              {searchResults.map((result) => (
                <div key={result.id} className={styles.searchResultItem}>
                  {result.name}
                </div>
              ))}
            </div>
          ) : (
            <>
              <div className={styles.categoriesList}>
                {categories.map((category, index) => (
                  <div key={index} className={styles.categoryItem}>
                    {category.icon}
                    <span>{category.name}</span>
                  </div>
                ))}
              </div>
              
              <div className={styles.recentSearches}>
                <h3 className={styles.sectionTitle}>최근 검색어</h3>
                <div className={styles.recentSearches}>
                  {recentSearches.map((search, index) => (
                    <span key={index} className={styles.recentSearchItem}>#{search}</span>
                  ))}
                </div>
              </div>
              
              <div>
                <h3 className={styles.sectionTitle}>카테고리</h3>
                <div className={styles.popularCategories}>
                  {popularCategories.map((category, index) => (
                    <div key={index} className={styles.popularCategoryItem}>
                      {category.icon}
                      <span>{category.name}</span>
                    </div>
                  ))}
                </div>
              </div>
            </>
          )}
        </div>
      )}
    </div>
  );
};

export default SearchPopover;