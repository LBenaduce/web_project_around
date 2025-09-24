import './page/index.css';
import { Card } from './scripts/Card.js';
import { FormValidator } from './scripts/FormValidator.js';
import { Section } from './scripts/Section.js';
import PopupWithImage from './scripts/PopupWithImage.js';
import PopupWithForm from './scripts/PopupWithForm.js';
import PopupWithConfirmation from './scripts/PopupWithConfirmation.js';
import { UserInfo } from './scripts/UserInfo.js';
import ModalProfile from './scripts/ModalProfile.js';
import Api from './scripts/Api.js';
import logoSrc from './images/logo.png';
import profileImageSrc from './images/profile__image.jpg';
import addIconSrc from './images/add.svg';
import editIconSrc from './images/edit.svg';

let userId;

const profileImage = document.querySelector('.profile__image');
const headerLogo = document.querySelector('.header__logo');
const profileEditButton = document.querySelector('#edit-profile-button');
const profileAddButton = document.querySelector('.profile__add');
const popupProfileImage = document.querySelector('.profile__image-button'); 

profileImage.src = profileImageSrc;
headerLogo.src = logoSrc;
document.querySelector('.profile__edit').style.backgroundImage = `url(${editIconSrc})`;
profileAddButton.style.backgroundImage = `url(${addIconSrc})`;

const api = new Api({
  baseUrl: "https://around.nomoreparties.co/v1/web-ptbr-cohort-12",
  headers: {
    authorization: "c27e8b71-839c-45ed-b81c-981deeb16426",
    "Content-Type": "application/json"
  }
});

function handleLikeClick(cardId, isLiked) {
  return isLiked ? api.unlikeCard(cardId) : api.likeCard(cardId);
}

const deletePopup = new PopupWithConfirmation({
  popupSelector: '#popup_type_delete-card',
  handleFormSubmit: (card) => {
    api.deleteCard(card._id)
      .then(() => {
        card._element.remove();
        deletePopup.close();
      })
      .catch((err) => console.error('Erro ao excluir o cartão:', err));
  }
});
deletePopup.setEventListeners();

function createCard(data) {
  const card = new Card(
    {
      name: data.name,
      link: data.link,
      likes: data.likes,
      id: data._id,
      userId,
      ownerId: data.owner._id
    },
    '#template-card',
    ({ name, link }) => handleCardClick({ name, link }),
    (cardId, isLiked, card) => handleLikeClick(cardId, isLiked, card),
    () => deletePopup.open(card)
  );
  return card.generateCard();
}

const cardList = new Section({
  items: [],
  renderer: (item) => {
    const cardElement = createCard(item);
    cardList.addItem(cardElement);
  }
}, '.cards__list'); 

api.getInitialCards()
  .then((cards) => {
    if (Array.isArray(cards)) {
      cardList.renderItems(cards);
    } else {
      console.error("Erro: O retorno da API não é um array", cards);
    }
  })
  .catch((err) => console.log("Erro ao carregar os cartões:", err));

const userInfo = new UserInfo({
  nameSelector: '.profile__name',
  jobSelector: '.profile__about'
});

api.getUserInfo()
  .then((result) => {
    userId = result._id;
    userInfo.setUserInfo({
      name: result.name,
      job: result.about
    });
    profileImage.src = result.avatar;
  })
  .catch((err) => console.log("Erro ao carregar as informações do usuário:", err));

function handleCardClick({ name, link }) {
  imagePopup.open({ name, link });
}

const imagePopup = new PopupWithImage('.modalImage');
imagePopup.setEventListeners();

const addCardPopup = new PopupWithForm({
  popupSelector: '#popup-card',
  handleFormSubmit: (formData) => {
    api.addCard({
      name: formData['popup-card-name'],
      link: formData['popup-card-link']
    })
      .then((newCard) => {
        const cardElement = createCard(newCard);
        cardList.addItem(cardElement);
        addCardPopup.close();
      })
      .catch(err => console.log("Erro ao adicionar um novo cartão:", err));
  }
});
addCardPopup.setEventListeners();

const editProfilePopup = new PopupWithForm({
  popupSelector: '#popup-profile',
  handleFormSubmit: (data) => {
    api.updateUserInfo({
      name: data.name,
      about: data.about
    })
      .then(() => {
        userInfo.setUserInfo({ name: data.name, job: data.about });
        editProfilePopup.close();
      })
      .catch(err => console.log("Erro ao atualizar nome", err));
  }
});
editProfilePopup.setEventListeners();

profileEditButton.addEventListener('click', () => {
  const userInfoData = userInfo.getUserInfo();
  document.querySelector('#popup-profile-name').value = userInfoData.name;
  document.querySelector('#popup-profile-about').value = userInfoData.job;
  editProfilePopup.open();
});

const modalProfile = new ModalProfile('#popup-profile-image');
popupProfileImage?.addEventListener('click', () => modalProfile.open());

profileAddButton.addEventListener('click', () => {
  addCardPopup.open();
});

const validationSettings = {
  formSelector: ".popup__form",
  inputSelector: ".popup__edit-text",
  submitButtonSelector: ".popup__button-save",
  inactiveButtonClass: "popup__button-disable",
  inputErrorClass: "popup__input-error",
  errorClass: "popup__error_visible"
};

document.querySelectorAll(validationSettings.formSelector).forEach((formElement) => {
  const formValidator = new FormValidator(validationSettings, formElement);
  formValidator.enableValidation();
});
