import { useEffect, useState } from "react";

const apiKey = "96bf9d7b";
function useMovies(query) {
  const [movies, setMovies] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [errmssg, setErrMssg] = useState("");
  useEffect(
    function () {
      // const controller = new AbortController();
      async function fetchMovies() {
        try {
          setIsLoading(true);
          setErrMssg("");
          const res = await fetch(
            `http://www.omdbapi.com/?apikey=${apiKey}&s=${
              query.length > 3 ? query : ""
            }`
            // { signal: controller.signal }
          );
          const data = await res.json();
          if (data.Response === "False") throw new Error(data.Error);
          if (!res.ok)
            throw new Error("Something Went Wrong with your Network!");
          setMovies(data.Search);
        } catch (e) {
          if (e.message === "Incorrect IMDb ID.")
            setErrMssg("Search For Movie ☝️");
          else setErrMssg(e.message);
        } finally {
          setIsLoading(false);
        }
      }
      fetchMovies();
      // return () => controller.abort();
    },
    [query, setMovies]
  );
  return [isLoading, errmssg, movies];
}

export default useMovies;
