import { useEffect, useState } from "react";
import { Loader } from "./Loader";
import StarRating from "./StarRating";

export function MovieDetails({
  selectedMovieID,
  apiKey,
  onCloseMovieSelection,
  onAddWatchedMovie,
  // setIsLoadingMovieDetails,
}) {
  const [isLoadingMovieDetails, setIsLoadingMovieDetails] = useState(false);
  const [movieDetails, setMovieDetails] = useState({});
  const [userRating, setUserRating] = useState(0);
  console.log(selectedMovieID);

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
    [apiKey, selectedMovieID]
  );

  console.log(movieDetails);

  function handleAddWatchedMovie() {
    const newWatchedMovieDetails = {
      imdbID: selectedMovieID,
      title,
      year,
      poster,
      runtime,
      userRating: userRating,
      imdbRating: Number(imdbRating),
      runtime: Number(runtime.split(" ").at(0)),
    };

    onAddWatchedMovie(newWatchedMovieDetails);
  }

  return (
    <>
      {isLoadingMovieDetails ? (
        <Loader />
      ) : (
        <div className="details">
          <button className="btn-back" onClick={onCloseMovieSelection}>
            {/* <span> */}
            <b>&larr;</b>
            {/* </span> */}
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
              {/* <span className="rating">{ratings[0].Value}</span> */}
              {/* <p>{plot}</p> */}
            </div>
          </header>
          <section>
            <StarRating
              className="rating"
              maxRating={10}
              size={24}
              onSetRating={setUserRating}
            />
            {/* <div className="rating"> */}
            <button
              className="btn-add"
              // onClick={() => onAddWatchedMovie(movieDetails)}
              onClick={handleAddWatchedMovie}
            >
              + Add to list
            </button>
            {/* </div> */}
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
