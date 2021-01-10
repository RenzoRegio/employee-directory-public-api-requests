const gallery = document.querySelector("#gallery");

//Fetch Data
fetch("https://randomuser.me/api/?nat=us&page=1&results=12")
  .then((response) => response.json())
  .then((data) => {
    data.results.forEach((profile) => {
      //Create profile cards
      createGallery(profile);
      //Initiate Modal Card
      createModalCard(profile, data);
    });
    search(data);
  });

// Next

function nextModalCard(profile, data) {
  const nextBtn = document.querySelector("#modal-next");
  nextBtn.addEventListener("click", () => {
    const modalContainer = document.querySelector(".modal-container");
    modalContainer.remove();
    for (let i = 0; i < data.results.length; i++) {
      if (data.results[i] === profile) {
        let profileCard = data.results[i - 1];
        modalCardTemplate(profileCard, data);
        closeModalCard();
      }
    }
  });
}

// Previous

function previousModalCard(profile, data) {
  const previousBtn = document.querySelector("#modal-prev");
  previousBtn.addEventListener("click", () => {
    const modalContainer = document.querySelector(".modal-container");
    modalContainer.remove();
    for (let i = 0; i < data.results.length; i++) {
      if (data.results[i] === profile) {
        let profileCard = data.results[i + 1];
        modalCardTemplate(profileCard, data);
        closeModalCard();
      }
    }
  });
}
// Create Gallery Objects

function createGallery(profile) {
  gallery.insertAdjacentHTML(
    "afterbegin",
    `
    <div class="card">
                <div class="card-img-container">
                    <img class="card-img" src="${profile.picture.large}" alt="profile picture">
                </div>
                <div class="card-info-container">
                    <h3 id="name" class="card-name cap">${profile.name.first} ${profile.name.last}</h3>
                    <p class="card-text">${profile.email}</p>
                    <p class="card-text cap">${profile.location.city}, ${profile.location.state}</p>
                </div>
            </div>
  `
  );
}

// Modal Card Template

function modalCardTemplate(profile, data) {
  const number = formatNumber(profile.cell);
  const birthday = formatBirthday(profile.dob.date);
  gallery.insertAdjacentHTML(
    "beforeend",
    `<div class="modal-container">
      <div class="modal">
          <button type="button" id="modal-close-btn" class="modal-close-btn"><strong>X</strong></button>
          <div class="modal-info-container">
              <img class="modal-img" src="${profile.picture.large}" alt="profile picture">
              <h3 id="name" class="modal-name cap">${profile.name.first} ${profile.name.last}</h3>
              <p class="modal-text">${profile.email}</p>
              <p class="modal-text cap">${profile.location.city}</p>
              <hr>
              <p class="modal-text">${number}</p>
              <p class="modal-text">${profile.location.street.number} ${profile.location.street.name}, ${profile.location.city}, ${profile.location.state} ${profile.location.postcode}</p>
              <p class="modal-text">Birthday: ${birthday}</p>
          </div>
      </div> 
      <div class="modal-btn-container">
                    <button type="button" id="modal-prev" class="modal-prev btn">Prev</button>
                    <button type="button" id="modal-next" class="modal-next btn">Next</button>
                </div>
            </div>
      `
  );
  nextModalCard(profile, data);
  previousModalCard(profile, data);
}

//Close Modal Card

function closeModalCard() {
  const closeModalBtn = document.querySelector("#modal-close-btn");
  const modalContainer = document.querySelector(".modal-container");
  if (closeModalBtn) {
    closeModalBtn.addEventListener("click", (e) => {
      modalContainer.remove();
    });
  }
}

//

function createModalCard(profile, data) {
  const card = document.querySelector(".card");
  card.addEventListener("click", (e) => {
    modalCardTemplate(profile, data);
    closeModalCard();
  });
}

// Format Phone Number to (123) 456-7890

function formatNumber(data) {
  let number = data.replace(/\D/g, "");
  if (number.length < 10) {
    for (let i = number.length; i < 10; i++) {
      number += i;
    }
  } else if (number.length > 10) {
    number = number.slice(0, 10);
  }
  const regex = /^(\d{3})(\d{3})(\d{4})$/;
  const replace = "($1) $2-$3";
  return number.replace(regex, replace);
}

// Format birthday to mm/dd/year

function formatBirthday(data) {
  const date = data.replace(/\D/g, "").slice(0, 8);
  const regex = /^(\d{4})(\d{2})(\d{2})$/;
  const replace = "$2/$3/$1";
  return date.replace(regex, replace);
}

const searchContainer = document.querySelector(".search-container");
const form = document.createElement("form");
form.action = "#";

const searchInput = document.createElement("input");
searchInput.id = "search-input";
searchInput.className = "search-input";
searchInput.placeholder = "Search by first name...";
form.appendChild(searchInput);

const submitBtn = document.createElement("input");
submitBtn.type = "submit";
submitBtn.value = "Search";
submitBtn.id = "search-submit";
submitBtn.className = "search-submit";
form.appendChild(submitBtn);

searchContainer.appendChild(form);

const searchValue = searchInput.value.toLowerCase();

function search(data) {
  form.addEventListener("submit", () => {
    const searchValue = searchInput.value;
    for (let i = 0; i < data.results.length; i++) {
      const names = data.results[i].name.first.toLowerCase();
      if (names === searchValue.toLowerCase()) {
        searchGallery(data.results[i], data);
      }
    }
  });
}

//
// else {
//         gallery.innerHTML = "<h1> No results.. Going back home! </h1>";
//         window.setTimeout(() => {
//           createGallery(data.results[i]);
//           createModalCard(data.results[i], data);
//           const h1 = document.querySelector("#gallery > h1");
//           h1.remove();
//         }, 3000);
//       }

function searchGallery(profile, data) {
  gallery.innerHTML = `
    <div class="card">
                <div class="card-img-container">
                    <img class="card-img" src="${profile.picture.large}" alt="profile picture">
                </div>
                <div class="card-info-container">
                    <h3 id="name" class="card-name cap">${profile.name.first} ${profile.name.last}</h3>
                    <p class="card-text">${profile.email}</p>
                    <p class="card-text cap">${profile.location.city}, ${profile.location.state}</p>
                </div>
            </div>
  `;
  searchModal(profile, data);
}

function searchModal(profile, data) {
  const card = document.querySelector(".card");
  card.addEventListener("click", (e) => {
    searchModalCard(profile);
    closeModalCard();
  });
  searchInput.value = "";
}

function searchModalCard(profile) {
  const number = formatNumber(profile.cell);
  const birthday = formatBirthday(profile.dob.date);
  gallery.insertAdjacentHTML(
    "beforeend",
    `<div class="modal-container">
      <div class="modal">
          <button type="button" id="modal-close-btn" class="modal-close-btn"><strong>X</strong></button>
          <div class="modal-info-container">
              <img class="modal-img" src="${profile.picture.large}" alt="profile picture">
              <h3 id="name" class="modal-name cap">${profile.name.first} ${profile.name.last}</h3>
              <p class="modal-text">${profile.email}</p>
              <p class="modal-text cap">${profile.location.city}</p>
              <hr>
              <p class="modal-text">${number}</p>
              <p class="modal-text">${profile.location.street.number} ${profile.location.street.name}, ${profile.location.city}, ${profile.location.state} ${profile.location.postcode}</p>
              <p class="modal-text">Birthday: ${birthday}</p>
          </div>
      </div> 
      `
  );
}
