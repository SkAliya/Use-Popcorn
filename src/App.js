import { useCallback, useEffect, useRef, useState } from "react";
import StarRating from "./StarRating";
import useMovies from "./useMovies";
import useLocaleStorage from "./useLocaleStorage";
import useKeyPress from "./useKeyPress";

const tempMovieData = [
  {
    imdbID: "tt1375666",
    Title: "Inception",
    Year: "2010",
    Poster:
      "https://m.media-amazon.com/images/M/MV5BMjAxMzY3NjcxNF5BMl5BanBnXkFtZTcwNTI5OTM0Mw@@._V1_SX300.jpg",
  },
  {
    imdbID: "tt0133093",
    Title: "The Matrix",
    Year: "1999",
    Poster:
      "https://m.media-amazon.com/images/M/MV5BNzQzOTk3OTAtNDQ0Zi00ZTVkLWI0MTEtMDllZjNkYzNjNTc4L2ltYWdlXkEyXkFqcGdeQXVyNjU0OTQ0OTY@._V1_SX300.jpg",
  },
  {
    imdbID: "tt6751668",
    Title: "Parasite",
    Year: "2019",
    Poster:
      "https://m.media-amazon.com/images/M/MV5BYWZjMjk3ZTItODQ2ZC00NTY5LWE0ZDYtZTI3MjcwN2Q5NTVkXkEyXkFqcGdeQXVyODk4OTc3MTY@._V1_SX300.jpg",
  },
];

const tempWatchedData = [
  {
    imdbID: "tt1375666",
    Title: "Inception",
    Year: "2010",
    Poster:
      "https://m.media-amazon.com/images/M/MV5BMjAxMzY3NjcxNF5BMl5BanBnXkFtZTcwNTI5OTM0Mw@@._V1_SX300.jpg",
    runtime: 148,
    imdbRating: 8.8,
    userRating: 10,
  },
  {
    imdbID: "tt0088763",
    Title: "Back to the Future",
    Year: "1985",
    Poster:
      "https://m.media-amazon.com/images/M/MV5BZmU0M2Y1OGUtZjIxNi00ZjBkLTg1MjgtOWIyNThiZWIwYjRiXkEyXkFqcGdeQXVyMTQxNzMzNDI@._V1_SX300.jpg",
    runtime: 116,
    imdbRating: 8.5,
    userRating: 9,
  },
];

const apiKey = "96bf9d7b";
const average = (arr) =>
  arr.reduce((acc, cur, i, arr) => acc + cur / arr.length, 0);

export default function App() {
  // const [movies, setMovies] = useState(tempMovieData);
  // const [watched, setWatched] = useState(tempWatchedData);
  const [query, setQuery] = useState("");
  const [selectedMvId, setSelectedMvId] = useState(null);
  const [isLoading, errmssg, movies] = useMovies(query);
  const [watched, setWatched] = useLocaleStorage([], "watched");

  function handleDisplayMv(id) {
    setSelectedMvId(selectedMvId === id ? null : id);
  }

  function handleDeleteMv(e, id) {
    e.stopPropagation();
    setWatched((movies) => movies.filter((mv) => mv.mvId !== id));
  }

  function handleAddMvToWatched(movie) {
    setWatched((movies) => [...movies, movie]);
  }

  function handleCloseMv() {
    setSelectedMvId(null);
  }
  return (
    <>
      <Header query={query} setQuery={setQuery} movies={movies} />
      <Main>
        <Box>
          {(isLoading && <Loader />) ||
            (!isLoading && !errmssg && (
              <MoviesList movies={movies} handleDisplayMv={handleDisplayMv} />
            )) ||
            (errmssg && <ErrorComp message={errmssg} />)}
        </Box>

        <Box>
          {selectedMvId ? (
            <MovieDetails
              mvId={selectedMvId}
              handleCloseMv={handleCloseMv}
              handleAddMvToWatched={handleAddMvToWatched}
              watched={watched}
              selectedMvId={selectedMvId}
            />
          ) : (
            <>
              <Summary watched={watched} />
              <WatchedMoviesList
                watched={watched}
                handleDisplayMv={handleDisplayMv}
                handleDeleteMv={handleDeleteMv}
              />
            </>
          )}
        </Box>
      </Main>
    </>
  );
}

function Header({ query, setQuery, movies }) {
  const inpRef = useRef(null);
  useKeyPress("Enter", function () {
    if (document.activeElement === inpRef.current) return;
    inpRef.current.focus();
    setQuery("");
  });

  return (
    <nav className="nav-bar">
      <div className="logo">
        <span role="img">🍿</span>
        <h1>usePopcorn</h1>
      </div>
      <input
        className="search"
        type="text"
        placeholder="Search movies..."
        value={query}
        onChange={(e) => setQuery(e.target.value)}
        ref={inpRef}
      />
      <p className="num-results">
        Found <strong>{movies.length}</strong> results
      </p>
    </nav>
  );
}

function Main({ children }) {
  return <main className="main">{children}</main>;
}

function Box({ children }) {
  const [isOpen, setIsOpen] = useState(true);
  return (
    <div className="box">
      <button className="btn-toggle" onClick={() => setIsOpen((open) => !open)}>
        {isOpen ? "–" : "+"}
      </button>
      {isOpen && children}
    </div>
  );
}

function MoviesList({ movies, handleDisplayMv }) {
  return (
    <ul className="list">
      {movies?.map((movie) => (
        <li key={movie.imdbID} onClick={() => handleDisplayMv(movie.imdbID)}>
          <img src={movie.Poster} alt={`${movie.Title} poster`} />
          <h3>{movie.Title}</h3>
          <div>
            <p>
              <span>🗓</span>
              <span>{movie.Year}</span>
            </p>
          </div>
        </li>
      ))}
    </ul>
  );
}

