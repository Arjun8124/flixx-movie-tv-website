const global = {
  currentWindow: window.location.pathname,
};
//display popular movies
function showSpinner() {
  document.querySelector(".spinner").classList.add("show");
}

function hideSpinner() {
  document.querySelector(".spinner").classList.remove("show");
}

async function displayPopularTV() {
  showSpinner();
  const { results } = await fetchFromApi("tv/popular");
  hideSpinner();
  results.forEach((show) => {
    const div = document.createElement("div");
    div.classList.add("card");
    div.innerHTML = `
          <a href="tv-details.html?${show.id}">
            ${
              show.poster_path
                ? `<img
              src="https://image.tmdb.org/t/p/w500${show.poster_path}"
              class="card-img-top"
              alt="${show.name}"
            />`
                : `<img
              src="images/no-image.jpg"
              class="card-img-top"
              alt="${show.name}"
            />`
            }
          </a>
          <div class="card-body">
            <h5 class="card-title">${show.name}</h5>
            <p class="card-text">
              <small class="text-muted">Aired: ${show.first_air_date}</small>
            </p>
          </div>
    `;
    document.querySelector("#popular-shows").appendChild(div);
  });
}

async function displayPopularMovies() {
  showSpinner();
  const { results } = await fetchFromApi("movie/popular");
  hideSpinner();
  results.forEach((movie) => {
    const div = document.createElement("div");
    div.classList.add("card");
    div.innerHTML = `<a href="movie-details.html?${movie.id}">
          ${
            movie.poster_path
              ? ` <img
          src="https://image.tmdb.org/t/p/w500${movie.poster_path}"
            class="card-img-top"
              alt="${movie.title}"
            />`
              : `<img
          src="images/no-image.jpg"
            class="card-img-top"
              alt="${movie.title}"
            />`
          }
          </a>
          <div class="card-body">
            <h5 class="card-title">${movie.title}</h5>
            <p class="card-text">
              <small class="text-muted">Release: ${movie.release_date}</small>
            </p>
          </div>`;
    document.querySelector("#popular-movies").appendChild(div);
  });
}

async function displayMovieDetails() {
  let movieId;
  if (window.location.search.includes("=")) {
    movieId = window.location.search.split("=")[1];
  } else {
    movieId = window.location.search.split("?")[1];
  }
  const movie = await fetchFromApi(`movie/${movieId}`);
  displayBackgroundImage("movie", movie.backdrop_path);
  const div = document.createElement("div");
  div.innerHTML = `        <div class="details-top">
          <div>
            ${
              movie.poster_path
                ? `<img
              src="https://image.tmdb.org/t/p/w500${movie.poster_path}"
              class="card-img-top"
              alt="${movie.title}"
            />`
                : `<img
              src="images/no-image.jpg"
              class="card-img-top"
              alt="${movie.title}"
            />`
            }
          </div>
          <div>
            <h2>${movie.title}</h2>
            <p>
              <i class="fas fa-star text-primary"></i>
              ${movie.vote_average} / 10
            </p>
            <p class="text-muted">Release Date: ${movie.release_date}</p>
            <p>
              ${movie.overview}
            </p>
            <h5>Genres</h5>
            <ul class="list-group">
              ${
                movie.genres && movie.genres.length > 0
                  ? movie.genres
                      .map((genre) => `<li>${genre.name}</li>`)
                      .join("")
                  : "<li>No genres available</li>"
              }
            </ul>
            <a href="${
              movie.homepage
            }" target="_blank" class="btn">Visit Movie Homepage</a>
          </div>
        </div>
        <div class="details-bottom">
          <h2>Movie Info</h2>
          <ul>
            <li><span class="text-secondary">Budget:</span> ${
              movie.budget === 0
                ? `Movie budget not available`
                : `$ ${formatNumberWithCommas(movie.budget)}`
            }</li>
            <li><span class="text-secondary">Revenue:</span> ${
              movie.revenue === 0
                ? `Movie Revenue not available`
                : `$ ${formatNumberWithCommas(movie.revenue)}`
            }</li>
            <li><span class="text-secondary">Runtime:</span> ${
              movie.runtime
            } minutes</li>
            <li><span class="text-secondary">Status:</span> ${movie.status}</li>
          </ul>
          <h4>Production Companies</h4>
          <div class="list-group">
          ${
            movie.production_companies && movie.production_companies.length > 0
              ? movie.production_companies
                  .map((company) => `<div>${company.name}</div>`)
                  .join("")
              : "<div>No production companies available</div>"
          }
          </div>
        </div>`;
  document.querySelector("#movie-details").appendChild(div);
}

