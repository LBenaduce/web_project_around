import Card from './Card.js';
import FormValidator from './FormValidator.js';
import {
  openPopup,
  closePopup,
  setClosePopupByOverlay
} from './utils.js';

const elementsSection = document.querySelector('.elements');
const profileName = document.querySelector('.profile__name');
const profileDesc = document.querySelector('.profile__description');

const popupProfile = document.querySelector('#popup-profile');
const popupAddPic = document.querySelector('#popup-addpic');
const popupImage = document.querySelector('#popup');
const popupConfirm = document.querySelector('#popup-confirm');
const popupAvatar = document.querySelector('#popup-avatar');

const btnEditProfile = document.querySelector('.profile__pen');
const btnAddPlace = document.querySelector('.profile__plus');

const formProfile = popupProfile.querySelector('.popup__profile');
const formAddPic = popupAddPic.querySelector('.popup__addpic');
const formAvatar = popupAvatar?.querySelector('#avatar-form');

const profileInputName = popupProfile.querySelector('#name');
const profileInputAbout = popupProfile.querySelector('#about');

const inputPlaceName = popupAddPic.querySelector('#local-name');
const inputPlaceLink = popupAddPic.querySelector('#link');

const zoomImg = popupImage.querySelector('#popupimg');
const zoomCaption = popupImage.querySelector('#popupCaption');

const confirmBtn = popupConfirm.querySelector('.popup__save--confirm');
const cancelBtn = popupConfirm.querySelector('.popup__save--cancel');

const avatarInput = popupAvatar?.querySelector('#avatar-link');
const avatarEl = document.querySelector('.profile__avatar');

let cardToDelete = null;

const validationConfig = {
  formSelector: '.popup__profile, .popup__addpic, .popup__avatar-form',
  inputSelector: '.popup__name, .popup__about, .popup__avatar',
  submitButtonSelector: '.popup__save',
  inactiveButtonClass: 'popup__save_disabled',
  inputErrorClass: 'popup__input_type_error',
  errorClass: 'popup__error_visible'
};

const profileFormValidator = new FormValidator(validationConfig, formProfile);
const addPicFormValidator = new FormValidator(validationConfig, formAddPic);
let avatarFormValidator = null;

profileFormValidator.enableValidation();
addPicFormValidator.enableValidation();

if (formAvatar) {
  avatarFormValidator = new FormValidator(validationConfig, formAvatar);
  avatarFormValidator.enableValidation();
}

function handleCardClick(name, link) {
  zoomImg.src = link;
  zoomImg.alt = name;
  zoomCaption.textContent = name;
  openPopup(popupImage);
}

function handleDeleteClick(cardElement) {
  cardToDelete = cardElement;
  openPopup(popupConfirm);
}

function createCard(data) {
  const card = new Card(
    data,
    '#cardTemplate',
    handleCardClick,
    handleDeleteClick
  );
  return card.generateCard();
}

const initialCards = [
  {
    name: 'Vale de Yosemite',
    link: 'https://practicum-content.s3.us-west-1.amazonaws.com/web-code/moved_yosemite.jpg'
  },
  {
    name: 'Lago Louise',
    link: 'https://practicum-content.s3.us-west-1.amazonaws.com/web-code/moved_lake-louise.jpg'
  },
  {
    name: 'Montanhas Carecas',
    link: 'https://practicum-content.s3.us-west-1.amazonaws.com/web-code/moved_bald-mountains.jpg'
  },
  {
    name: 'Latemar',
    link: 'https://practicum-content.s3.us-west-1.amazonaws.com/web-code/moved_latemar.jpg'
  },
  {
    name: 'Parque Nacional Vanoise',
    link: 'https://practicum-content.s3.us-west-1.amazonaws.com/web-code/moved_vanoise.jpg'
  },
  {
    name: 'Lago di Braies',
    link: 'https://practicum-content.s3.us-west-1.amazonaws.com/web-code/moved_braies.jpg'
  }
];


initialCards.forEach((data) => {
  const cardElement = createCard(data);
  elementsSection.appendChild(cardElement);
});

formProfile.addEventListener('submit', (e) => {
  e.preventDefault();
  if (!formProfile.checkValidity()) return;

  profileName.textContent = profileInputName.value.trim();
  profileDesc.textContent = profileInputAbout.value.trim();

  closePopup(popupProfile);
});

formAddPic.addEventListener('submit', (e) => {
  e.preventDefault();
  if (!formAddPic.checkValidity()) return;

  const name = inputPlaceName.value.trim();
  const link = inputPlaceLink.value.trim();

  const card = createCard({ name, link });
  elementsSection.prepend(card);

  formAddPic.reset();
  addPicFormValidator.resetValidation();
  closePopup(popupAddPic);
});

if (formAvatar) {
  formAvatar.addEventListener('submit', (e) => {
    e.preventDefault();
    if (!formAvatar.checkValidity()) return;

    const url = avatarInput.value.trim();
    if (avatarEl && url) {
      avatarEl.src = url;
    }

    formAvatar.reset();
    avatarFormValidator?.resetValidation();
    closePopup(popupAvatar);
  });
}

btnEditProfile.addEventListener('click', () => {
  profileInputName.value = profileName.textContent.trim();
  profileInputAbout.value = profileDesc.textContent.trim();
  profileFormValidator.resetValidation();
  openPopup(popupProfile);
});

btnAddPlace.addEventListener('click', () => {
  formAddPic.reset();
  addPicFormValidator.resetValidation();
  openPopup(popupAddPic);
});

confirmBtn.addEventListener('click', () => {
  if (cardToDelete) {
    cardToDelete.remove();
    cardToDelete = null;
  }
  closePopup(popupConfirm);
});

cancelBtn.addEventListener('click', () => {
  cardToDelete = null;
  closePopup(popupConfirm);
});

document.querySelectorAll('.popup').forEach((popup) => {
  setClosePopupByOverlay(popup);
});
