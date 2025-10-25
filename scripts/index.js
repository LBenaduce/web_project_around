const elementsSection = document.querySelector(".elements");
const profileName = document.querySelector(".profile__name");
const profileDesc = document.querySelector(".profile__description");

const popupProfile = document.querySelector("#popup-profile");
const popupAddPic = document.querySelector("#popup-addpic");
const popupImage = document.querySelector("#popup");
const popupConfirm = document.querySelector("#popup-confirm");
const popupAvatar = document.querySelector("#popup-avatar");

const btnEditProfile = document.querySelector(".profile__pen");
const btnAddPlace = document.querySelector(".profile__plus");

const formProfile = popupProfile.querySelector(".popup__profile");
const formAddPic = popupAddPic.querySelector(".popup__addpic");
const formAvatar = popupAvatar?.querySelector("#avatar-form");

const profileInputName = popupProfile.querySelector("#name");
const profileInputAbout = popupProfile.querySelector("#about");

const inputPlaceName = popupAddPic.querySelector("#local-name");
const inputPlaceLink = popupAddPic.querySelector("#link");

const zoomImg = popupImage.querySelector("#popupimg");
const zoomCaption = popupImage.querySelector("#popupCaption");

const confirmBtn = popupConfirm.querySelector(".popup__save--confirm");
const cancelBtn = popupConfirm.querySelector(".popup__save--cancel");
let cardToDelete = null;

const validationSettings = {
  formSelector: ".popup__profile, .popup__addpic, .popup__avatar-form",
  inputSelector: "input, textarea",
  submitButtonSelector: ".popup__save",
  inactiveButtonClass: "popup__save_disabled",
  inputErrorClass: "popup__input_type_error",
  errorClass: "popup__error_visible",
};

window.FormValidation.enableValidation(validationSettings);

function onEscClose(evt) {
  if (evt.key === "Escape") {
    const opened = document.querySelector(".popup_opened");
    if (opened) closePopup(opened);
  }
}

function openPopup(popup) {
  popup.classList.remove("popup-hidden");
  popup.classList.add("popup_opened");
  document.addEventListener("keydown", onEscClose);
  const form = popup.querySelector(".popup__profile, .popup__addpic, .popup__avatar-form");
  if (form && window.FormValidation?.resetValidation) {
    window.FormValidation.resetValidation(form, validationSettings);
  }
}

function closePopup(popup) {
  popup.classList.remove("popup_opened");
  popup.classList.add("popup-hidden");
  if (!document.querySelector(".popup_opened")) {
    document.removeEventListener("keydown", onEscClose);
  }
}

document.querySelectorAll(".popup").forEach((popup) => {
  popup.addEventListener("mousedown", (evt) => {
    if (evt.target === popup) closePopup(popup);
  });
});

document.querySelectorAll(".popup__close, .popup__close-zoom").forEach((btn) => {
  btn.addEventListener("click", () => closePopup(btn.closest(".popup")));
});

btnEditProfile.addEventListener("click", () => {
  profileInputName.value = profileName.textContent.trim();
  profileInputAbout.value = profileDesc.textContent.trim();
  openPopup(popupProfile);
});

btnAddPlace.addEventListener("click", () => openPopup(popupAddPic));

formProfile.addEventListener("submit", (e) => {
  e.preventDefault();
  if (!formProfile.checkValidity()) return;
  profileName.textContent = profileInputName.value.trim();
  profileDesc.textContent = profileInputAbout.value.trim();
  closePopup(popupProfile);
});

formAddPic.addEventListener("submit", (e) => {
  e.preventDefault();
  if (!formAddPic.checkValidity()) return;
  const name = inputPlaceName.value.trim();
  const link = inputPlaceLink.value.trim();
  const card = createCard({ name, link });
  elementsSection.prepend(card);
  formAddPic.reset();
  window.FormValidation.resetValidation(formAddPic, validationSettings);
  closePopup(popupAddPic);
});

if (formAvatar) {
  formAvatar.addEventListener("submit", (e) => {
    e.preventDefault();
    if (!formAvatar.checkValidity()) return;
    const url = popupAvatar.querySelector("#avatar-link").value.trim();
    const avatarEl = document.querySelector(".profile__avatar");
    if (avatarEl && url) avatarEl.src = url;
    formAvatar.reset();
    window.FormValidation.resetValidation(formAvatar, validationSettings);
    closePopup(popupAvatar);
  });
}

elementsSection.addEventListener("click", (e) => {
  const likeBtn = e.target.closest(".elements__like");
  const removeBtn = e.target.closest(".elements__remove");
  const img = e.target.closest(".elements__image");

  if (likeBtn) {
    likeBtn.classList.toggle("elements__like_active");
  }

  if (removeBtn) {
    cardToDelete = removeBtn.closest(".elements__card");
    openPopup(popupConfirm);
  }

  if (img) {
    const card = img.closest(".elements__card");
    const title = card.querySelector(".elements__text").textContent.trim();
    zoomImg.src = img.src;
    zoomImg.alt = title;
    zoomCaption.textContent = title;
    openPopup(popupImage);
  }
});

confirmBtn.addEventListener("click", () => {
  if (cardToDelete) {
    cardToDelete.remove();
    cardToDelete = null;
  }
  closePopup(popupConfirm);
});

cancelBtn.addEventListener("click", () => {
  cardToDelete = null;
  closePopup(popupConfirm);
});

function createCard({ name, link }) {
  const template = document.querySelector("#cardTemplate").content.querySelector(".elements__card");
  const card = template.cloneNode(true);
  const img = card.querySelector(".elements__image");
  const text = card.querySelector(".elements__text");
  img.src = link;
  img.alt = name;
  text.textContent = name;
  return card;
}

const initialCards = [
  { name: "Vale de Yosemite", link: "./images/yosemite.png" },
  { name: "Lago Louise", link: "./images/louise.png" },
  { name: "Montanhas Carecas", link: "./images/montanhas.png" },
  { name: "Latemar", link: "./images/latemar.png" },
  { name: "Parque Nacional Vanoise", link: "./images/vanoise.png" },
  { name: "Lago di Braies", link: "./images/braies.png" }
];

initialCards.forEach((data) => elementsSection.appendChild(createCard(data)));
