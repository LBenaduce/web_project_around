console.log("🟢 pages/index.js carregou");

import Card from "../scripts/Card.js";
import FormValidator from "../scripts/FormValidator.js";
import Section from "../scripts/Section.js";
import PopupWithImage from "../scripts/PopupWithImage.js";
import PopupWithForm from "../scripts/PopupWithForm.js";
import PopupWithConfirmation from "../scripts/PopupWithConfirmation.js";
import UserInfo from "../scripts/UserInfo.js";
import Api from "../scripts/Api.js";

const elementsSectionSelector = ".elements__list";

const fallbackCards = [
  {
    name: "Yosemite Valley",
    link: "https://practicum-content.s3.us-west-1.amazonaws.com/web-code/moved_yosemite.jpg",
  },
  {
    name: "Lake Louise",
    link: "https://practicum-content.s3.us-west-1.amazonaws.com/web-code/moved_lake-louise.jpg",
  },
  {
    name: "Bald Mountains",
    link: "https://practicum-content.s3.us-west-1.amazonaws.com/web-code/moved_bald-mountains.jpg",
  },
  {
    name: "Latemar",
    link: "https://practicum-content.s3.us-west-1.amazonaws.com/web-code/moved_latemar.jpg",
  },
  {
    name: "Vanoise National Park",
    link: "https://practicum-content.s3.us-west-1.amazonaws.com/web-code/moved_vanoise.jpg",
  },
  {
    name: "Lago di Braies",
    link: "https://practicum-content.s3.us-west-1.amazonaws.com/web-code/moved_lago.jpg",
  },
];

const profileNameElement = document.querySelector(".profile__name");
const profileDescElement = document.querySelector(".profile__description");
const avatarElement = document.querySelector(".profile__avatar");

const btnEditProfile = document.querySelector(".profile__pen");
const btnAddPlace = document.querySelector(".profile__plus");

const popupProfileSelector = "#popup-profile";
const popupAddPicSelector = "#popup-addpic";
const popupImageSelector = "#popup";
const popupConfirmSelector = "#popup-confirm";
const popupAvatarSelector = "#popup-avatar";

const popupProfile = document.querySelector(popupProfileSelector);
const popupAddPic = document.querySelector(popupAddPicSelector);
const popupAvatar = document.querySelector(popupAvatarSelector);

const formProfile = popupProfile.querySelector(".popup__profile");
const formAddPic = popupAddPic.querySelector(".popup__addpic");
const formAvatar = popupAvatar.querySelector(".popup__avatar-form");

const profileInputName = popupProfile.querySelector("#name");
const profileInputAbout = popupProfile.querySelector("#about");

const validationConfig = {
  inputSelector: ".popup__name, .popup__about, .popup__avatar",
  submitButtonSelector: ".popup__save",
  inactiveButtonClass: "popup__button_disabled",
  inputErrorClass: "popup__input_type_error",
  errorClass: "popup__error_visible",
};

const profileFormValidator = new FormValidator(validationConfig, formProfile);
const addPicFormValidator = new FormValidator(validationConfig, formAddPic);
const avatarFormValidator = new FormValidator(validationConfig, formAvatar);

profileFormValidator.enableValidation();
addPicFormValidator.enableValidation();
avatarFormValidator.enableValidation();

console.log("🟢 Validators OK");

const api = new Api({
  baseUrl: "https://around-api.pt-br.tripleten-services.com/v1",
  headers: {
    authorization: "6f52aaa4-1ad3-40e3-9da3-068576075181",
  },
});

let currentUserId = null;

const userInfo = new UserInfo({
  nameSelector: ".profile__name",
  jobSelector: ".profile__description",
});

console.log("🟢 UserInfo criado");

const imagePopup = new PopupWithImage(popupImageSelector);
imagePopup.setEventListeners();

const confirmPopup = new PopupWithConfirmation(popupConfirmSelector);
confirmPopup.setEventListeners();

console.log("🟢 Popups OK");

function handleCardClick(name, link) {
  imagePopup.open(name, link);
}

