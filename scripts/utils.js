const POPUP_OPENED_CLASS = 'popup_opened';

function handleEscClose(evt) {
  if (evt.key === 'Escape') {
    const opened = document.querySelector(`.${POPUP_OPENED_CLASS}`);
    if (opened) {
      closePopup(opened);
    }
  }
}

function openPopup(popup) {
  popup.classList.remove('popup-hidden');
  popup.classList.add(POPUP_OPENED_CLASS);
  document.addEventListener('keydown', handleEscClose);
}

function closePopup(popup) {
  popup.classList.remove(POPUP_OPENED_CLASS);
  popup.classList.add('popup-hidden');

  if (!document.querySelector(`.${POPUP_OPENED_CLASS}`)) {
    document.removeEventListener('keydown', handleEscClose);
  }
}

function setClosePopupByOverlay(popup) {
  popup.addEventListener('mousedown', (evt) => {
    if (
      evt.target === popup ||
      evt.target.classList.contains('popup__close') ||
      evt.target.classList.contains('popup__close-zoom')
    ) {
      closePopup(popup);
    }
  });
}

export {
  openPopup,
  closePopup,
  setClosePopupByOverlay
};

export const initialCards = [
  {
    name: 'Vale de Yosemite',
    link: 'images/yosemite.png'
  },
  {
    name: 'Lago Louise',
    link: 'images/louise.png'
  },
  {
    name: 'Montanhas Carecas',
    link: 'images/montanhas.png'
  },
  {
    name: 'Latemar',
    link: 'images/latemar.png'
  },
  {
    name: 'Parque Nacional de Vanoise',
    link: 'images/vanoise.png'
  },
  {
    name: 'Lago di Braies',
    link: 'images/braies.png'
  }
];

