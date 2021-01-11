const gallery = document.querySelector("#gallery");
const title = document.querySelector(".header-text-container > h1");
const searchContainer = document.querySelector(".search-container");

/**
 * Retrieves/fetches the data from the given API and calls the necessary functions to display the gallery and asynchronously perform other functions once fired.
 */

fetch("https://randomuser.me/api/?nat=us&page=1&results=12")
  .then(checkStatus)
  .then((response) => response.json())
  .then((data) => {
    data.results.forEach((profile) => {
      createGallery(profile);
      modalCard(profile, data);
    });
    performSearch(data);
  })
  .catch((error) => console.log(Error(`There was a ${error}`)));

/**
 * Checks whether the response object from the fetch method is ok - meaning if it was fetched successfully.
 * @param {object} response - The response object passed on from the fetch method.
 */

function checkStatus(response) {
  if (response.ok) {
    return Promise.resolve(response);
  } else {
    return Promise.reject(new Error(response.statusText));
  }
}
/**
 * Creates the gallery by iterating over each profile object retrieved from the API while returning individidual profile cards.
 * @param {object} profile - An object retrieved from the API containing information regarding the employee.
 */

function createGallery(profile) {
  gallery.insertAdjacentHTML("afterbegin", galleryTemplate(profile));
}

/**
 * Template used to create each profile card.
 * @param {object} profile - An object retrieved from the API containing information regarding the employee.
 */

function galleryTemplate(profile) {
  const template = `<div class="card">
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
  return template;
}

/**
 * Containing all the functions relating to the modal/profile card - Once called, modalCard() creates a modal/profile card and the configurations within this function are executed depending on the user's actions.
 * @param {object} profile - An object retrieved from the API containing information regarding the employee.
 * @param {object} data - An object containing the .results array which is eventually iterated over to test conditional statements and access specific objects and/or values.
 * @param {boolean} search - A boolean that is passed on by the searchGallery() function. Configured to determine if the profile/modal card displayed will have the element with .modal-btn-container class.
 */

function modalCard(profile, data, search) {
  createModalCard(profile, data, search);

  function createModalCard(profile, data, search) {
    const card = document.querySelector(".card");
    card.addEventListener("click", (e) => {
      modalCardTemplate(profile, data, search);
      closeModalCard();
    });
  }

  function modalCardTemplate(profile, data, search) {
    //Formats the employee's cellphone number to (123) 456-7890.
    function formatNumber(data) {
      let number = data.replace(/\D/g, "");
      //Since some of the numbers are less than 10 digits, this if statement adds a digit or digits to a number less than 10 to fulfill the number format requirement.
      if (number.length < 10) {
        for (let i = number.length; i < 10; i++) {
          number += i;
        }
        //Since some of the numbers are greater than 10 digits, this else if statement limits the cell number to 10 digits to be able to fulfill the number format requirement.
      } else if (number.length > 10) {
        number = number.slice(0, 10);
      }
      const regex = /^(\d{3})(\d{3})(\d{4})$/;
      const replace = "($1) $2-$3";
      return number.replace(regex, replace);
    }

    //Formats the employee's birthday to MM/DD/YEAR.
    function formatBirthday(data) {
      const date = data.replace(/\D/g, "").slice(0, 8);
      const regex = /^(\d{4})(\d{2})(\d{2})$/;
      const replace = "$2/$3/$1";
      return date.replace(regex, replace);
    }

    const number = formatNumber(profile.cell);
    const birthday = formatBirthday(profile.dob.date);
    const firstProfile = data.results[11].name.first;
    const lastProfile = data.results[0].name.first;

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

    //Removes previous modal button on the first profile object in the .results array
    if (firstProfile === profile.name.first) {
      const prev = document.querySelector("#modal-prev");
      prev.style.display = "none";

      //Removes next modal button on the last profile object in the .results array
    } else if (lastProfile === profile.name.first) {
      const next = document.querySelector("#modal-next");
      next.style.display = "none";
    }

    //Removes the modal button container (containing next and previous buttons) when a user searches for a name - since only one profile shows up.
    if (search) {
      searchInput.value = "";
      const modal = document.querySelector(".modal-btn-container");
      modal.style.display = "none";
    }

    //Navigates through all the modal/profile cards whenever a user clicks on next or previous buttons.
    navigateModalCard(profile, data, "next", "minus");
    navigateModalCard(profile, data, "prev", "plus");
  }

  function closeModalCard() {
    const closeModalBtn = document.querySelector("#modal-close-btn");
    const modalContainer = document.querySelector(".modal-container");
    if (closeModalBtn) {
      closeModalBtn.addEventListener("click", (e) => {
        modalContainer.remove();
      });
    }
  }

  function navigateModalCard(profile, data, btn, operator) {
    const modalContainer = document.querySelector(".modal-container");
    btn = document.querySelector(`#modal-${btn}`);
    btn.addEventListener("click", () => {
      modalContainer.remove();
      for (let i = 0; i < data.results.length; i++) {
        if (data.results[i] === profile) {
          let modalCard;
          if (operator === "minus") {
            modalCard = data.results[i - 1];
          } else if (operator === "plus") {
            modalCard = data.results[i + 1];
          }
          modalCardTemplate(modalCard, data);
          closeModalCard();
        }
      }
    });
  }
}

// Adds the search bar on the page.
searchContainer.innerHTML = `
<form action="#" method="get">
  <input type="search" id="search-input" class="search-input" placeholder="Search by name...">
  <input type="submit" value="&#x1F50D;" id="search-submit" class="search-submit">
</form> 
`;

const form = searchContainer.firstElementChild;
const searchInput = document.querySelector("#search-input");

/**
 * Contains all the actions/functions relating to the search bar. This function asynchronously runs once the page loads and listens for a "submit" event on the form element.
 * @param {object} data - An object containing the .results array which is eventually iterated over to test conditional statements and access specific objects and/or values.
 */

function performSearch(data) {
  search(data);

  function search(data) {
    form.addEventListener("submit", () => {
      const searchValue = searchInput.value.toLowerCase();
      for (let i = 0; i < 12; i++) {
        const profile = data.results[i];
        const names =
          profile.name.first.toLowerCase() +
          " " +
          profile.name.last.toLowerCase();
        if (
          names.includes(searchValue) &&
          searchValue !== " " &&
          searchValue !== ""
        ) {
          //Determines if the name searched by the user is part of the profiles in the employee directory. If it is, then it will show the results while removing the other profile cards.
          searchGallery(profile, data);
          title.textContent = "RETURN TO THE HOME PAGE";
          searchInput.value = "";
        }
      }
      returnToHomePage(data);
    });
  }

  //Creates the profile card from the search results (if any).
  function searchGallery(profile, data) {
    gallery.innerHTML = galleryTemplate(profile);
    modalCard(profile, data, true);
  }

  //Listens for a "click" event on the title element. Once a "click" is heard, then it will remove the current card from the search result and show all the profile cards once again.
  function returnToHomePage(data) {
    title.addEventListener("click", () => {
      const cards = document.querySelectorAll(".card");
      const card = document.querySelector(".card");
      const cardsLength = cards.length - 1;
      title.textContent = "AWESOME STARTUP EMPLOYEE DIRECTORY";
      for (let i = 0; i < data.results.length; i++) {
        const profile = data.results[i];
        if (cardsLength === 0) {
          card.remove();
          createGallery(profile);
          modalCard(profile, data);
        }
      }
    });
  }
}
