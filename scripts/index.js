const elementsSection = document.querySelector(".elements");
const cardTemplate = document.querySelector("#cardTemplate").content;

const initialCards = [
  { name: "Yosemite", link: "./images/yosemite.png" },
  { name: "Lago Louise", link: "./images/louise.png" },
  { name: "Montanhas", link: "./images/montanhas.png" },
  { name: "Latemar", link: "./images/latemar.png" },
  { name: "Vanoise", link: "./images/vanoise.png" },
  { name: "Braies", link: "./images/braies.png" },
];

function openPopup(popup) {
  popup.classList.remove("popup-hidden");
  document.addEventListener("keydown", onEscClose);
}
function closePopup(popup) {
  popup.classList.add("popup-hidden");
  document.removeEventListener("keydown", onEscClose);
}
function onEscClose(evt) {
  if (evt.key === "Escape") {
    document.querySelectorAll(".popup").forEach((p) => p.classList.add("popup-hidden"));
  }
}

function createCard({ name, link }) {
  const card = cardTemplate.querySelector(".elements__card").cloneNode(true);
  const img = card.querySelector(".elements__image");
  const title = card.querySelector(".elements__text");
  const likeBtn = card.querySelector(".elements__like");
  const removeBtn = card.querySelector(".elements__remove");

  img.src = link;
  img.alt = name;
  title.textContent = name;

  likeBtn.addEventListener("click", () => {
    likeBtn.classList.toggle("elements__like_active");
  });

  removeBtn.addEventListener("click", () => {
    card.remove();
  });

  const zoomPopup = document.getElementById("popup");
  const zoomImg = document.getElementById("popupimg");
  const zoomCaption = document.getElementById("popupCaption");
  const zoomClose = zoomPopup?.querySelector(".popup__close-zoom");

  if (zoomPopup && zoomImg && zoomCaption && zoomClose) {
    img.addEventListener("click", () => {
      zoomImg.src = link;
      zoomImg.alt = name;
      zoomCaption.textContent = name;
      openPopup(zoomPopup);
    });
    zoomClose.addEventListener("click", () => closePopup(zoomPopup));
  }

  return card;
}

function renderInitialCards() {
  const fragment = document.createDocumentFragment();
  initialCards.forEach((item) => fragment.appendChild(createCard(item)));
  elementsSection.appendChild(fragment);
}

const addPopup = document.getElementById("popup-addpic");
const addForm = document.getElementById("place");
const addClose = addPopup?.querySelector(".popup__close");

addForm?.addEventListener("submit", (evt) => {
  evt.preventDefault();
  const nameInput = document.getElementById("local-name");
  const linkInput = document.getElementById("link");

  const name = nameInput.value.trim();
  const link = linkInput.value.trim();

  if (!name || !link) return;

  elementsSection.prepend(createCard({ name, link }));
  addForm.reset();
  closePopup(addPopup);
});

addClose?.addEventListener("click", () => closePopup(addPopup));

const profilePopup = document.getElementById("popup-profile");
const profileClose = profilePopup?.querySelector(".popup__close");
const editBtn = document.querySelector(".profile__pen");

editBtn?.addEventListener("click", () => openPopup(profilePopup));
profileClose?.addEventListener("click", () => closePopup(profilePopup));

const addBtn = document.querySelector(".profile__plus");
addBtn?.addEventListener("click", () => openPopup(addPopup));

renderInitialCards();
