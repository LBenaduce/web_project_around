export default class Api {
  constructor({ baseUrl, headers }) {
    this._baseUrl = baseUrl;
    this._headers = headers;
  }

  _request(path, method = "GET", body = null) {
    const options = {
      method,
      headers: this._headers,
    };

    if (body) {
      options.body = JSON.stringify(body);
    }

    return fetch(`${this._baseUrl}${path}`, options).then((res) => {
      if (!res.ok) {
        return Promise.reject(`Error: ${res.status}`);
      }
      return res.json();
    });
  }

  getUserInfo() {
    return this._request("/users/me");
  }

  getInitialCards() {
    return this._request("/cards");
  }

  getAppInfo() {
    return Promise.all([this.getUserInfo(), this.getInitialCards()]);
  }

  setUserInfo({ name, about }) {
    return this._request("/users/me", "PATCH", { name, about });
  }

  addCard({ name, link }) {
    return this._request("/cards", "POST", { name, link });
  }

  deleteCard(cardId) {
    return this._request(`/cards/${cardId}`, "DELETE");
  }

  addLike(cardId) {
    return this._request(`/cards/${cardId}/likes`, "PUT");
  }

  removeLike(cardId) {
    return this._request(`/cards/${cardId}/likes`, "DELETE");
  }

  updateAvatar(avatar) {
    return this._request("/users/me/avatar", "PATCH", { avatar });
  }
}
