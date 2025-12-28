import Card from "./Card.js";
import FormValidator from "./FormValidator.js";
import Section from "./Section.js";
import PopupWithImage from "./PopupWithImage.js";
import PopupWithForm from "./PopupWithForm.js";
import PopupWithConfirmation from "./PopupWithConfirmation.js";
import UserInfo from "./UserInfo.js";
import Api from "./Api.js";

const elementsSectionSelector = ".elements__list";

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

const api = new Api({
  baseUrl: "https://around-api.pt-br.tripleten-services.com/v1",
  headers: {
    authorization: "6f52aaa4-1ad3-40e3-9da3-068576075181",
    "Content-Type": "application/json"
  }
});

let currentUserId = null;

const userInfo = new UserInfo({
  nameSelector: ".profile__name",
  jobSelector: ".profile__description",
});

const imagePopup = new PopupWithImage(popupImageSelector);
imagePopup.setEventListeners();

const confirmPopup = new PopupWithConfirmation(popupConfirmSelector);
confirmPopup.setEventListeners();

function handleCardClick(name, link) {
  imagePopup.open(name, link);
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
      .catch(console.log)
      .finally(() => confirmPopup.renderLoading(false));
  });

  confirmPopup.open();
}

function handleLikeClick(cardInstance) {
  const request = cardInstance.isLiked()
    ? api.removeLike(cardInstance.getId())
    : api.addLike(cardInstance.getId());

  request
    .then((updatedCard) => {
      const isLiked = updatedCard.likes.some(
        (user) => user._id === currentUserId
      );
      cardInstance.setLikeState(isLiked);
    })
    .catch(console.log);
}

function createCard(data) {
  const isLiked = data.likes.some(
    (user) => user._id === currentUserId
  );

  const card = new Card(
    { ...data, isLiked },
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
    renderer: (item) => {
      cardSection.addItem(createCard(item));
    },
  },
  elementsSectionSelector
);

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

const editProfilePopup = new PopupWithForm(
  popupProfileSelector,
  (formData) => {
    editProfilePopup.renderLoading(true);

    api
      .updateUserInfo(formData)
      .then((userData) => {
        userInfo.setUserInfo({
          name: userData.name,
          job: userData.about,
        });
        editProfilePopup.close();
      })
      .catch(console.log)
      .finally(() => editProfilePopup.renderLoading(false));
  }
);
editProfilePopup.setEventListeners();

const addCardPopup = new PopupWithForm(
  popupAddPicSelector,
  (formData) => {
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
      .catch(console.log)
      .finally(() => addCardPopup.renderLoading(false));
  }
);
addCardPopup.setEventListeners();

const avatarPopup = new PopupWithForm(
  popupAvatarSelector,
  (formData) => {
    avatarPopup.renderLoading(true);

    api
      .updateAvatar(formData.avatar)
      .then((userData) => {
        avatarElement.src = userData.avatar;
        avatarPopup.close();
        avatarFormValidator.resetValidation();
      })
      .catch(console.log)
      .finally(() => avatarPopup.renderLoading(false));
  }
);
avatarPopup.setEventListeners();

api
  .getAppInfo()
  .then(([userData, initialCards]) => {
    currentUserId = userData._id;

    userInfo.setUserInfo({
      name: userData.name,
      job: userData.about,
    });

    avatarElement.src = userData.avatar;

    cardSection.setItems(initialCards);
    cardSection.renderItems();
  })
  .catch(console.log);
