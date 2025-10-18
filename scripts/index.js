const profileEditButton = document.querySelector('.profile__edit-button');
const profileAddButton = document.querySelector('.profile__add-button');
const editPopup = document.getElementById('edit-popup');
const addPopup = document.getElementById('add-popup');
const imagePopup = document.getElementById('image-popup');
const closeButtons = document.querySelectorAll('.popup__close');

const nameInput = editPopup.querySelector('input[name="name"]');
const aboutInput = editPopup.querySelector('input[name="about"]');
const profileName = document.querySelector('.profile__name');
const profileJob = document.querySelector('.profile__job');
const editForm = editPopup.querySelector('.popup__form');

const addForm = addPopup.querySelector('.popup__form');
const titleInput = addForm.querySelector('input[name="title"]');
const linkInput = addForm.querySelector('input[name="link"]');

const imagePopupImg = imagePopup.querySelector('.popup__image');
const imagePopupCaption = imagePopup.querySelector('.popup__caption');

const cardsList = document.querySelector('.elements__list');
const cardTemplate = document.querySelector('#card-template').content;

const initialCards = [
  { name: "Vale de Yosemite", link: "https://practicum-content.s3.us-west-1.amazonaws.com/web-code/moved_yosemite.jpg" },
  { name: "Lago Louise", link: "https://practicum-content.s3.us-west-1.amazonaws.com/web-code/moved_lake-louise.jpg" },
  { name: "Montanhas Carecas", link: "https://practicum-content.s3.us-west-1.amazonaws.com/web-code/moved_bald-mountains.jpg" },
  { name: "Latemar", link: "https://practicum-content.s3.us-west-1.amazonaws.com/web-code/moved_latemar.jpg" },
  { name: "Parque Nacional da Vanoise", link: "https://practicum-content.s3.us-west-1.amazonaws.com/web-code/moved_vanoise.jpg" },
  { name: "Lago di Braies", link: "https://practicum-content.s3.us-west-1.amazonaws.com/web-code/moved_lago.jpg" }
];

function openPopup(popup) {
  popup.classList.add('popup_opened');
  document.addEventListener('keydown', handleEscClose);
}

function closePopup(popup) {
  popup.classList.remove('popup_opened');
  document.removeEventListener('keydown', handleEscClose);
}

function handleEscClose(e) {
  if (e.key === 'Escape') {
    const openedPopup = document.querySelector('.popup_opened');
    if (openedPopup) closePopup(openedPopup);
  }
}

closeButtons.forEach((btn) => {
  const popup = btn.closest('.popup');
  btn.addEventListener('click', () => closePopup(popup));
});

document.querySelectorAll('.popup').forEach((popup) => {
  popup.addEventListener('mousedown', (e) => {
    if (e.target === popup) closePopup(popup);
  });
});

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
editForm.addEventListener('submit', handleProfileSubmit);

profileAddButton.addEventListener('click', () => openPopup(addPopup));

function createCard({ name, link }) {
  const card = cardTemplate.querySelector('.card').cloneNode(true);
  const cardImage = card.querySelector('.card__image');
  const cardTitle = card.querySelector('.card__title');
  const likeButton = card.querySelector('.card__like-btn');
  const deleteButton = card.querySelector('.card__delete-btn');

  cardTitle.textContent = name;
  cardImage.src = link;
  cardImage.alt = name;

  likeButton.addEventListener('click', () => {
    likeButton.classList.toggle('card__like-btn_active');
  });

  deleteButton.addEventListener('click', () => {
    card.remove();
  });

  cardImage.addEventListener('click', () => {
    imagePopupImg.src = link;
    imagePopupImg.alt = name;
    imagePopupCaption.textContent = name;
    openPopup(imagePopup);
  });

  return card;
}

function renderInitialCards(cards) {
  const fragment = document.createDocumentFragment();
  cards.forEach((cardData) => {
    fragment.appendChild(createCard(cardData));
  });
  cardsList.appendChild(fragment);
}

function handleAddCardSubmit(e) {
  e.preventDefault();
  const newCard = createCard({ name: titleInput.value, link: linkInput.value });
  cardsList.prepend(newCard);
  addForm.reset();
  closePopup(addPopup);
}

addForm.addEventListener('submit', handleAddCardSubmit);

document.addEventListener('DOMContentLoaded', () => renderInitialCards(initialCards));