function Summary({ watched }) {
  const avgImdbRating = average(
    watched.map((movie) => movie.imdbRating)
  ).toFixed(2);
  const avgUserRating = average(
    watched.map((movie) => movie.userRating)
  ).toFixed(2);
  const avgRuntime = average(
    watched.map((movie) => (movie.runtime ? movie.runtime : 0))
  ).toFixed(2);
  return (
    <div className="summary">
      <h2>Movies you watched</h2>
      <div>
        <p>
          <span>#️⃣</span>
          <span>{watched.length} movies</span>
        </p>
        <p>
          <span>⭐️</span>
          <span>{avgImdbRating}</span>
        </p>
        <p>
          <span>🌟</span>
          <span>{avgUserRating}</span>
        </p>
        <p>
          <span>⏳</span>
          <span>{avgRuntime} min</span>
        </p>
      </div>
    </div>
  );
}

function WatchedMoviesList({ watched, handleDisplayMv, handleDeleteMv }) {
  return (
    <ul className="list">
      {watched.map((movie) => (
        <li key={movie.mvId} onClick={() => handleDisplayMv(movie.mvId)}>
          <img src={movie.poster} alt={`${movie.title} poster`} />
          <h3>{movie.title}</h3>
          <div>
            <p>
              <span>⭐️</span>
              <span>{movie.imdbRating}</span>
            </p>
            <p>
              <span>🌟</span>
              <span>{movie.userRating}</span>
            </p>
            <p>
              <span>⏳</span>
              <span>{movie.runtime} min</span>
            </p>
            <button
              className="btn-delete"
              onClick={(e) => handleDeleteMv(e, movie.mvId)}
            >
              X
            </button>
          </div>
        </li>
      ))}
    </ul>
  );
}

function Loader() {
  return <p className="loader">Loading...</p>;
}
function ErrorComp({ message }) {
  return <p className="error">{message}</p>;
}

function MovieDetails({
  mvId,
  handleCloseMv,
  handleAddMvToWatched,
  watched,
  selectedMvId,
}) {
  const [isLoading, setIsLoading] = useState(false);
  const [currMovie, setCurrMovie] = useState({});
  const [userRating, setUserRating] = useState(0);
  // const [avgRating, setAvgRating] = useState(0);
  useEffect(
    function () {
      async function fetchMovie() {
        try {
          setIsLoading(true);
          const res = await fetch(
            `http://www.omdbapi.com/?apikey=${apiKey}&i=${mvId}`
          );
          const data = await res.json();
          setCurrMovie(data);
          setIsLoading(false);
        } finally {
          setIsLoading(false);
        }
      }
      fetchMovie();
    },
    [mvId]
  );

  const {
    Poster: poster,
    Title: title,
    Genre: genre,
    imdbRating,
    Actors: actors,
    Plot: plot,
    Director: director,
    Released: released,
    Runtime: runtime,
  } = currMovie;

  // useEffect(
  //   function () {
  //     setAvgRating(imdbRating);
  //     setAvgRating((avg) => avg * 2);
  //   },
  //   [setAvgRating, imdbRating]
  // );

  const isRatedAlready = watched.find(
    (mv) => mv.mvId === selectedMvId
  )?.userRating;

  const handleAdd = useCallback(() => {
    if (!userRating) return;
    const movie = {
      poster,
      title,
      imdbRating: Number(imdbRating),
      mvId,
      runtime: Number(runtime.split(" ")[0]),
      userRating,
    };
    handleAddMvToWatched(movie);
    handleCloseMv();
  });

  // useEffect(
  //   function () {
  //     document.addEventListener("keydown", handleKeyPress);
  //     function handleKeyPress(e) {
  //       if (e.key === "Escape") {
  //         setSelectedMvId(null);
  //       }
  //       if (e.key === "Enter") {
  //         console.log(e.key);
  //         handleAdd();
  //       }
  //     }
  //     return () => document.removeEventListener("keydown", handleKeyPress);
  //   },
  //   [setSelectedMvId, handleAdd]
  // );

  useKeyPress("Escape", handleCloseMv);

  useKeyPress("Enter", function () {
    handleAdd();
  });

  useEffect(
    function () {
      document.title = "Use-Popcorn | " + title;

      return () => (document.title = "Use-Popcorn");
    },
    [title]
  );

  return (
    <div className="details">
      {isLoading ? (
        <Loader />
      ) : (
        <>
          <header>
            <button className="btn-back" onClick={handleCloseMv}>
              &larr;
            </button>
            <img src={poster} alt={`Poster of ${currMovie} movie`} />
            <div className="details-overview">
              <h2>{title}</h2>
              <p>
                {released} &bull; {runtime}
              </p>
              <p>{genre}</p>
              <p>
                <span>⭐️</span>
                {imdbRating} IMDb rating
              </p>
            </div>
          </header>
          {/* <p>{avgRating}</p> */}

          <section>
            {isRatedAlready ? (
              <p className="rating">You Rated this Movie {isRatedAlready} ⭐</p>
            ) : (
              <>
                <div className="rating">
                  <StarRating
                    maxRating={10}
                    color="#fcc419"
                    size={24}
                    defaultRating={0}
                    onSetRating={setUserRating}
                  />
                </div>
                <button className="btn-add" onClick={handleAdd}>
                  Add to list
                </button>
              </>
            )}
            <p>
              <em>{plot}</em>
            </p>
            <p>Starring {actors}</p>
            <p>Directed by {director}</p>
          </section>
        </>
      )}
    </div>
  );
}
