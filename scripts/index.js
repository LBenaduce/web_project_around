import { UserInfo } from "../components/UserInfo.js";
import { PopupWithConfirmation } from "../components/PopupwithConfirmation.js";
import { PopupWithForm } from "../components/PopupWithForm.js";
import { PopupWithImage } from "../components/PopupWithImage.js";
import { Section } from "../components/Section.js";
import { Card } from "../components/Card.js";
import { Api } from "../components/Api.js";
import { FormValidator, validation } from "../components/formValidator.js";
import { Utils } from "../components/utils.js";

const utils = new Utils({
  form: document.querySelector(".popup__profile"),
  title: document.querySelector("h1"),
  editname: document.querySelector("#name"),
  description: document.querySelector(".profile__description"),
  about: document.querySelector("#about"),
  popup: document.querySelector(".popup"),
  editprofile: document.querySelector(".profile__pen"),
  addpic: document.querySelector(".profile__plus"),
  photoAdd: document.querySelector("#popup-addpic"),
});

const api = new Api({
  baseUrl: "https://around-api.pt-br.tripleten-services.com/v1",
  headers: {
    authorization: "79b24936-a205-4985-b1d0-6eeb1d8f406b",
    "Content-Type": "application/json",
  },
});

const onLike = (id, isLiked) => {
  if (isLiked) {
    return api.likeCard(id);
  } else {
    return api.unlikeCard(id);
  }
};

let cardSection;
function createCard(item) {
  const card = new Card(
    {
      name: item.name,
      linkUrl: item.link,
      id: item._id,
      isLiked: item.isLiked || false,
      ownerId: item.owner?._id,
      currentUserId: currentUserId,
    },
    "#cardTemplate",
    handleCardClick,
    () => {
      popupConfirm.setSubmitAction(() => {
        api
          .deleteCard(item._id)
          .then(() => {
            card._handleDelete();
            popupConfirm.close();
          })
          .catch((err) => console.error("Erro ao excluir card:", err));
      });
      popupConfirm.open();
    },
    onLike
  );

  return card.generateCard();
}

function loadCards() {
  api
    .getCards()
    .then((data) => {
      console.log("Resposta da API:", data);
      cardSection = new Section(
        {
          items: data,
          renderer: (item) => createCard(item),
        },

        ".elements"
      );
      cardSection.renderItems();
    })
    .catch((err) => console.error("erro ao buscar Cards:", err));
}
const popupWithImage = new PopupWithImage(
  "#popup",
  document.querySelector("#popupimg"),
  document.querySelector("#popupCaption")
);
popupWithImage.setEventListeners();

const popupConfirm = new PopupWithConfirmation("#popup-confirm");
popupConfirm.setEventListeners();

function handleCardClick(name, link) {
  console.log("handleCardClick chamada com:", name, link);
  popupWithImage.open({ name, link });
}

const userInfo = new UserInfo({
  nameSelector: ".profile__name",
  aboutSelector: ".profile__description",
});

let currentUserId;
api
  .getUserInfo()
  .then((userData) => {
    currentUserId = userData._id;
    userInfo.setUserInfo({
      name: userData.name,
      about: userData.about,
    });
    document.querySelector(".profile__avatar").src = userData.avatar;
    loadCards();
  })
  .catch((err) => {
    console.error("Erro ao carregar dados do usuário:", err);
  });

const profilePopup = new PopupWithForm("#popup-profile", (formData) => {
  return api
    .updateUserInfo({
      name: formData.name,
      about: formData.about,
    })
    .then((updatedUser) => {
      userInfo.setUserInfo({
        name: updatedUser.name,
        about: updatedUser.about,
      });
      profilePopup.close();
    })
    .catch((err) => {
      console.error("Erro ao atualizar perfil:", err);
    });
});

profilePopup.setEventListeners();

const addPlacePopup = new PopupWithForm("#popup-addpic", (formData) => {
  return api
    .createCard({
      name: formData["local-name"],
      link: formData.link,
    })
    .then((newCard) => {
      newCard.owner = { _id: currentUserId };
      const cardElement = createCard(newCard);
      cardSection.addItem(cardElement);
      addPlacePopup.close();
    })

    .catch((err) => console.error("erro ao criar card", err));
});

addPlacePopup.setEventListeners();

const avatarOverlay = document.querySelector(".profile__avatar-overlay");
const avatarPopup = document.querySelector("#popup-avatar");
const avatarPopupForm = new PopupWithForm("#popup-avatar", (formData) => {
  if (!isValidUrl(formData.avatar)) {
    return Promise.reject("URL do avatar Inválida");
  }
  console.log("enviando para updateAvatar:", formData.avatar);
  return api
    .updateAvatar(formData.avatar)
    .then((res) => {
      document.querySelector(".profile__avatar").src = res.avatar;
      avatarPopupForm.close();
    })
    .catch((err) => {
      console.error("Erro ao atualizar avatar:", err);
    });
});

avatarPopupForm.setEventListeners();

avatarOverlay.addEventListener("click", () => {
  avatarPopupForm.open();
});

function isValidUrl(string) {
  try {
    new URL(string);
    return true;
  } catch (_) {
    return false;
  }
}