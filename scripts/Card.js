class Card {
  constructor(
    { name, linkUrl, id, isLiked, ownerId, currentUserId },
    templateSelector,
    handleCardClick,
    onDelete,
    onLike
  ) {
    this._name = name;
    this._linkUrl = linkUrl;
    this._id = id;
    this._isLiked = isLiked;
    this._ownerId=ownerId;
    this._currentUserId= currentUserId;
    this._templateSelector = templateSelector;
    this._handleCardClick = handleCardClick;
    this._onDelete = onDelete;
    this._onLike = onLike;
  }

  _getTemplate() {
    const template = document.querySelector(this._templateSelector);
    return template.content.querySelector(".elements__card").cloneNode(true);
  }

  _updateLikeView() {
    if (this._isLiked) {
      this._likeBTN.classList.add("elements__like-on");
    } else {
      this._likeBTN.classList.remove("elements__like-on");
    }
  }

  _handleLike(evt) {
    evt.target.classList.toggle("elements__like-on");
    this._isLiked = !this._isLiked;
    if (typeof this._onLike === "function") {
      this._onLike(this._id, this._isLiked).catch((err) => {
        evt.target.classList.toggle("elements__like-on");
        this._isLiked = !this._isLiked;
        console.error("erro ao curtir/descurtir card:", err);
      });
    }
  }

  _handleDelete() {
    this._element.remove();
    this._element = null;
  }

  _setEventListener() {
    this._likeBTN.addEventListener("click", (evt) => this._handleLike(evt));
    this._deleteButton.addEventListener("click", () => {
      if (typeof this._onDelete === "function") {
        this._onDelete()
          .then(() => {
            this._handleDelete();
          })
          .catch((err) => {
            console.error("erro ao deletar o card", err);
          });
      } else {
        this._handleDelete;
      }
    });

    this._image.addEventListener("click", () =>
      this._handleCardClick(this._name, this._linkUrl)
    );
  }

  generateCard() {
    this._element = this._getTemplate();

    this._likeBTN = this._element.querySelector(".elements__like");
    this._deleteButton = this._element.querySelector(".elements__remove");
    this._image = this._element.querySelector(".elements__image");
    const caption = this._element.querySelector(".elements__text");

    this._image.src = this._linkUrl;
    this._image.alt = this._name;
    caption.textContent = this._name;

    if(this._ownerId !== this._currentUserId){
      this._deleteButton.style.display = "none";
    }

    this._updateLikeView();
    this._setEventListener();

    return this._element;
  }
}

export { Card };