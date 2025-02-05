import { useEffect, useState } from "react";

function useLocaleStorage(initialState, key) {
  const [value, setValue] = useState(function () {
    const storedData = JSON.parse(localStorage.getItem("watched"));
    return storedData ? storedData : initialState;
  });
  useEffect(
    function () {
      localStorage.setItem(key, JSON.stringify(value));
    },
    [value, key]
  );
  return [value, setValue];
}

export default useLocaleStorage;
