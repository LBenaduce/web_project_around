const getErrorEl = (form, input) =>
  form.querySelector(`#${input.id}-error`) ||
  form.querySelector(`[data-error-for="${input.name}"]`) ||
  form.querySelector(`.${input.id}-error`);

const showInputError = (form, input, message, s) => {
  const err = getErrorEl(form, input);
  input.classList.add(s.inputErrorClass);
  if (err) {
    err.textContent = message;
    err.classList.add(s.errorClass);
  }
};

const hideInputError = (form, input, s) => {
  const err = getErrorEl(form, input);
  input.classList.remove(s.inputErrorClass);
  if (err) {
    err.textContent = "";
    err.classList.remove(s.errorClass);
  }
};

const applyCustomMessage = (input) => {
  if (input.validity.valueMissing) {
    input.setCustomValidity("Por favor, preencha este campo.");
    return;
  }
  if (input.validity.typeMismatch && input.type === "url") {
    input.setCustomValidity("Por favor, insira um URL válido.");
    return;
  }
  if (input.validity.tooShort) {
    input.setCustomValidity(`Use pelo menos ${input.minLength} caracteres.`);
    return;
  }
  if (input.validity.tooLong) {
    input.setCustomValidity(`Use no máximo ${input.maxLength} caracteres.`);
    return;
  }
  if (input.validity.patternMismatch) {
    input.setCustomValidity("Formato inválido.");
    return;
  }
  input.setCustomValidity("");
};

const checkInputValidity = (form, input, s) => {
  applyCustomMessage(input);
  if (!input.validity.valid) {
    showInputError(form, input, input.validationMessage, s);
  } else {
    hideInputError(form, input, s);
  }
};

const hasInvalid = (inputs) => inputs.some((i) => !i.validity.valid);

const toggleButtonState = (inputs, btn, s) => {
  if (!btn) return;
  if (hasInvalid(inputs)) {
    btn.setAttribute("disabled", "true");
    btn.classList.add(s.inactiveButtonClass);
  } else {
    btn.removeAttribute("disabled");
    btn.classList.remove(s.inactiveButtonClass);
  }
};

const setEventListeners = (form, s) => {
  const inputs = Array.from(form.querySelectorAll(s.inputSelector));
  const btn = form.querySelector(s.submitButtonSelector);
  toggleButtonState(inputs, btn, s);
  inputs.forEach((input) => {
    input.addEventListener("input", () => {
      checkInputValidity(form, input, s);
      toggleButtonState(inputs, btn, s);
    });
  });
};

const enableValidation = (s) => {
  const forms = Array.from(document.querySelectorAll(s.formSelector));
  forms.forEach((form) => {
    form.setAttribute("novalidate", "true");
    form.addEventListener("submit", (e) => {
      if (!form.checkValidity()) e.preventDefault();
    });
    setEventListeners(form, s);
  });
};

const resetValidation = (form, s) => {
  const inputs = Array.from(form.querySelectorAll(s.inputSelector));
  const btn = form.querySelector(s.submitButtonSelector);
  inputs.forEach((i) => {
    i.setCustomValidity("");
    hideInputError(form, i, s);
  });
  toggleButtonState(inputs, btn, s);
};

window.FormValidation = { enableValidation, resetValidation };
