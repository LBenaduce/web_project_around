const profileEditButton = document.querySelector('.profile__edit-button');
const editPopup = document.getElementById('edit-popup');
const closeButton = editPopup.querySelector('.popup__close');
const nameInput = editPopup.querySelector('input[name="name"]');
const aboutInput = editPopup.querySelector('input[name="about"]');
const profileName = document.querySelector('.profile__name');
const profileJob = document.querySelector('.profile__job');
const form = editPopup.querySelector('.popup__form');

function openPopup(popup) {
  popup.classList.add('popup_opened');
}

function closePopup(popup) {
  popup.classList.remove('popup_opened');
}

function openEditProfilePopup() {
  nameInput.value = profileName.textContent;
  aboutInput.value = profileJob.textContent;
  openPopup(editPopup);
}

function handleProfileSubmit(e) {
  e.preventDefault();
  profileName.textContent = nameInput.value;
  profileJob.textContent = aboutInput.value;
  closePopup(editPopup);
}

profileEditButton.addEventListener('click', openEditProfilePopup);
closeButton.addEventListener('click', () => closePopup(editPopup));
form.addEventListener('submit', handleProfileSubmit);

editPopup.addEventListener('mousedown', (e) => {
  if (e.target === editPopup) closePopup(editPopup);
});

document.addEventListener('keydown', (e) => {
  if (e.key === 'Escape') closePopup(editPopup);
});

const initialCards = [
  { name: "Vale de Yosemite", link: "https://practicum-content.s3.us-west-1.amazonaws.com/web-code/moved_yosemite.jpg" },
  { name: "Lago Louise", link: "https://practicum-content.s3.us-west-1.amazonaws.com/web-code/moved_lake-louise.jpg" },
  { name: "Montanhas Carecas", link: "https://practicum-content.s3.us-west-1.amazonaws.com/web-code/moved_bald-mountains.jpg" },
  { name: "Latemar", link: "https://practicum-content.s3.us-west-1.amazonaws.com/web-code/moved_latemar.jpg" },
  { name: "Parque Nacional da Vanoise", link: "https://practicum-content.s3.us-west-1.amazonaws.com/web-code/moved_vanoise.jpg" },
  { name: "Lago di Braies", link: "https://practicum-content.s3.us-west-1.amazonaws.com/web-code/moved_lago.jpg" }
];

const cardsList = document.querySelector(".elements__list");
const cardTemplate = document.querySelector("#card-template").content;

function createCard({ name, link }) {
  const cardEl = cardTemplate.querySelector(".card").cloneNode(true);
  const img = cardEl.querySelector(".card__image");
  const titleEl = cardEl.querySelector(".card__title");
  const likeBtn = cardEl.querySelector(".card__like-btn");
  const deleteBtn = cardEl.querySelector(".card__delete-btn");
  titleEl.textContent = name;
  img.src = link;
  img.alt = name || "Imagem do cartão";
  likeBtn.addEventListener("click", (evt) => {
    evt.currentTarget.classList.toggle("card__like-btn_active");
    const pressed = evt.currentTarget.getAttribute("aria-pressed") === "true";
    evt.currentTarget.setAttribute("aria-pressed", String(!pressed));
  });
  deleteBtn.addEventListener("click", () => {
    cardEl.remove();
  });
  return cardEl;
}

function renderInitialCards(cards) {
  const fragment = document.createDocumentFragment();
  cards.forEach((card) => fragment.appendChild(createCard(card)));
  cardsList.appendChild(fragment);
}

document.addEventListener("DOMContentLoaded", () => {
  renderInitialCards(initialCards);
});
