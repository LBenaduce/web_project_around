const profileEditButton = document.querySelector('.profile__edit-button');
const editPopup = document.getElementById('edit-popup');
const closeButton = editPopup.querySelector('.popup__close');
const nameInput = editPopup.querySelector('input[name="name"]');
const aboutInput = editPopup.querySelector('input[name="about"]');
const profileName = document.querySelector('.profile__name');
const profileJob = document.querySelector('.profile__job');
const form = editPopup.querySelector('.popup__form');

function openPopup() {
  editPopup.classList.add('popup_opened');
  nameInput.value = profileName.textContent;
  aboutInput.value = profileJob.textContent;
}

function closePopup() {
  editPopup.classList.remove('popup_opened');
}

profileEditButton.addEventListener('click', openPopup);
closeButton.addEventListener('click', closePopup);

form.addEventListener('submit', (e) => {
  e.preventDefault();
  profileName.textContent = nameInput.value;
  profileJob.textContent = aboutInput.value;
  closePopup();
});

editPopup.addEventListener('mousedown', (e) => {
  if (e.target === editPopup) closePopup();
});

document.addEventListener('keydown', (e) => {
  if (e.key === 'Escape') closePopup();
});
