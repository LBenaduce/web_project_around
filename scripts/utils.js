const popupOpenedClass = 'popup_opened';

function handleEscClose(evt) {
  if (evt.key === 'Escape') {
    const openedPopup = document.querySelector(`.${popupOpenedClass}`);
    if (openedPopup) {
      closePopup(openedPopup);
    }
  }
}

function openPopup(popup) {
  popup.classList.add(popupOpenedClass);
  document.addEventListener('keydown', handleEscClose);
}

function closePopup(popup) {
  popup.classList.remove(popupOpenedClass);
  document.removeEventListener('keydown', handleEscClose);
}

function setClosePopupByOverlay(popup) {
  popup.addEventListener('mousedown', (evt) => {
    if (
      evt.target.classList.contains('popup_opened') ||
      evt.target.classList.contains('popup__close')
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
