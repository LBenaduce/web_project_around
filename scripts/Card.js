export default class Card {
  constructor(
    data,
    userId,
    templateSelector,
    handleCardClick,
    handleDeleteClick,
    handleLikeClick
  ) {
    this._name = data.name;
    this._link = data.link;

    this._id = data._id || null;

    
    this._ownerId = data.owner?._id || userId;

    this._likes = data.likes || [];
    this._userId = userId;

    this._isLiked = this._likes.some(
      (user) => user._id === this._userId
    );

    this._templateSelector = templateSelector;

    this._handleCardClick = handleCardClick;
    this._handleDeleteClick = handleDeleteClick;
    this._handleLikeClick = handleLikeClick;
  }

  _getTemplate() {
    return document
      .querySelector(this._templateSelector)
      .content
      .querySelector(".elements__card")
      .cloneNode(true);
  }

  getId() {
    return this._id;
  }

  isLiked() {
    return this._isLiked;
  }

  setLikeState(isLiked) {
    this._isLiked = isLiked;
    this._likeButton.classList.toggle(
      "elements__like-on",
      this._isLiked
    );
  }

  removeCard() {
    this._element.remove();
    this._element = null;
  }

  _setEventListeners() {
    this._likeButton.addEventListener("click", () => {
      this._handleLikeClick(this);
    });

    if (this._deleteButton) {
      this._deleteButton.addEventListener("click", () => {
        this._handleDeleteClick(this);
      });
    }

    this._imageElement.addEventListener("click", () => {
      this._handleCardClick(this._name, this._link);
    });
  }

  generateCard() {
    this._element = this._getTemplate();

    this._imageElement = this._element.querySelector(".elements__image");
    this._titleElement = this._element.querySelector(".elements__text");
    this._likeButton = this._element.querySelector(".elements__like");
    this._deleteButton = this._element.querySelector(".elements__remove");

    this._imageElement.src = this._link;
    this._imageElement.alt = this._name;
    this._titleElement.textContent = this._name;

    
    if (this._ownerId !== this._userId && this._deleteButton) {
      this._deleteButton.remove();
      this._deleteButton = null;
    }

    this.setLikeState(this._isLiked);
    this._setEventListeners();

    return this._element;
  }
}
