import { useState, useEffect } from "react";

function useDebounce(value, doAction, delay = 500) {
  const [isLoaded, setIsLoaded] = useState(true);

  useEffect(() => {
    setIsLoaded(false);

    const timeout = setTimeout(() => {
      setIsLoaded(true);
      doAction();
    }, delay);

    return () => clearTimeout(timeout);
  }, [value]);

  return {
    isLoaded,
  };
}

export default useDebounce;
