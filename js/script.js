const navbar = document.querySelector(".navbar");

window.addEventListener("scroll", () => {
  if (window.scrollY > 40) {
    navbar.classList.add("scrolled");
  } else {
    navbar.classList.remove("scrolled");
  }
});

const menuButton = document.querySelector(".menu-toggle");
const navLinks = document.querySelector(".nav-links");

if (menuButton) {
  menuButton.addEventListener("click", () => {
    navLinks.classList.toggle("show");
  });
}

document.querySelectorAll(".nav-links a").forEach((link) => {
  link.addEventListener("click", () => {
    if (navLinks) {
      navLinks.classList.remove("show");
    }
  });
});

const observer = new IntersectionObserver(
  (entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        entry.target.classList.add("visible");
      }
    });
  },
  {
    threshold: 0.2,
  },
);

document.querySelectorAll(".fade-up").forEach((element) => {
  observer.observe(element);
});

document.querySelectorAll('a[href^="#"]').forEach((anchor) => {
  anchor.addEventListener("click", function (e) {
    e.preventDefault();

    const target = document.querySelector(this.getAttribute("href"));

    if (target) {
      target.scrollIntoView({
        behavior: "smooth",
      });
    }
  });
});

// Homepage Article Preview
const previewGrid = document.querySelector(".preview-grid");

if (previewGrid) {
  fetch("data/articles.json")
    .then((response) => response.json())
    .then((data) => {
      data.sort((a, b) => new Date(b.date) - new Date(a.date));

      const latest = data.slice(0, 3);

      latest.forEach((article) => {
        previewGrid.innerHTML += `

                <article class="preview-card">

                    <img src="${article.image}" alt="${article.title}">

                    <div class="preview-content">

                        <span class="preview-category">
                            ${article.category}
                        </span>

                        <h3>${article.title}</h3>

                        <p>${article.description}</p>

                        <a href="pages/article.html?id=${article.id}">
                            Read More →
                        </a>

                    </div>

                </article>

                `;
      });
    });
}

//search bar
const search = document.querySelector("#search");
const clearBtn = document.querySelector("#clear-search");

if (search && clearBtn) {
  clearBtn.addEventListener("click", () => {
    search.value = "";
    search.dispatchEvent(new Event("input"));
    search.focus();
  });
}

document
  .querySelector(".contact-form form")
  .addEventListener("submit", function (e) {
    e.preventDefault(); 

    const form = e.target;
    const button = form.querySelector('button[type="submit"]');
    const originalButtonText = button.textContent;

    button.textContent = "Sending...";
    button.disabled = true;

    fetch("https://formspree.io/f/mnjkgqbo", {
      method: "POST",
      body: new FormData(form),
      headers: {
        Accept: "application/json",
      },
    })
      .then((response) => {
        if (response.ok) {
          alert("Message sent successfully!");
          form.reset();
        } else {
          alert("Oops! There was a problem submitting your form.");
        }
      })
      .catch((error) => {
        alert("Error: Could not connect to the server.");
      })
      .finally(() => {
        button.textContent = originalButtonText;
        button.disabled = false;
      });
  });
