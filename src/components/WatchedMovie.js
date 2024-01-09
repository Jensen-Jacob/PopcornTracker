// import { useEffect } from "react";

export function WatchedMovie({ movie }) {
  console.log(movie);
  return (
    <li>
      <img src={movie.Poster} alt={`${movie.Title} poster`} />
      <h3>{movie.Title}</h3>
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
          <span>{Number(movie.Runtime.split(" ")[0])} min</span>
        </p>
      </div>
    </li>
  );
}
