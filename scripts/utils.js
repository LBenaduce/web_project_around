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
