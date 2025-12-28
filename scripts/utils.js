export class Utils {
  constructor({
    form,
    title,
    editname,
    description,
    about,
    popup,
    editprofile,
    addpic,
    photoAdd,
  }) {
    this._form = form;
    this._title = title;
    this._editname = editname;
    this._description = description;
    this._about = about;
    this._popup = popup;
    this._editprofile = editprofile;
    this._addpic = addpic;
    this._photoAdd = photoAdd;

    this.setEventListeners();
  }

  setEventListeners() {
    this._form.addEventListener("submit", (event) => {
      event.preventDefault();
      this._title.textContent = this._editname.value;
      this._description.textContent = this._about.value;
      this._popup.classList.add("popup-hidden");
    });

    this._editprofile.addEventListener("click", () => {
      this._editname.value = this._title.textContent;
      this._about.value = this._description.textContent;
      this._popup.classList.remove("popup-hidden");
      this._popup.classList.add("popup");
    });

    document.addEventListener("keydown", (evt) => {
      if (evt.key === "Escape") {
        document.querySelectorAll(".popup").forEach((popup) => {
          if (!popup.classList.contains("popup-hidden")) {
            popup.classList.add("popup-hidden");
          }
        });
      }
    });

    this._addpic.addEventListener("click", () => {
      this._photoAdd.classList.remove("popup-hidden");
    });
  }
}