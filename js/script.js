const global = {
  currentWindow: window.location.pathname,
  queryString: window.location.search,
  api: {
    apiKey: "76d21f288025ab7b66bcf5a213b530c6",
    apiUrl: "https://api.themoviedb.org/3/",
  },
  search: {
    type: "",
    term: "",
    query: "",
    page: 1,
    totalPages: 1,
    totalResults: 0,
  },
};
//display popular movies
function showSpinner() {
  document.querySelector(".spinner").classList.add("show");
}

function hideSpinner() {
  document.querySelector(".spinner").classList.remove("show");
}

async function searchForMedia() {
  const urlPath = new URLSearchParams(global.queryString);
  global.search.type = urlPath.get("type");
  global.search.term = urlPath.get("search-term");
  if (global.search.term !== "" && global.search.term !== null) {
    const { results } = await SearchFromApi();
    addResultsToDom(results, global.search.type);
  } else {
    getAlert("Please type a valid name!");
  }
}

async function addResultsToDom(results, type) {
  document.querySelector("#search-results").innerHTML = "";
  document.querySelector("#search-results-heading").innerHTML = "";
  document.querySelector("#pagination").innerHTML = "";
  if (type === "movie") {
    const { page, total_pages, total_results } = await SearchFromApi();
    global.search.page = page;
    global.search.totalPages = total_pages;
    global.search.totalResults = total_results;
    const heading = document.querySelector("#search-results-heading");
    const h2 = document.createElement("h2");
    h2.innerText = `Showing ${results.length} out of ${global.search.totalResults} results for ${global.search.term}`;
    heading.appendChild(h2);
    results.forEach((result) => {
      const div = document.createElement("div");
      div.classList.add("card");
      div.innerHTML = `
        <a href="/movie-details.html?${result.id}">
          ${
            result.poster_path
              ? `<img src="https://image.tmdb.org/t/p/w500${result.poster_path}" class="card-img-top" alt="${result.title}" />`
              : `<img
                  src="images/no-image.jpg"
                  class="card-img-top"
                  alt="${result.title}"
                 />`
          }
        </a>
        <div class="card-body">
          <h5 class="card-title">${result.title}</h5>
          <p class="card-text">
            <small class="text-muted">Release: ${result.release_date}</small>
          </p>
        </div>
    `;
      document.querySelector("#search-results").appendChild(div);
    });
  } else {
    const { page, total_pages, total_results } = await SearchFromApi();
    global.search.page = page;
    global.search.totalPages = total_pages;
    global.search.totalResults = total_results;
    const heading = document.querySelector("#search-results-heading");
    const h2 = document.createElement("h2");
    h2.innerText = `Showing ${results.length} out of ${global.search.totalResults} results for ${global.search.term}`;
    heading.appendChild(h2);
    results.forEach((result) => {
      const div = document.createElement("div");
      div.classList.add("card");
      div.innerHTML = `
        <a href="/tv-details.html?${result.id}">
          ${
            result.poster_path
              ? `<img src="https://image.tmdb.org/t/p/w500${result.poster_path}" class="card-img-top" alt="${result.name}" />`
              : `<img
                  src="images/no-image.jpg"
                  class="card-img-top"
                  alt="${result.name}"
                 />`
          }
        </a>
        <div class="card-body">
          <h5 class="card-title">${result.name}</h5>
          <p class="card-text">
            <small class="text-muted">Release: ${result.first_air_date}</small>
          </p>
        </div>
    `;
      document.querySelector("#search-results").appendChild(div);
    });
  }
  displayPagination();
}

function displayPagination() {
  const div = document.createElement("div");
  div.classList.add("pagination");
  div.innerHTML = `
  <button class="btn btn-primary" id="prev">Prev</button>
  <button class="btn btn-primary" id="next">Next</button>
  <div class="page-counter">Page ${global.search.page} of ${global.search.totalPages}</div>
  `;
  document.querySelector("#pagination").appendChild(div);

  //disable prev if page is on 1
  if (global.search.page === 1) {
    document.querySelector("#prev").disabled = true;
  }
  //disbale next if page is at last
  if (global.search.page === global.search.totalPages) {
    document.querySelector("#next").disabled = true;
  }
  //making next work
  document.querySelector("#next").addEventListener("click", async () => {
    global.search.page++;
    const { results } = await SearchFromApi();
    addResultsToDom(results, global.search.type);
  });
  //making prev work
  document.querySelector("#prev").addEventListener("click", async () => {
    global.search.page--;
    const { results } = await SearchFromApi();
    addResultsToDom(results, global.search.type);
  });
}

