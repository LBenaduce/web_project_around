import Card from "./Card.js";
import FormValidator from "./FormValidator.js";
import Section from "./Section.js";
import PopupWithImage from "./PopupWithImage.js";
import PopupWithForm from "./PopupWithForm.js";
import UserInfo from "./UserInfo.js";

import Api from "./Api.js";
import PopupWithConfirmation from "./PopupWithConfirmation.js";

const elementsSectionSelector = ".elements";

const profileNameElement = document.querySelector(".profile__name");
const profileDescElement = document.querySelector(".profile__description");
const avatarElement = document.querySelector(".profile__avatar");

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
const formAvatar = popupAvatar.querySelector("#avatar-form");

const profileInputName = popupProfile.querySelector("#name");
const profileInputAbout = popupProfile.querySelector("#about");

const btnEditProfile = document.querySelector(".profile__pen");
const btnAddPlace = document.querySelector(".profile__plus");

const validationConfig = {
  formSelector: ".popup__profile, .popup__addpic, .popup__avatar-form",
  inputSelector: ".popup__name, .popup__about, .popup__avatar",
  submitButtonSelector: ".popup__save",
  inactiveButtonClass: "popup__save_disabled",
  inputErrorClass: "popup__input_type_error",
  errorClass: "popup__error_visible",
};

const profileFormValidator = new FormValidator(validationConfig, formProfile);
const addPicFormValidator = new FormValidator(validationConfig, formAddPic);
const avatarFormValidator = new FormValidator(validationConfig, formAvatar);

profileFormValidator.enableValidation();
addPicFormValidator.enableValidation();
avatarFormValidator.enableValidation();

const userInfo = new UserInfo({
  nameSelector: ".profile__name",
  jobSelector: ".profile__description",
});

const api = new Api({
  baseUrl: "https://around-api.pt-br.tripleten-services.com/v1",
  headers: {
    authorization: 69fd8912-d203-4d23-9e89-fec18278fd2c,
    "Content-Type": "application/json",
  },
});

let currentUserId = null;

const imagePopup = new PopupWithImage(popupImageSelector);
imagePopup.setEventListeners();

function handleCardClick(name, link) {
  imagePopup.open(name, link);
}

const confirmPopup = new PopupWithConfirmation(popupConfirmSelector);
confirmPopup.setEventListeners();

const cardSection = new Section(
  {
    items: [],
    renderer: (item) => {
      const cardElement = createCard(item);
      cardSection.addItem(cardElement);
    },
  },
  elementsSectionSelector
);

function createCard(data) {
  const card = new Card(
    data,
    currentUserId,
    "#cardTemplate",
    handleCardClick,
    handleDeleteClick,
    handleLikeClick
  );

  return card.generateCard();
}

function handleDeleteClick(cardInstance) {
  confirmPopup.setSubmitAction(() => {
    confirmPopup.renderLoading(true, "Excluindo...");

    api
      .deleteCard(cardInstance.getId())
      .then(() => {
        cardInstance.removeCard();
        confirmPopup.close();
      })
      .catch((err) => console.log(err))
      .finally(() => {
        confirmPopup.renderLoading(false);
      });
  });

  confirmPopup.open();
}

function handleLikeClick(cardInstance) {
  const request = cardInstance.isLiked()
    ? api.removeLike(cardInstance.getId())
    : api.addLike(cardInstance.getId());

  request
    .then((updatedCard) => {
      cardInstance.setLikeState(updatedCard.isLiked);
    })
    .catch((err) => console.log(err));
}

const editProfilePopup = new PopupWithForm(popupProfileSelector, (formData) => {
  editProfilePopup.renderLoading(true);

  api
    .updateUserInfo({ name: formData.name, about: formData.about })
    .then((userData) => {
      userInfo.setUserInfo({ name: userData.name, job: userData.about });

      profileNameElement.textContent = userData.name;
      profileDescElement.textContent = userData.about;

      editProfilePopup.close();
    })
    .catch((err) => console.log(err))
    .finally(() => {
      editProfilePopup.renderLoading(false);
    });
});
editProfilePopup.setEventListeners();

const addCardPopup = new PopupWithForm(popupAddPicSelector, (formData) => {
  addCardPopup.renderLoading(true);

  const newCardData = {
    name: formData["local-name"] || "",
    link: formData.link || "",
  };

  api
    .addCard(newCardData)
    .then((cardData) => {
      const cardElement = createCard(cardData);
      cardSection.addItem(cardElement);

      addCardPopup.close();
      addPicFormValidator.resetValidation();
    })
    .catch((err) => console.log(err))
    .finally(() => {
      addCardPopup.renderLoading(false);
    });
});
addCardPopup.setEventListeners();

const avatarPopup = new PopupWithForm(popupAvatarSelector, (formData) => {
  avatarPopup.renderLoading(true);

  const url = (formData.avatar || "").trim();

  api
    .updateAvatar(url)
    .then((userData) => {
      if (avatarElement) avatarElement.src = userData.avatar;
      avatarPopup.close();
      avatarFormValidator.resetValidation();
    })
    .catch((err) => console.log(err))
    .finally(() => {
      avatarPopup.renderLoading(false);
    });
});
avatarPopup.setEventListeners();

btnEditProfile.addEventListener("click", () => {
  profileFormValidator.resetValidation();
  profileInputName.value = profileNameElement.textContent.trim();
  profileInputAbout.value = profileDescElement.textContent.trim();
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

api
  .getAppInfo()
  .then(([userData, initialCards]) => {
    currentUserId = userData._id;

    profileNameElement.textContent = userData.name;
    profileDescElement.textContent = userData.about;
    if (avatarElement) avatarElement.src = userData.avatar;

    cardSection.setItems(initialCards);
    cardSection.renderItems();
  })
  .catch((err) => console.log(err));
