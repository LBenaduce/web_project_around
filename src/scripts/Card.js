export default class Card {
  constructor(
    data,
    currentUserId,
    templateSelector,
    handleCardClick,
    handleDeleteClick,
    handleLikeClick
  ) {
    this._name = data.name;
    this._link = data.link;
    this._id = data._id;

    this._ownerId = data.owner?._id || data.owner;
    this._likes = Array.isArray(data.likes) ? data.likes : [];
    this._currentUserId = currentUserId;

    this._templateSelector = templateSelector;
    this._handleCardClick = handleCardClick;
    this._handleDeleteClick = handleDeleteClick;
    this._handleLikeClick = handleLikeClick;
  }

  _getTemplate() {
    const template = document.querySelector(this._templateSelector);
    return template.content.querySelector(".elements__card").cloneNode(true);
  }

  getId() {
    return this._id;
  }

  isLiked() {
    if (!Array.isArray(this._likes)) return false;

    return this._likes.some((user) =>
      typeof user === "string"
        ? user === this._currentUserId
        : user?._id === this._currentUserId
    );
  }

  setLikes(likes) {
    this._likes = Array.isArray(likes) ? likes : [];

    const liked = this.isLiked();
    this._likeButton.classList.toggle("elements__like-on", liked);

    if (this._likeCount) {
      this._likeCount.textContent = this._likes.length;
    }
  }

  removeCard() {
    this._element.remove();
    this._element = null;
  }

  _setEventListeners() {
    this._likeButton.addEventListener("click", () => {
      this._handleLikeClick(this);
    });

    this._deleteButton.addEventListener("click", () => {
      this._handleDeleteClick(this);
    });

    this._image.addEventListener("click", () => {
      this._handleCardClick(this._name, this._link);
    });
  }

  generateCard() {
    this._element = this._getTemplate();

    this._image = this._element.querySelector(".elements__image");
    this._deleteButton = this._element.querySelector(".elements__remove");
    this._likeButton = this._element.querySelector(".elements__like");
    this._title = this._element.querySelector(".elements__text");
    this._likeCount = this._element.querySelector(".elements__like-count");

    this._image.src = this._link;
    this._image.alt = this._name;
    this._title.textContent = this._name;

    if (this._ownerId !== this._currentUserId) {
      this._deleteButton.style.display = "none";
    }

    this.setLikes(this._likes);
    this._setEventListeners();

    return this._element;
  }
}
