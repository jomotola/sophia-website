// SELECTOR
const articleContainer = document.querySelector(".articles-grid");
const searchBar = document.querySelector("#search");
const filterButtons = document.querySelectorAll(".filter-btn");
const articleTitle = document.querySelector("#article-title");

// LOAD ARTICLES (articles.html)
if (articleContainer) {
  fetch("../data/articles.json")
    .then((response) => response.json())
    .then((data) => {
      displayArticles(data);
      setupFilters();
      setupSearch();
    })
    .catch((error) => console.error(error));
}

// DISPLAY ARTICLES
function displayArticles(articles) {
  articleContainer.innerHTML = "";

  articles.forEach((article) => {
    articleContainer.innerHTML += `

        <article
            class="article-card"
            data-category="${article.category}">

            <img src="${article.image}" alt="${article.title}">

            <div class="article-content">

                <span class="category">
                    ${article.category}
                </span>

                <h3>${article.title}</h3>

                <p>${article.description}</p>

                <a
                    href="article.html?id=${article.id}"
                    class="read-more">

                    Read More →

                </a>

            </div>

        </article>

        `;
  });
}

// SEARCH BAR
function setupSearch() {
  if (!searchBar) return;

  searchBar.addEventListener("input", (e) => {
    const value = e.target.value.toLowerCase();

    document.querySelectorAll(".article-card").forEach((card) => {
      const text = card.innerText.toLowerCase();

      card.style.display = text.includes(value) ? "" : "none";
    });
  });
}

// CATEGORY FILTERS
function setupFilters() {
  filterButtons.forEach((button) => {
    button.addEventListener("click", () => {
      filterButtons.forEach((btn) => btn.classList.remove("active"));

      button.classList.add("active");

      const category = button.dataset.category;

      document.querySelectorAll(".article-card").forEach((card) => {
        const articleCategory = card.dataset.category;

        if (category === "All" || articleCategory === category) {
          card.style.display = "";
        } else {
          card.style.display = "none";
        }
      });
    });
  });
}

// LOAD SINGLE ARTICLE (article.html)

if (articleTitle) {
  const params = new URLSearchParams(window.location.search);

  const id = params.get("id");

  fetch("../data/articles.json")
    .then((response) => response.json())
    .then((data) => {
      const article = data.find((a) => a.id == id);

      if (article) {
        showArticle(article);
      }
    })
    .catch((error) => console.error(error));
}

// DISPLAY SINGLE ARTICLE
function showArticle(article) {
  document.querySelector("#article-title").textContent = article.title;

  document.querySelector("#article-author").textContent = article.author;

  document.querySelector("#article-date").textContent = article.date;

  document.querySelector("#article-category").textContent = article.category;

  document.querySelector("#article-image").src = article.image;

  const articleContent = document.querySelector("#article-content");

  articleContent.innerHTML = "";

  article.content.forEach((section) => {
    if (section.type === "heading") {
      articleContent.innerHTML += `
                <h2>${section.text}</h2>
            `;
    } else if (section.type === "paragraph") {
      articleContent.innerHTML += `
                <p>${section.text}</p>
            `;
    } else if (section.type === "list") {
      let list = "<ul>";

      section.items.forEach((item) => {
        list += `<li>${item}</li>`;
      });

      list += "</ul>";

      articleContent.innerHTML += list;
    }
  });
}
