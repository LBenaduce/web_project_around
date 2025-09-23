let editButton = document.querySelector(".profile__edit-button");
let closeButton = document.querySelector(".popup__container__close-button");
let formElement = document.querySelector(".popup__container");

function openPopUp() {
  let popup = document.querySelector(".popup");

  popup.classList.add("popup__opened");
}

function closePopUp() {
  let popup = document.querySelector(".popup");

  popup.classList.remove("popup__opened");
}

function handleProfileFormSubmit(evt) {
  evt.preventDefault();

  let nameInput = document.querySelector("#name").value;
  let jobInput = document.querySelector("#job").value;

  console.log(nameInput, jobInput);

  let userName = document.querySelector(".profile__name");
  let userJob = document.querySelector(".profile__job");

  userName.textContent = nameInput;
  userJob.textContent = jobInput;

  closePopUp();
}

editButton.addEventListener("click", openPopUp);
closeButton.addEventListener("click", closePopUp);
formElement.addEventListener("submit", handleProfileFormSubmit);
