import {useState, useEffect, useRef} from 'react';

/**
 * event listener to close outside side-nav
 * @return {Event}
 */
export default function useComponentVisible() {
  const [isComponentVisible, setIsComponentVisible] = useState(false);
  const ref = useRef<any>(null);

  const handleClickOutside = (event: any) => {
    if (ref.current && !ref.current.contains(event.target)) {
      setIsComponentVisible(!isComponentVisible);
    }
  };

  useEffect(() => {
    document.addEventListener('click', handleClickOutside, !isComponentVisible);

    return () => {
      document.removeEventListener(
          'click',
          handleClickOutside,
          !isComponentVisible,
      );
    };
  });

  return {ref, isComponentVisible, setIsComponentVisible};
}
