import { useEffect, useCallback } from 'react';
import { debounce } from 'lodash';

const useScrollPosition = (key, delay = 100) => {

  const handleScroll = useCallback(() => {
    const currentPosition = window.scrollY;
    localStorage.setItem('duckFundingScrollPosition', currentPosition.toString());
  }, []);

  const debouncedHandleScroll = debounce(handleScroll, 100);

  useEffect(() => {
    window.addEventListener('scroll', debouncedHandleScroll);

    return () => {
      window.removeEventListener('scroll', debouncedHandleScroll);
      debouncedHandleScroll.cancel();
    };
  }, [debouncedHandleScroll]);


  const saveScrollPosition = useCallback(
    debounce(() => {
      const currentPosition = window.scrollY;
      localStorage.setItem(key, currentPosition.toString());
    }, delay),
    [key, delay]
  );

  useEffect(() => {
    const savedPosition = localStorage.getItem(key);
    if (savedPosition) {
      window.scrollTo(0, parseInt(savedPosition, 10));
    }

    window.addEventListener('scroll', saveScrollPosition);

    return () => {
      window.removeEventListener('scroll', saveScrollPosition);
      saveScrollPosition.cancel();
    };
  }, [key, saveScrollPosition]);

  // useEffect(() => {
  //   console.log(`Page changed to: ${location.pathname}`);
  //   console.log(`Current scroll position: ${window.scrollY}`);
  // }, [location])

};

export default useScrollPosition;