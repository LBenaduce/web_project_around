const getErrorEl = (formElement, inputElement) => {
  return (
    formElement.querySelector(`#${inputElement.id}-error`) ||
    formElement.querySelector(`[data-error-for="${inputElement.name}"]`) ||
    formElement.querySelector(`.${inputElement.id}-error`)
  );
};

const showInputError = (formElement, inputElement, message, settings) => {
  const errorElement = getErrorEl(formElement, inputElement);
  inputElement.classList.add(settings.inputErrorClass);
  if (errorElement) {
    errorElement.textContent = message;
    errorElement.classList.add(settings.errorClass);
  }
};

const hideInputError = (formElement, inputElement, settings) => {
  const errorElement = getErrorEl(formElement, inputElement);
  inputElement.classList.remove(settings.inputErrorClass);
  if (errorElement) {
    errorElement.textContent = "";
    errorElement.classList.remove(settings.errorClass);
  }
};

const checkInputValidity = (formElement, inputElement, settings) => {
  if (!inputElement.validity.valid) {
    showInputError(formElement, inputElement, inputElement.validationMessage, settings);
  } else {
    hideInputError(formElement, inputElement, settings);
  }
};

const hasInvalidInput = (inputs) => inputs.some((i) => !i.validity.valid);

const toggleButtonState = (inputs, button, settings) => {
  if (!button) return;
  if (hasInvalidInput(inputs)) {
    button.setAttribute("disabled", "true");
    button.classList.add(settings.inactiveButtonClass);
  } else {
    button.removeAttribute("disabled");
    button.classList.remove(settings.inactiveButtonClass);
  }
};

const setEventListeners = (formElement, settings) => {
  const inputList = Array.from(formElement.querySelectorAll(settings.inputSelector));
  const buttonElement = formElement.querySelector(settings.submitButtonSelector);

  toggleButtonState(inputList, buttonElement, settings);

  inputList.forEach((input) => {
    input.addEventListener("input", () => {
      checkInputValidity(formElement, input, settings);
      toggleButtonState(inputList, buttonElement, settings);
    });
  });
};

const enableValidation = (settings) => {
  const forms = Array.from(document.querySelectorAll(settings.formSelector));
  forms.forEach((form) => {
    form.setAttribute("novalidate", "true"); 
    form.addEventListener("submit", (e) => {
      if (!form.checkValidity()) e.preventDefault();
    });
    setEventListeners(form, settings);
  });
};

const resetValidation = (formElement, settings) => {
  const inputs = Array.from(formElement.querySelectorAll(settings.inputSelector));
  const button = formElement.querySelector(settings.submitButtonSelector);
  inputs.forEach((i) => hideInputError(formElement, i, settings));
  toggleButtonState(inputs, button, settings);
};

window.FormValidation = { enableValidation, resetValidation };
