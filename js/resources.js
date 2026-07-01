// SELECTORS
const resourceContainer = document.querySelector("#resource-container");
const searchInput = document.querySelector("#search");

const trackButtons = document.querySelectorAll(".track-btn");
const stemButtons = document.querySelectorAll(".stem-btn");

const stemFilters = document.querySelector("#stem-subfilters");

let resources = [];

let currentTrack = "All";
let currentStem = "All";
let currentSearch = "";
// LOAD JSON
fetch("../data/resources.json")
  .then((response) => response.json())
  .then((data) => {
    resources = data;

    displayResources(resources);

    setupTrackFilters();
    setupStemFilters();
    setupSearch();
  })
  .catch((error) => console.error(error));
// DISPLAY CARDS
function displayResources(list) {
  resourceContainer.innerHTML = "";

  if (list.length === 0) {
    resourceContainer.innerHTML = `
      <p class="no-results">
        No resources found.
      </p>
    `;
    return;
  }

  list.forEach((resource) => {
    resourceContainer.innerHTML += `
    
      <div class="resource-card">

          <div class="resource-icon">

              <i class="${resource.icon}"></i>

          </div>

          <span class="resource-track">
              ${resource.track}
          </span>

          <h3>${resource.title}</h3>

          <p>${resource.description}</p>

          <a
            href="${resource.link}"
            target="_blank"
            rel="noopener noreferrer"
            class="resource-btn">
                Open PDF
        </a>

      </div>

    `;
  });
}
// FILTER EVERYTHING
function applyFilters() {
  let filtered = [...resources];

  // Search
  if (currentSearch !== "") {
    filtered = filtered.filter((resource) =>
      (resource.title + resource.description + resource.track)
        .toLowerCase()
        .includes(currentSearch),
    );
  }

  // Main Track
  if (currentTrack !== "All") {
    filtered = filtered.filter((resource) => resource.track === currentTrack);
  }

  // STEM Subcategory
  if (currentTrack === "STEM" && currentStem !== "All") {
    filtered = filtered.filter(
        resource => resource.subcategory === currentStem
    );
}

  displayResources(filtered);
}
// SEARCH
function setupSearch() {
  if (!searchInput) return;

  searchInput.addEventListener("input", (e) => {
    currentSearch = e.target.value.toLowerCase();

    applyFilters();
  });
}

// MAIN TRACK FILTERS
function setupTrackFilters() {
  trackButtons.forEach((button) => {
    button.addEventListener("click", () => {
      trackButtons.forEach((btn) => btn.classList.remove("active"));

      button.classList.add("active");

      currentTrack = button.dataset.track;

      currentStem = "All";

      // Reset STEM buttons
      stemButtons.forEach((btn) => btn.classList.remove("active"));

      stemButtons[0].classList.add("active");

      // Show STEM options only when STEM selected
      if (currentTrack === "STEM") {
        stemFilters.style.display = "flex";
      } else {
        stemFilters.style.display = "none";
      }

      applyFilters();
    });
  });
}

// STEM SUBCATEGORIES
function setupStemFilters() {
  if (!stemButtons.length) return;

  stemFilters.style.display = "none";

  stemButtons.forEach((button) => {
    button.addEventListener("click", () => {
      stemButtons.forEach((btn) => btn.classList.remove("active"));

      button.classList.add("active");

      currentStem = button.dataset.subcategory;

      applyFilters();
    });
  });
}
