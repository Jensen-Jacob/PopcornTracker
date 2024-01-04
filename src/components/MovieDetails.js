import { useEffect, useState } from "react";
import { Loader } from "./Loader";
import StarRating from "./StarRating";

export function MovieDetails({
  selectedMovieID,
  apiKey,
  onCloseMovieSelection,
  // setIsLoadingMovieDetails,
}) {
  const [isLoadingMovieDetails, setIsLoadingMovieDetails] = useState(false);
  const [movieDetails, setMovieDetails] = useState({});

  const {
    Title: title,
    Year: year,
    Poster: poster,
    Ratings: ratings,
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
              {/* <span className="rating">{ratings[0].Value}</span> */}
              {/* <p>{plot}</p> */}
            </div>
          </header>
          <section>
            <StarRating className="rating" maxRating={10} size={30} />
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
