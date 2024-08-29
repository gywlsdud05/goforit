import React, { useState, useRef, useEffect } from 'react';
import { Search, Trophy, FileText, Zap, Clock, Shirt, Wine, Tent, Footprints, X } from 'lucide-react';
import { supabase } from '../supabase.client';
import { debounce } from 'lodash';

const SearchPopover = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [searchResults, setSearchResults] = useState([]);
  const inputRef = useRef(null);

  const categories = [
    { icon: <Clock className="w-4 h-4" />, name: "마감임박" },
    { icon: <Trophy className="w-4 h-4" />, name: "스토어BEST" },
    { icon: <FileText className="w-4 h-4" />, name: "매너후기" },
    { icon: <Zap className="w-4 h-4" />, name: "중고가전" },
  ];

  const recentSearches = ["신발", "화장품", "젤스"];

  const popularCategories = [
    { icon: <Shirt className="w-4 h-4" />, name: "패션" },
    { icon: <Wine className="w-4 h-4" />, name: "뷰티" },
    { icon: <Tent className="w-4 h-4" />, name: "캠핑" },
    { icon: <Footprints className="w-4 h-4" />, name: "스포츠" },
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
    <div className="relative w-full max-w-md">
      <div className="flex items-center border border-gray-300 rounded-full px-4 py-2 bg-gray-100">
        <Search className="w-5 h-5 text-gray-400 mr-2" />
        <input
          ref={inputRef}
          type="text"
          value={searchTerm}
          placeholder="새로운 일상이 필요하신가요?"
          className="bg-transparent outline-none flex-grow"
          onFocus={handleInputFocus}
          onChange={handleInputChange}
        />
      </div>
      
      {isOpen && (
        <div className="absolute top-full left-0 w-full mt-2 bg-white rounded-lg shadow-lg p-4">
          <button 
            className="absolute top-2 right-2 p-1 rounded-full hover:bg-gray-100"
            onClick={() => setIsOpen(false)}
          >
            <X className="w-5 h-5 text-gray-500" />
          </button>

          {searchResults.length > 0 ? (
            <div className="mb-4">
              <h3 className="text-sm font-semibold mb-2">검색 결과</h3>
              {searchResults.map((result) => (
                <div key={result.id} className="py-1">
                  {result.name}
                </div>
              ))}
            </div>
          ) : (
            <>
              <div className="flex flex-wrap gap-2 mb-4">
                {categories.map((category, index) => (
                  <div key={index} className="flex items-center bg-gray-100 rounded-full px-3 py-1 text-sm">
                    {category.icon}
                    <span className="ml-1">{category.name}</span>
                  </div>
                ))}
              </div>
              
              <div className="mb-4">
                <h3 className="text-sm font-semibold mb-2">최근 검색어</h3>
                <div className="flex flex-wrap gap-2">
                  {recentSearches.map((search, index) => (
                    <span key={index} className="bg-gray-100 rounded-full px-3 py-1 text-sm">#{search}</span>
                  ))}
                </div>
              </div>
              
              <div>
                <h3 className="text-sm font-semibold mb-2">카테고리</h3>
                <div className="grid grid-cols-2 gap-2">
                  {popularCategories.map((category, index) => (
                    <div key={index} className="flex items-center">
                      {category.icon}
                      <span className="ml-2">{category.name}</span>
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