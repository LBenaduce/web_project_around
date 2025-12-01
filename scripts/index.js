import Card from './Card.js';
import FormValidator from './FormValidator.js';
import Section from './Section.js';
import Popup from './Popup.js';
import PopupWithImage from './PopupWithImage.js';
import PopupWithForm from './PopupWithForm.js';
import UserInfo from './UserInfo.js';

const elementsSectionSelector = '.elements';

const profileNameElement = document.querySelector('.profile__name');
const profileDescElement = document.querySelector('.profile__description');
const avatarElement = document.querySelector('.profile__avatar');

const popupProfileSelector = '#popup-profile';
const popupAddPicSelector = '#popup-addpic';
const popupImageSelector = '#popup';
const popupConfirmSelector = '#popup-confirm';
const popupAvatarSelector = '#popup-avatar';

const popupProfile = document.querySelector(popupProfileSelector);
const popupAddPic = document.querySelector(popupAddPicSelector);
const popupAvatar = document.querySelector(popupAvatarSelector);

const formProfile = popupProfile.querySelector('.popup__profile');
const formAddPic = popupAddPic.querySelector('.popup__addpic');
const formAvatar = popupAvatar.querySelector('#avatar-form');

const profileInputName = popupProfile.querySelector('#name');
const profileInputAbout = popupProfile.querySelector('#about');

const inputPlaceName = popupAddPic.querySelector('#local-name');
const inputPlaceLink = popupAddPic.querySelector('#link');

const avatarInput = popupAvatar.querySelector('#avatar-link');

const btnEditProfile = document.querySelector('.profile__pen');
const btnAddPlace = document.querySelector('.profile__plus');

const popupConfirm = document.querySelector(popupConfirmSelector);
const confirmBtn = popupConfirm.querySelector('.popup__save--confirm');
const cancelBtn = popupConfirm.querySelector('.popup__save--cancel');

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
const avatarFormValidator = new FormValidator(validationConfig, formAvatar);

profileFormValidator.enableValidation();
addPicFormValidator.enableValidation();
avatarFormValidator.enableValidation();

const userInfo = new UserInfo({
  nameSelector: '.profile__name',
  jobSelector: '.profile__description'
});

const imagePopup = new PopupWithImage(popupImageSelector);
imagePopup.setEventListeners();

function handleCardClick(name, link) {
  imagePopup.open(name, link);
}

const confirmPopup = new Popup(popupConfirmSelector);
confirmPopup.setEventListeners();

let cardToDelete = null;

function handleDeleteClick(cardElement) {
  cardToDelete = cardElement;
  confirmPopup.open();
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
    link: 'images/yosemite.png'
  },
  {
    name: 'Lago Louise',
    link: 'images/louise.png'
  },
  {
    name: 'Montanhas Carecas',
    link: 'images/montanhas.png'
  },
  {
    name: 'Latemar',
    link: 'images/latemar.png'
  },
  {
    name: 'Parque Nacional de Vanoise',
    link: 'images/vanoise.png'
  },
  {
    name: 'Lago di Braies',
    link: 'images/braies.png'
  }
];

const cardSection = new Section(
  {
    items: initialCards,
    renderer: (item) => {
      const cardElement = createCard(item);
      cardSection.addItem(cardElement);
    }
  },
  elementsSectionSelector
);

cardSection.renderItems();

const editProfilePopup = new PopupWithForm(
  popupProfileSelector,
  (formData) => {
    userInfo.setUserInfo({
      name: formData.name,
      job: formData.about
    });
    editProfilePopup.close();
  }
);
editProfilePopup.setEventListeners();

const addCardPopup = new PopupWithForm(
  popupAddPicSelector,
  (formData) => {
    const newCardData = {
      name: formData['local-name'] || '',
      link: formData.link || ''
    };

    const cardElement = createCard(newCardData);
    cardSection.addItem(cardElement);

    addCardPopup.close();
    addPicFormValidator.resetValidation();
  }
);
addCardPopup.setEventListeners();

const avatarPopup = new PopupWithForm(
  popupAvatarSelector,
  (formData) => {
    const url = (formData.avatar || '').trim();
    if (avatarElement && url) {
      avatarElement.src = url;
    }
    avatarPopup.close();
    avatarFormValidator.resetValidation();
  }
);
avatarPopup.setEventListeners();


btnEditProfile.addEventListener('click', () => {
  const currentUser = userInfo.getUserInfo();
  profileInputName.value = currentUser.name.trim();
  profileInputAbout.value = currentUser.job.trim();
  profileFormValidator.resetValidation();
  editProfilePopup.open();
});

btnAddPlace.addEventListener('click', () => {
  formAddPic.reset();
  addPicFormValidator.resetValidation();
  addCardPopup.open();
});

avatarElement.addEventListener('click', () => {
  formAvatar.reset();
  avatarFormValidator.resetValidation();
  avatarPopup.open();
});

confirmBtn.addEventListener('click', () => {
  if (cardToDelete) {
    cardToDelete.remove();
    cardToDelete = null;
  }
  confirmPopup.close();
});

cancelBtn.addEventListener('click', () => {
  cardToDelete = null;
  confirmPopup.close();
});
