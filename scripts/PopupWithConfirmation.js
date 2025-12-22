import Popup from "./Popup.js";

export default class PopupWithConfirmation extends Popup {
  constructor(popupSelector) {
    super(popupSelector);

    this._confirmButton = this._popup.querySelector(".popup__save--confirm");
    this._cancelButton = this._popup.querySelector(".popup__save--cancel");

    this._defaultConfirmText = this._confirmButton
      ? this._confirmButton.textContent
      : "Sim";

    this._handleConfirm = () => {};
  }

  setSubmitAction(action) {
    this._handleConfirm = action;
  }

  renderLoading(isLoading, loadingText = "Excluindo...") {
    if (!this._confirmButton) return;
    this._confirmButton.textContent = isLoading
      ? loadingText
      : this._defaultConfirmText;
  }

  setEventListeners() {
    super.setEventListeners();

    if (this._confirmButton) {
      this._confirmButton.addEventListener("click", () => {
        this._handleConfirm();
      });
    }

    if (this._cancelButton) {
      this._cancelButton.addEventListener("click", () => {
        this.close();
      });
    }
  }
}
