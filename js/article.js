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

  const sortedArticles = [...articles].sort(
    (a, b) => new Date(b.date) - new Date(a.date),
  );

  sortedArticles.forEach((article) => {
    articleContainer.innerHTML += `

        <article class="article-card" data-category="${article.category}">

    <img src="${article.image}" alt="${article.title}">

    <div class="article-card-content">

        <span class="category">${article.category}</span>

        <h3>${article.title}</h3>

        <div class="article-meta">
            <span>${article.author}</span>
            <span>•</span>
            <span>${formatDate(article.date)}</span>
        </div>

        <p>${article.description}</p>

        <a
            href="article.html?id=${article.id}"
            class="read-more">
            Read Article →
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
        if (article) {
          showArticle(article);
          displayRelatedArticles(article, data);
        }
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
    } else if (section.type === "quote") {
      articleContent.innerHTML += `
        <blockquote>${section.text}</blockquote>
    `;
    } else if (section.type === "image") {
      articleContent.innerHTML += `
        <img
            src="${section.src}"
            alt="${section.alt}"
            class="article-inline-image">
    `;
    } else if (section.type === "callout") {
      articleContent.innerHTML += `
    <div class="callout">

      <h4>${section.title}</h4>

      <p>${section.text}</p>

    </div>
  `;
    } else if (section.type === "quote") {
      articleContent.innerHTML += `
    <blockquote>
      <p>${section.text}</p>
      ${section.author ? `<cite>— ${section.author}</cite>` : ""}
    </blockquote>
  `;
    }
  });
}

// FORMAT DATE
function formatDate(dateString) {
  const date = new Date(dateString);

  return date.toLocaleDateString("en-US", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });
}

//RELATED ARTICLES
function displayRelatedArticles(currentArticle, allArticles) {
  const container = document.querySelector("#related-articles");

  if (!container) return;

  const others = allArticles.filter(
    (article) => article.id !== currentArticle.id,
  );

  let related = others.filter(
    (article) => article.category === currentArticle.category,
  );

  related.sort((a, b) => new Date(b.date) - new Date(a.date));

  related = related.slice(0, 3);

  if (related.length < 3) {
    const remaining = others
      .filter(
        (article) =>
          article.category !== currentArticle.category &&
          !related.some((r) => r.id === article.id),
      )
      .sort((a, b) => new Date(b.date) - new Date(a.date));

    related = related.concat(remaining.slice(0, 3 - related.length));
  }

  container.innerHTML = "";

  related.forEach((article) => {
    container.innerHTML += `
            <article class="article-card">

                <img src="${article.image}" alt="${article.title}">

                <div class="article-card-content">

                    <span class="category">
                        ${article.category}
                    </span>

                    <h3>${article.title}</h3>

                    <div class="article-meta">
                      <span>${article.author}</span>
                      <span>•</span>
                      <span>${formatDate(article.date)}</span>
                    </div>

                    <p>
                        ${article.description}
                    </p>

                    <a
                        href="article.html?id=${article.id}"
                        class="read-more">
                        Read Article →
                    </a>

                </div>

            </article>
        `;
  });
}
