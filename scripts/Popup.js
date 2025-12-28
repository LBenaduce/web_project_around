export class Popup {
  constructor(popupSelector) {
    this._popup = document.querySelector(popupSelector);
  }

  _handleEscClose = (evt) => {
    if (evt.key === "Escape") {
      this.close();
    }
  };

  open() {
    this._popup.classList.remove("popup-hidden");
    document.addEventListener("keydown", this._handleEscClose);
  }

  close() {
    this._popup.classList.add("popup-hidden");
    document.removeEventListener("keydown", this._handleEscClose);
  }

  setEventListeners() {
    this._popup
      .querySelector(".popup__close")
      .addEventListener("click", () => this.close());

    this._popup.addEventListener("mousedown", (evt) => {
      if (evt.target === this._popup) {
        this.close();
      }
    });
  }
}