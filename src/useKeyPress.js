import { useEffect } from "react";

function useKeyPress(key, setFun) {
  useEffect(
    function () {
      function handleKeyPress(e) {
        if (e.key === key) setFun();
      }

      document.addEventListener("keydown", handleKeyPress);
      return () => document.removeEventListener("keydown", handleKeyPress);
    },
    [key, setFun]
  );
}
export default useKeyPress;
