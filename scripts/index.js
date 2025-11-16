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

const formProfile = popupProfile ? popupProfile.querySelector('.popup__profile') : null;
const formAddPic = popupAddPic ? popupAddPic.querySelector('.popup__addpic') : null;
const formAvatar = popupAvatar ? popupAvatar.querySelector('#avatar-form') : null;

const profileInputName = popupProfile ? popupProfile.querySelector('#name') : null;
const profileInputAbout = popupProfile ? popupProfile.querySelector('#about') : null;

const inputPlaceName = popupAddPic ? popupAddPic.querySelector('#local-name') : null;
const inputPlaceLink = popupAddPic ? popupAddPic.querySelector('#link') : null;

const zoomImg = popupImage ? popupImage.querySelector('#popupimg') : null;
const zoomCaption = popupImage ? popupImage.querySelector('#popupCaption') : null;

const confirmBtn = popupConfirm ? popupConfirm.querySelector('.popup__save--confirm') : null;
const cancelBtn = popupConfirm ? popupConfirm.querySelector('.popup__save--cancel') : null;

const avatarInput = formAvatar ? formAvatar.querySelector('#avatar-link') : null;
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

let profileFormValidator = null;
let addPicFormValidator = null;
let avatarFormValidator = null;

if (formProfile) {
  profileFormValidator = new FormValidator(validationConfig, formProfile);
  profileFormValidator.enableValidation();
}

if (formAddPic) {
  addPicFormValidator = new FormValidator(validationConfig, formAddPic);
  addPicFormValidator.enableValidation();
}

if (formAvatar) {
  avatarFormValidator = new FormValidator(validationConfig, formAvatar);
  avatarFormValidator.enableValidation();
}

function handleCardClick(name, link) {
  if (!popupImage || !zoomImg || !zoomCaption) return;
  zoomImg.src = link;
  zoomImg.alt = name;
  zoomCaption.textContent = name;
  openPopup(popupImage);
}

function handleDeleteClick(cardElement) {
  if (!popupConfirm) return;
  cardToDelete = cardElement;
  openPopup(popupConfirm);
}

function createCard(data) {
  const card = new Card(data, '#cardTemplate', handleCardClick, handleDeleteClick);
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

if (elementsSection) {
  initialCards.forEach(function (data) {
    const cardElement = createCard(data);
    elementsSection.appendChild(cardElement);
  });
}

if (formProfile && popupProfile && profileInputName && profileInputAbout && profileName && profileDesc) {
  formProfile.addEventListener('submit', function (e) {
    e.preventDefault();
    if (!formProfile.checkValidity()) return;

    profileName.textContent = profileInputName.value.trim();
    profileDesc.textContent = profileInputAbout.value.trim();

    closePopup(popupProfile);
  });
}

if (formAddPic && popupAddPic && inputPlaceName && inputPlaceLink && elementsSection) {
  formAddPic.addEventListener('submit', function (e) {
    e.preventDefault();
    if (!formAddPic.checkValidity()) return;

    const name = inputPlaceName.value.trim();
    const link = inputPlaceLink.value.trim();

    const card = createCard({ name: name, link: link });
    elementsSection.prepend(card);

    formAddPic.reset();
    if (addPicFormValidator) {
      addPicFormValidator.resetValidation();
    }
    closePopup(popupAddPic);
  });
}

if (formAvatar && popupAvatar && avatarInput) {
  formAvatar.addEventListener('submit', function (e) {
    e.preventDefault();
    if (!formAvatar.checkValidity()) return;

    const url = avatarInput.value.trim();
    if (avatarEl && url) {
      avatarEl.src = url;
    }

    formAvatar.reset();
    if (avatarFormValidator) {
      avatarFormValidator.resetValidation();
    }
    closePopup(popupAvatar);
  });
}

if (btnEditProfile && popupProfile && formProfile && profileInputName && profileInputAbout && profileName && profileDesc) {
  btnEditProfile.addEventListener('click', function () {
    profileInputName.value = profileName.textContent.trim();
    profileInputAbout.value = profileDesc.textContent.trim();
    if (profileFormValidator) {
      profileFormValidator.resetValidation();
    }
    openPopup(popupProfile);
  });
}

if (btnAddPlace && popupAddPic && formAddPic) {
  btnAddPlace.addEventListener('click', function () {
    formAddPic.reset();
    if (addPicFormValidator) {
      addPicFormValidator.resetValidation();
    }
    openPopup(popupAddPic);
  });
}

if (confirmBtn && popupConfirm) {
  confirmBtn.addEventListener('click', function () {
    if (cardToDelete) {
      cardToDelete.remove();
      cardToDelete = null;
    }
    closePopup(popupConfirm);
  });
}

if (cancelBtn && popupConfirm) {
  cancelBtn.addEventListener('click', function () {
    cardToDelete = null;
    closePopup(popupConfirm);
  });
}

document.querySelectorAll('.popup').forEach(function (popup) {
  setClosePopupByOverlay(popup);
});
