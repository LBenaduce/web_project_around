export default class Card {
  constructor(data, templateSelector, handleCardClick, handleDeleteClick) {
    this._name = data.name;
    this._link = data.link;
    this._templateSelector = templateSelector;
    this._handleCardClick = handleCardClick;
    this._handleDeleteClick = handleDeleteClick;
  }

  _getTemplate() {
    const cardTemplate = document
      .querySelector(this._templateSelector)
      .content
      .querySelector('.elements__card')
      .cloneNode(true);

    return cardTemplate;
  }

  _toggleLike() {
    this._likeButton.classList.toggle('elements__like-on');
  }

  _setEventListeners() {
    this._likeButton.addEventListener('click', () => {
      this._toggleLike();
    });

    this._deleteButton.addEventListener('click', () => {
      this._handleDeleteClick(this._element);
    });

    this._imageElement.addEventListener('click', () => {
      this._handleCardClick(this._name, this._link);
    });
  }

  generateCard() {
    this._element = this._getTemplate();

    this._imageElement = this._element.querySelector('.elements__image');
    this._titleElement = this._element.querySelector('.elements__text');
    this._likeButton = this._element.querySelector('.elements__like');
    this._deleteButton = this._element.querySelector('.elements__remove');

    this._imageElement.src = this._link;
    this._imageElement.alt = this._name;
    this._titleElement.textContent = this._name;

    this._setEventListeners();

    return this._element;
  }
}
