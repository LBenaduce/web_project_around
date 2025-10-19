const editBtn = document.querySelector('.profile__pen');
const addBtn = document.querySelector('.profile__plus');

const popupProfile = document.getElementById('popup-profile');
const popupAdd = document.getElementById('popup-addpic');
const popupImage = document.getElementById('popup');
const popupConfirm = document.getElementById('popup-confirm');

const closeButtons = document.querySelectorAll('.popup__close, .popup__close-zoom');

const profileForm = popupProfile.querySelector('.popup__profile');
const nameInput = popupProfile.querySelector('.popup__name#name');
const aboutInput = popupProfile.querySelector('.popup__about#about');

const profileName = document.querySelector('.profile__name');
const profileDesc = document.querySelector('.profile__description');

const addForm = popupAdd.querySelector('.popup__addpic');
const titleInput = popupAdd.querySelector('#local-name');
const linkInput = popupAdd.querySelector('#link');

const zoomImg = document.getElementById('popupimg');
const zoomCaption = document.getElementById('popupCaption');

const elementsSection = document.querySelector('.elements');
const cardTemplate = document.getElementById('cardTemplate').content;

const initialCards = [
  { name: "Vale de Yosemite", link: "https://practicum-content.s3.us-west-1.amazonaws.com/web-code/moved_yosemite.jpg" },
  { name: "Lago Louise", link: "https://practicum-content.s3.us-west-1.amazonaws.com/web-code/moved_lake-louise.jpg" },
  { name: "Montanhas Carecas", link: "https://practicum-content.s3.us-west-1.amazonaws.com/web-code/moved_bald-mountains.jpg" },
  { name: "Latemar", link: "https://practicum-content.s3.us-west-1.amazonaws.com/web-code/moved_latemar.jpg" },
  { name: "Parque Nacional da Vanoise", link: "https://practicum-content.s3.us-west-1.amazonaws.com/web-code/moved_vanoise.jpg" },
  { name: "Lago di Braies", link: "https://practicum-content.s3.us-west-1.amazonaws.com/web-code/moved_lago.jpg" }
];

function openPopup(p) {
  p.classList.remove('popup-hidden');
  document.addEventListener('keydown', handleEsc);
}

function closePopup(p) {
  p.classList.add('popup-hidden');
  document.removeEventListener('keydown', handleEsc);
}

function handleEsc(e) {
  if (e.key === 'Escape') {
    const opened = document.querySelector('.popup:not(.popup-hidden)');
    if (opened) closePopup(opened);
  }
}

closeButtons.forEach((btn) => {
  btn.addEventListener('click', () => {
    const p = btn.closest('.popup');
    if (p) closePopup(p);
  });
});

document.querySelectorAll('.popup').forEach((p) => {
  p.addEventListener('mousedown', (e) => {
    if (e.target === p) closePopup(p);
  });
});

editBtn.addEventListener('click', () => {
  nameInput.value = profileName.textContent;
  aboutInput.value = profileDesc.textContent;
  openPopup(popupProfile);
});

profileForm.addEventListener('submit', (e) => {
  e.preventDefault();
  profileName.textContent = nameInput.value.trim();
  profileDesc.textContent = aboutInput.value.trim();
  closePopup(popupProfile);
});

addBtn.addEventListener('click', () => openPopup(popupAdd));

addForm.addEventListener('submit', (e) => {
  e.preventDefault();
  const card = createCard({ name: titleInput.value.trim(), link: linkInput.value.trim() });
  elementsSection.prepend(card);
  addForm.reset();
  closePopup(popupAdd);
});

function createCard({ name, link }) {
  const node = cardTemplate.querySelector('.elements__card').cloneNode(true);
  const img = node.querySelector('.elements__image');
  const title = node.querySelector('.elements__text');
  const likeBtn = node.querySelector('.elements__like');
  const removeBtn = node.querySelector('.elements__remove');

  title.textContent = name;
  img.src = link;
  img.alt = name;

  likeBtn.addEventListener('click', () => {
    likeBtn.classList.toggle('elements__like_active');
    likeBtn.setAttribute('aria-pressed', likeBtn.classList.contains('elements__like_active'));
  });

  removeBtn.addEventListener('click', () => {
    const toDelete = node;
    openPopup(popupConfirm);
    const yesBtn = popupConfirm.querySelector('.popup__save-confirm');
    const onYes = () => {
      toDelete.remove();
      yesBtn.removeEventListener('click', onYes);
      closePopup(popupConfirm);
    };
    yesBtn.addEventListener('click', onYes, { once: true });
  });

  img.addEventListener('click', () => {
    zoomImg.src = link;
    zoomImg.alt = name;
    zoomCaption.textContent = name;
    openPopup(popupImage);
  });

  return node;
}

function renderInitial(cards) {
  const frag = document.createDocumentFragment();
  cards.forEach((c) => frag.appendChild(createCard(c)));
  elementsSection.appendChild(frag);
}

document.addEventListener('DOMContentLoaded', () => renderInitial(initialCards));
