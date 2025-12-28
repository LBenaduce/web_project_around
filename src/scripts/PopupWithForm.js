import { Api } from "./Api.js";
import { Popup } from "./Popup.js";

export class PopupWithForm extends Popup {
  constructor(popupSelector, handleFormSubmit) {
    super(popupSelector);
    this._handleFormSubmit = handleFormSubmit;
    this._form = this._popup.querySelector("form");
    this._inputList = Array.from(this._form.querySelectorAll("input"));
    this._submitButton = this._form.querySelector('button[type="submit"]');
    this._defaultButtonText = this._submitButton.textContent;
  }

  _getInputValues() {
    const formValues = {};
    this._inputList.forEach((input) => {
      formValues[input.name] = input.value;
    });
    return formValues;
  }
  setLoading(isLoading) {
    if (isLoading) {
      this._submitButton.textContent = "Salvando...";
      this._submitButton.disabled = true;
    } else {
      this._submitButton.textContent = this._defaultButtonText;
      this._submitButton.disabled = false;
    }
  }
  setEventListeners() {
    super.setEventListeners();
    this._form.addEventListener("submit", (evt) => {
      evt.preventDefault();
      this.setLoading(true);
      this._handleFormSubmit(this._getInputValues()).finally(() => {
        this.setLoading(false);
      });
    });
  }

  close() {
    super.close();
    this._form.reset();
  }
}