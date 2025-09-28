const profileEditButton = document.querySelector('.profile__edit-button');
const editPopup = document.getElementById('edit-popup');
const closeButton = editPopup.querySelector('.popup__close');
const nameInput = editPopup.querySelector('input[name="name"]');
const aboutInput = editPopup.querySelector('input[name="about"]');
const profileName = document.querySelector('.profile__name');
const profileJob = document.querySelector('.profile__job');
const form = editPopup.querySelector('.popup__form');

function openPopup(popup) {
  popup.classList.add('popup_opened');
}

function closePopup(popup) {
  popup.classList.remove('popup_opened');
}

function openEditProfilePopup() {
  nameInput.value = profileName.textContent;
  aboutInput.value = profileJob.textContent;
  openPopup(editPopup);
}

function handleProfileSubmit(e) {
  e.preventDefault();
  profileName.textContent = nameInput.value;
  profileJob.textContent = aboutInput.value;
  closePopup(editPopup);
}

profileEditButton.addEventListener('click', openEditProfilePopup);
closeButton.addEventListener('click', () => closePopup(editPopup));
form.addEventListener('submit', handleProfileSubmit);

editPopup.addEventListener('mousedown', (e) => {
  if (e.target === editPopup) closePopup(editPopup);
});

document.addEventListener('keydown', (e) => {
  if (e.key === 'Escape') closePopup(editPopup);
});
