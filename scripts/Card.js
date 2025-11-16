export default class Card {
  constructor(data, templateSelector, handleCardClick) {
    this._name = data.name;
    this._link = data.link;
    this._templateSelector = templateSelector;
    this._handleCardClick = handleCardClick;
  }

  _getTemplate() {
    const cardTemplate = document
      .querySelector(this._templateSelector)
      .content
      .querySelector('.card') 
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
    this._likeButton.classList.toggle('card__like-button_active');
  }

  _handleDeleteCard() {
    this._element.remove();
    this._element = null;
  }

  _handleImageClick() {
    this._handleCardClick(this._name, this._link);
  }

  generateCard() {
    this._element = this._getTemplate();

    this._imageElement = this._element.querySelector('.card__image');
    this._titleElement = this._element.querySelector('.card__title');
    this._likeButton = this._element.querySelector('.card__like-button');
    this._deleteButton = this._element.querySelector('.card__delete-button');

    this._imageElement.src = this._link;
    this._imageElement.alt = this._name;
    this._titleElement.textContent = this._name;

    this._setEventListeners();

    return this._element;
  }
}
