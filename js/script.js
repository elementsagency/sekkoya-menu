const menuLinks = document.querySelectorAll(".menu a");
const productsContainer = document.getElementById("products");
const menuTitle = document.querySelector(".section-title");

// Initialize language and category
let currentLanguage = 'en'; // Default language
let currentCategory = 'salads'; // Default category
let currentLabels = {}; // To store labels from JSON

// Function to load products and labels based on selected language and category
function loadProducts(language, category) {
  fetch(`./json/productsData_${language}.json`)
    .then(response => {
      if (!response.ok) {
        throw new Error('Network response was not ok');
      }
      return response.json();
    })
    .then(data => {
      currentLabels = data.labels || {}; // Fetch labels for the selected language
      const staticTexts = data.staticTexts || {}; // Fetch static text translations
      updateTranslations(currentLabels, staticTexts); // Update the UI with translations
      showProducts(data, category); // Show products in the selected category
    })
    .catch(error => {
      console.error("Error loading products:", error);
    });
}

// Function to display products
function showProducts(data, category) {
  productsContainer.innerHTML = ""; // Clear existing products

  if (data[category]) {
    data[category].forEach(product => {
      const card = document.createElement("div");
      card.className = "card";
      card.innerHTML = `
        <img src="${product.img}" alt="">
        <div class="card-description">
          <p class="title">${product.title}</p>
          <p class="description">${product.description}</p>
          <p class="price">${product.price}</p>
        </div>
      `;
      productsContainer.appendChild(card);
    });
  } else {
    productsContainer.innerHTML = "<p>No products available in this category.</p>";
  }
}

// Function to update UI with translated labels and static text
function updateTranslations(labels, staticTexts) {
  if (!labels || !staticTexts) return;

  // Update section title
  menuTitle.textContent = labels.menuTitle;

  // Update category links
  menuLinks.forEach(link => {
    const category = link.getAttribute("data-category");
    link.textContent = labels[category] || category;
  });

  // Update static text elements
  const welcomeTextEl = document.getElementById("welcome-text");
  const exploreTextEl = document.getElementById("explore-text");
  const viewMenuInEl = document.getElementById("view-menu-in");

  if (welcomeTextEl) welcomeTextEl.textContent = staticTexts.welcome || "";
  if (exploreTextEl) exploreTextEl.textContent = staticTexts.explore || "";
  if (viewMenuInEl) viewMenuInEl.textContent = staticTexts.viewMenuIn || "";
}

// Handle language switch using dropdown
const languageSelector = document.getElementById('language-selector');
languageSelector.addEventListener("change", (e) => {
  currentLanguage = e.target.value;
  localStorage.setItem('language', currentLanguage);
  loadProducts(currentLanguage, currentCategory);
});

// Handle category switch
menuLinks.forEach(link => {
  link.addEventListener("click", (e) => {
    e.preventDefault();
    menuLinks.forEach(l => l.classList.remove("active"));
    link.classList.add("active");
    currentCategory = link.getAttribute("data-category");
    loadProducts(currentLanguage, currentCategory);
  });
});

// Initial page load
window.addEventListener("load", () => {
  // const savedLanguage = localStorage.getItem('language');
  // if (savedLanguage) {
  //   currentLanguage = savedLanguage;
  // }
  loadProducts(currentLanguage, currentCategory);
});