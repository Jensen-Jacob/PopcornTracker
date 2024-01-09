import { useEffect, useState } from "react";
import { Loader } from "./Loader";
import StarRating from "./StarRating";

export function MovieDetails({
  selectedMovieID,
  watched,
  apiKey,
  onCloseMovieSelection,
  onAddWatchedMovie,
  // setIsLoadingMovieDetails,
}) {
  const [isLoadingMovieDetails, setIsLoadingMovieDetails] = useState(false);
  const [movieDetails, setMovieDetails] = useState({});
  const [userRating, setUserRating] = useState(0);

  const isWatched = watched
    .map((movie) => movie.imdbID)
    .includes(selectedMovieID);

  const existingUserRating = watched.find(
    (movie) => movie.imdbID === selectedMovieID
  )?.userRating;

  console.log(selectedMovieID, isWatched);

  const {
    Title: title,
    Year: year,
    Poster: poster,
    Runtime: runtime,
    imdbRating,
    Plot: plot,
    Released: released,
    Actors: actors,
    Director: director,
    Genre: genre,
  } = movieDetails;

  useEffect(
    function () {
      async function fetchSelectedMovieDetails() {
        try {
          setIsLoadingMovieDetails(true);
          const res = await fetch(
            `http://www.omdbapi.com/?i=${selectedMovieID}&apikey=${apiKey}`
          );
          if (!res.ok) throw new Error("Something went wrong");
          const data = await res.json();
          if (data.Response === "False")
            throw new Error("Movie details not found.");
          setMovieDetails(data);
        } catch (err) {
          console.error(err.message);
        } finally {
          setIsLoadingMovieDetails(false);
        }
      }
      fetchSelectedMovieDetails();
    },
    [apiKey, selectedMovieID, watched]
  );

  // useEffect(
  //   function () {
  //     async function setPageTitle() {
  //       const pageTitle = await title;
  //       if (!pageTitle) {
  //         document.title = "Loading";
  //       } else {
  //         document.title = pageTitle;
  //       }
  //     }
  //     setPageTitle();
  //   },
  //   [title]
  // );

  useEffect(
    function () {
      if (!title) return;
      document.title = title;

      return function () {
        document.title = "PopcornTracker";
      };
    },
    [title]
  );

  console.log(movieDetails);

  function handleAddWatchedMovie() {
    const newWatchedMovieDetails = {
      imdbID: selectedMovieID,
      title,
      year,
      poster,
      userRating: userRating,
      imdbRating: Number(imdbRating),
      runtime: Number(runtime.split(" ").at(0)),
    };

    onAddWatchedMovie(newWatchedMovieDetails);
    onCloseMovieSelection();
  }

  return (
    <>
      {isLoadingMovieDetails ? (
        <Loader />
      ) : (
        <div className="details">
          <button className="btn-back" onClick={onCloseMovieSelection}>
            &larr;
          </button>
          <header>
            <img src={poster} alt="" />
            <div className="details-overview">
              <h2>{title}</h2>
              <p>
                {released} &bull; {runtime}
              </p>
              <p>{genre}</p>
              <p>
                <span>🌟</span>
                {imdbRating} IMDb Rating
              </p>
            </div>
          </header>
          <section>
            {!isWatched ? (
              <>
                <StarRating
                  className="rating"
                  maxRating={10}
                  size={24}
                  onSetRating={setUserRating}
                />
                {userRating > 0 && (
                  <button
                    className="btn-add"
                    // onClick={() => onAddWatchedMovie(movieDetails)}
                    onClick={handleAddWatchedMovie}
                  >
                    + Add to list
                  </button>
                )}
              </>
            ) : (
              <p>
                You rated this movie with {existingUserRating}
                <span>⭐</span>
              </p>
            )}
            <p>
              <em>{plot}</em>
            </p>
            <p>Starring {actors}</p>
            <p>Directed by {director}</p>
          </section>
        </div>
      )}
    </>
  );
}