function getAlert(message) {
  const div = document.createElement("div");
  div.classList.add("alert");
  div.innerText = message;
  document.querySelector("#alert").appendChild(div);
  setTimeout(() => {
    document.querySelector("#alert").removeChild(div);
  }, 3000);
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
  const { results } = await fetchFromApi("movie/popular");
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
  // let movieYear = movie.release_date.split("-")[0];

  // let titleArr = movie.title
  //   .toLowerCase()
  //   .replace(/[^a-z0-9 ]/g, "") // remove anything that's not a letter, digit, or space
  //   .split(" ");

  // titleArr.push(movieYear);
  //<a href="https://yts.mx/movies/${title}" target="_blank" class="btn">Yts Link</a>

  // const title = titleArr.join("-");
  // console.log(title);
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
          <ul>${
            movie.budget === 0
              ? ``
              : `<li><span class="text-secondary">Budget:</span> ${formatNumberWithCommas(
                  movie.budget
                )}
            </li>`
          }
            
          ${
            movie.revenue === 0
              ? ``
              : `<li><span class="text-secondary">Revenue:</span> ${formatNumberWithCommas(
                  movie.revenue
                )}
          </li>`
          }
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

  const seasonButtonsContainer = document.getElementById("season-buttons");
  tv.seasons.forEach((season) => {
    if (season.season_number !== 0) {
      // ignore special/unknown seasons
      const btn = document.createElement("button");
      btn.textContent = `Season ${season.season_number}`;
      btn.classList.add("btn", "btn-primary", "m-1", "season-button");

      btn.addEventListener("click", () => {
        // 1. Remove active class from all buttons
        document
          .querySelectorAll("#season-buttons .season-button")
          .forEach((b) => {
            b.classList.remove("season-button-active");
          });

        // 2. Add active class to this button
        btn.classList.add("season-button-active");

        // 3. Load episodes
        displaySeasonEpisodes(Tvid, season.season_number);
      });

      seasonButtonsContainer.appendChild(btn);
    }
  });
}

async function displaySeasonEpisodes(showId, seasonNumber) {
  const episodesList = document.getElementById("episodes-list");
  episodesList.innerHTML = `<p>Loading episodes...</p>`;

  const seasonData = await fetchFromApi(`tv/${showId}/season/${seasonNumber}`);

  episodesList.innerHTML = ""; // clear loading text

  seasonData.episodes.forEach((ep) => {
    const epDiv = document.createElement("div");
    epDiv.classList.add("card", "mb-2", "d-flex", "flex-row");

    const imgSrc = ep.still_path
      ? `https://image.tmdb.org/t/p/w500${ep.still_path}`
      : "images/no-image.jpg";

    epDiv.innerHTML = `
      <div class="card-body">
        <h5 class="card-title">Episode ${ep.episode_number}: ${ep.name}</h5>
        <div id="episode-data-container">
        <img src="${imgSrc}" alt="${
      ep.name
    }" style="width: 200px; object-fit: cover;">
        <p class="card-text-episode">${
          ep.overview || "No description available."
        }</p>
        </div>
        <p>
        <i class="fas fa-star episode-star"></i> ${ep.vote_average.toFixed(
          1
        )} / 10
      </p>
        <small class="text-muted">Air Date: ${ep.air_date || "N/A"}</small>
      </div>
    `;
    episodesList.appendChild(epDiv);
  });
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

//search api
async function SearchFromApi() {
  const API_KEY = global.api.apiKey;
  const API_URL = global.api.apiUrl;
  showSpinner();
  const response = await fetch(
    `${API_URL}search/${global.search.type}?api_key=${API_KEY}&language=en-US&query=${global.search.term}&page=${global.search.page}`
  );
  const data = await response.json();
  hideSpinner();
  return data;
}

//fetch from the moviedb api
async function fetchFromApi(endpoint) {
  const API_KEY = global.api.apiKey;
  const API_URL = global.api.apiUrl;
  showSpinner();
  const response = await fetch(
    `${API_URL}${endpoint}?api_key=${API_KEY}&language=en-US`
  );
  const data = await response.json();
  hideSpinner();
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
      searchForMedia();
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