function handleDeleteClick(cardInstance) {
  confirmPopup.setSubmitAction(() => {
    api
      .deleteCard(cardInstance.getId())
      .then(() => {
        cardInstance.removeCard();
        confirmPopup.close();
      })
      .catch((err) => console.error("❌ erro deleteCard:", err));
  });

  confirmPopup.open();
}

function handleLikeClick(cardInstance) {
  const request = cardInstance.isLiked()
    ? api.removeLike(cardInstance.getId())
    : api.addLike(cardInstance.getId());

  request
    .then((updatedCard) => {
      const likes =
        updatedCard?.likes ??
        updatedCard?.data?.likes ??
        updatedCard?.card?.likes ??
        [];

      cardInstance.setLikes(likes);
    })
    .catch((err) => console.error("❌ erro like:", err));
}

function createCard(data) {
  console.log("🟢 criando card:", data.name);

  const card = new Card(
    data,
    currentUserId,
    "#card-template",
    handleCardClick,
    handleDeleteClick,
    handleLikeClick
  );

  return card.generateCard();
}

const cardSection = new Section(
  {
    renderer: (item) => createCard(item),
  },
  elementsSectionSelector
);

console.log("🟢 Section criada");

const editProfilePopup = new PopupWithForm(popupProfileSelector, (formData) => {
  editProfilePopup.renderLoading(true);

  api
    .updateUserInfo({ name: formData.name, about: formData.about })
    .then((userData) => {
      userInfo.setUserInfo({
        name: userData.name,
        job: userData.about,
      });
      editProfilePopup.close();
    })
    .catch((err) => console.error("❌ erro updateUser:", err))
    .finally(() => editProfilePopup.renderLoading(false));
});
editProfilePopup.setEventListeners();

const addCardPopup = new PopupWithForm(popupAddPicSelector, (formData) => {
  addCardPopup.renderLoading(true);

  api
    .addCard({
      name: formData["local-name"],
      link: formData.link,
    })
    .then((cardData) => {
      cardSection.addItem(createCard(cardData));
      addCardPopup.close();
      addPicFormValidator.resetValidation();
    })
    .catch((err) => console.error("❌ erro addCard:", err))
    .finally(() => addCardPopup.renderLoading(false));
});
addCardPopup.setEventListeners();

const avatarPopup = new PopupWithForm(popupAvatarSelector, (formData) => {
  avatarPopup.renderLoading(true);

  api
    .updateAvatar(formData.avatar)
    .then((userData) => {
      avatarElement.src = userData.avatar;
      avatarPopup.close();
      avatarFormValidator.resetValidation();
    })
    .catch((err) => console.error("❌ erro avatar:", err))
    .finally(() => avatarPopup.renderLoading(false));
});
avatarPopup.setEventListeners();

btnEditProfile.addEventListener("click", () => {
  profileFormValidator.resetValidation();
  profileInputName.value = profileNameElement.textContent;
  profileInputAbout.value = profileDescElement.textContent;
  editProfilePopup.open();
});

btnAddPlace.addEventListener("click", () => {
  formAddPic.reset();
  addPicFormValidator.resetValidation();
  addCardPopup.open();
});

avatarElement.addEventListener("click", () => {
  formAvatar.reset();
  avatarFormValidator.resetValidation();
  avatarPopup.open();
});

console.log("🟡 chamando getAppInfo");

api
  .getAppInfo()
  .then(([userData, initialCards]) => {
    console.log("🟢 userData:", userData);
    console.log("🟢 initialCards:", initialCards);

    currentUserId = userData._id;

    userInfo.setUserInfo({
      name: userData.name,
      job: userData.about,
    });

    avatarElement.src = userData.avatar;

    const cardsToRender =
      Array.isArray(initialCards) && initialCards.length > 1
        ? initialCards
        : fallbackCards;

    cardSection.setItems(cardsToRender);
    cardSection.renderItems();

    console.log(
      "🟢 cards no DOM:",
      document.querySelectorAll(".elements__card").length
    );
  })
  .catch((err) => console.error("❌ ERRO getAppInfo:", err));

document.addEventListener("DOMContentLoaded", () => {
  const yearEl = document.getElementById("year");
  if (yearEl) yearEl.textContent = new Date().getFullYear();
});
