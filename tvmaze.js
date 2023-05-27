"use strict";

const MISSING_IMAGE_URL = "https://tinyurl.com/missing-tv";

const $showsList = $("#showsList");
const $episodesArea = $("#episodesArea");
const $searchForm = $("#searchForm");
const $episodeBtn = $(".Show-getEpisodes");

/** Given a search term, search for tv shows that match that query.
 *
 *  Returns (promise) array of show objects: [show, show, ...].
 *    Each show object should contain exactly: {id, name, summary, image}
 *    (if no image URL given by API, put in a default image URL)
 */

async function getShowsByTerm(term) {
  // ADD: Remove placeholder & make request to TVMaze search shows API.
  $("#searchForm-term").attr("required", "");
  const res = await axios.get(`https://api.tvmaze.com/search/shows?q=${term}`);
  return res.data;
}
/** Given list of shows, create markup for each and to DOM */

function populateShows(shows) {
  $showsList.empty();
  // console.log(shows);
  for (let show of shows) {
    const $show = $(`<div data-show-id = "${show.show.id}" class="Show col-md-12 col-lg-6 mb-4">
         <div class="media">
           <img src = "${show.show.image.medium}" alt="${show.show.name}" class="w-25 me-3">
           <div class="media-body">
             <h5 class="text-primary">${show.show.name}</h5>
             <div><small>${show.show.summary}</small></div>
             <button class="btn btn-outline-light btn-sm Show-getEpisodes">
               Episodes
             </button>
           </div>
         </div>
       </div>`);
    $showsList.append($show);
  }
}

/** Handle search form submission: get shows from API and display.
 *    Hide episodes area (that only gets shown if they ask for episodes)
 */

async function searchForShowAndDisplay() {
  const term = $("#searchForm-term").val();
  const shows = await getShowsByTerm(term);

  $episodesArea.hide();
  populateShows(shows);
}

$searchForm.on("submit", async function (evt) {
  evt.preventDefault();
  try {
    await searchForShowAndDisplay();
  } catch (error) {
    console.error(error);
  }
});

/** Given a show ID, get from API and return (promise) array of episodes:
 *      { id, name, season, number }
 */
$showsList.on("click", ".Show-getEpisodes", getEpisodesAndDisplay);

async function getEpisodesAndDisplay(evt){
  const showId = $(evt.target).closest(".Show").data("show-id");
  const episodesInfo = await getEpisodes(showId);
  populateEpisodes(episodesInfo);
}

async function getEpisodes(id) {
  const res = await axios.get(`http://api.tvmaze.com/shows/${id}/episodes`);
  return res.data;
};


/** Write a clear docstring for this function... */

function populateEpisodes(episodes) {
  $episodesArea.empty();

  for (let episode of episodes) {
    const $item = $(
      `<li>
         ${episode.name}
         (season ${episode.season}, episode ${episode.number})
       </li>
      `);

    $episodesArea.append($item);
  }

  $episodesArea.show();
}