async function displayTvDetails() {
  const Tvid = window.location.search.split("?")[1];
  const tv = await fetchFromApi(`tv/${Tvid}`);
  displayBackgroundImage("tv", tv.backdrop_path);
  const div = document.createElement("div");
  div.innerHTML = `        <div class="details-top">
          <div>
            ${
              tv.poster_path
                ? `<img
              src="https://image.tmdb.org/t/p/w500${tv.poster_path}"
              class="card-img-top"
              alt="${tv.name}"
            />`
                : `<img
              src="images/no-image.jpg"
              class="card-img-top"
              alt="${tv.name}"
            />`
            }
          </div>
          <div>
            <h2>${tv.name}</h2>
            <p>
              <i class="fas fa-star text-primary"></i>
              ${tv.vote_average} / 10
            </p>
            <p class="text-muted">Release Date: ${tv.first_air_date}</p>
            <p>
              ${tv.overview}
            </p>
            <h5>Genres</h5>
            <ul class="list-group">
              ${tv.genres.map((genre) => `<li>${genre.name}</li>`).join("")}
            </ul>
            <a href="${
              tv.homepage
            }" target="_blank" class="btn">Visit Show Homepage</a>
          </div>
        </div>
        <div class="details-bottom">
          <h2>Show Info</h2>
          <ul>
            <li><span class="text-secondary">Number Of Episodes:</span> ${
              tv.number_of_episodes
            }</li>
            <li><span class="text-secondary">Number Of Seasons:</span> ${
              tv.number_of_seasons
            }</li>
            <li>
              <span class="text-secondary">Last Episode To Air:</span> ${
                tv.last_air_date
              }
            </li>
            <li><span class="text-secondary">Status:</span> ${tv.status}</li>
          </ul>
          <h4>Production Companies</h4>
          <div class="list-group">
  ${
    tv.production_companies && tv.production_companies.length > 0
      ? tv.production_companies
          .map(
            (company) => `<div class="list-group-item">${company.name}</div>`
          )
          .join("")
      : "<div class='list-group-item'>No production companies available</div>"
  }
</div>
        </div>
  `;
  document.querySelector("#show-details").appendChild(div);
}

async function displaySlider() {
  const { results } = await fetchFromApi("movie/now_playing");
  results.forEach((movie) => {
    const div = document.createElement("div");
    div.classList.add("swiper-slide");
    div.innerHTML = `
      <a href="movie-details.html?id=${movie.id}">
        <img src="https://image.tmdb.org/t/p/w500${movie.poster_path}" alt="${movie.title}" />
      </a>
      <h4 class="swiper-rating">
        <i class="fas fa-star text-secondary"></i> ${movie.vote_average} / 10
      </h4>
    `;
    document.querySelector(".swiper-wrapper").appendChild(div);
  });
  initSlider();
}

function initSlider() {
  const swiper = new Swiper(".swiper", {
    slidesPerView: 1,
    spaceBetween: 30,
    freeMode: true,
    loop: true,
    autoplay: {
      delay: 3000,
      disableOnInteraction: false,
    },
    breakpoints: {
      500: {
        slidesPerView: 2,
      },
      700: {
        slidesPerView: 3,
      },
      1200: {
        slidesPerView: 4,
      },
    },
  });
}

function formatNumberWithCommas(number) {
  return number.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
}

function displayBackgroundImage(type, image) {
  const div = document.createElement("div");
  div.classList.add("background-img");
  div.style.backgroundImage = `url("https://image.tmdb.org/t/p/original/${image}")`;
  div.style.backgroundSize = "cover";
  div.style.backgroundPosition = "center";
  div.style.backgroundRepeat = "no-repeat";
  div.style.height = "800px";
  div.style.width = "100vw";
  div.style.position = "absolute";
  div.style.top = 0;
  div.style.left = 0;
  div.style.zIndex = -1;
  div.style.opacity = 0.2;

  if (type === "movie") {
    document.querySelector("#movie-details").appendChild(div);
  } else {
    document.querySelector("#show-details").appendChild(div);
  }
}

//fetch from the moviedb api
async function fetchFromApi(endpoint) {
  const API_KEY = "76d21f288025ab7b66bcf5a213b530c6";
  const API_URL = "https://api.themoviedb.org/3/";
  const response = await fetch(
    `${API_URL}${endpoint}?api_key=${API_KEY}&language=en-US`
  );
  const data = await response.json();
  return data;
}

function highlightAllNavLinks() {
  const links = document.querySelectorAll(".nav-link");
  links.forEach((link) => {
    if (link.getAttribute("href") === global.currentWindow) {
      link.classList.add("active");
    }
  });
}

function init() {
  switch (global.currentWindow) {
    case "/":
      displayPopularMovies();
      displaySlider();
      break;
    case "/index.html":
      displaySlider();
      displayPopularMovies();
      break;
    case "/movie-details.html":
      displayMovieDetails();
      break;
    case "/search.html":
      console.log("Search");
      break;
    case "/shows.html":
      displayPopularTV();
      break;
    case "/tv-details.html":
      displayTvDetails();
      break;
    default:
      console.log("this shouldnt happen really ");
      break;
  }
  highlightAllNavLinks();
}

document.addEventListener("DOMContentLoaded", init);
