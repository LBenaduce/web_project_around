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

  _setEventListeners() {
    this._likeButton.addEventListener('click', () => {
      this._handleLikeIcon();
    });

    this._deleteButton.addEventListener('click', () => {
      this._handleDeleteCard();
    });

    this._imageElement.addEventListener('click', () => {
      this._handleImageClick();
    });
  }

  _handleLikeIcon() {
    this._likeButton.classList.toggle('elements__like_active');
  }

  _handleDeleteCard() {
    if (this._handleDeleteClick) {
      this._handleDeleteClick(this._element);
    }
  }

  _handleImageClick() {
    if (this._handleCardClick) {
      this._handleCardClick(this._name, this._link);
    }
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
