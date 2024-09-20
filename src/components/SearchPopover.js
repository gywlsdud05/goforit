import { supabase } from "../supabase.client";
import styles from "./SearchPopover.module.css";
import { debounce } from "lodash";
import { Search, X } from "lucide-react";
import React, { useState, useRef, useEffect } from "react";

const SearchPopover = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [searchResults, setSearchResults] = useState([]);
  const [recentSearches, setRecentSearches] = useState([]);
  const inputRef = useRef(null);

  useEffect(() => {
    const savedSearches = localStorage.getItem("recentSearches");
    if (savedSearches) {
      setRecentSearches(JSON.parse(savedSearches));
    }
  }, []);

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

  const handleSearch = () => {
    if (searchTerm.trim()) {
      const updatedSearches = [
        searchTerm,
        ...recentSearches.filter((s) => s !== searchTerm),
      ].slice(0, 5);
      setRecentSearches(updatedSearches);
      localStorage.setItem("recentSearches", JSON.stringify(updatedSearches));
    }
    // Perform the search (you can add your search logic here)
  };

  const handleRecentSearchClick = (term) => {
    setSearchTerm(term);
    handleSearch();
  };

  const handleDeleteRecentSearch = (index) => {
    const updatedSearches = recentSearches.filter((_, i) => i !== index);
    setRecentSearches(updatedSearches);
    localStorage.setItem("recentSearches", JSON.stringify(updatedSearches));
  };

  const handleClearAllRecentSearches = () => {
    setRecentSearches([]);
    localStorage.removeItem("recentSearches");
  };

  const searchSupabase = async (term) => {
    if (term.length < 2) {
      setSearchResults([]);
      return;
    }

    const { data, error } = await supabase
      .from("products")
      .select("id, name")
      .ilike("name", `%${term}%`)
      .limit(5);

    if (error) {
      console.error("Error fetching search results:", error);
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
          onKeyPress={(e) => e.key === "Enter" && handleSearch()}
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
              <div className={styles.recentSearches}>
                <h3 className={styles.sectionTitle}>최근 검색어</h3>
                {recentSearches.map((search, index) => (
                  <div key={index} className={styles.recentSearchItem}>
                    <span onClick={() => handleRecentSearchClick(search)}>
                      {search}
                    </span>
                    <button
                      className={styles.deleteButton}
                      onClick={() => handleDeleteRecentSearch(index)}
                    >
                      <X size={16} />
                    </button>
                  </div>
                ))}
                {recentSearches.length > 0 && (
                  <button
                    className={styles.clearAllButton}
                    onClick={handleClearAllRecentSearches}
                  >
                    전체삭제
                  </button>
                )}
              </div>
            </>
          )}
        </div>
      )}
    </div>
  );
};

export default SearchPopover;
