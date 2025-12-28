import { Popup } from "./Popup.js";

export class PopupWithConfirmation extends Popup {
  constructor(popupSelector) {
    super(popupSelector);
    this._confirmButton = this._popup.querySelector(".popup__save-confirm");
  }

  setSubmitAction(action) {
    this._handleSubmit = action;
  }

  setEventListeners() {
    super.setEventListeners();

    this._confirmButton.addEventListener("click", (evt) => {
      evt.preventDefault();
      if (this._handleSubmit) {
        this._handleSubmit();
      }
    });
  }
}