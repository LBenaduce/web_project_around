console.log('index.js carregado');

const elementsSection = document.querySelector('.elements');

const initialCards = [
  {
    name: 'Vale de Yosemite',
    link: 'https://practicum-content.s3.us-west-1.amazonaws.com/web-code/moved_yosemite.jpg'
  },
  {
    name: 'Lago Louise',
    link: 'https://practicum-content.s3.us-west-1.amazonaws.com/web-code/moved_lake-louise.jpg'
  }
];

initialCards.forEach(function (data) {
  const article = document.createElement('article');
  article.classList.add('elements__card');

  const img = document.createElement('img');
  img.classList.add('elements__image');
  img.src = data.link;
  img.alt = data.name;

  const caption = document.createElement('div');
  caption.classList.add('elements__caption');

  const text = document.createElement('p');
  text.classList.add('elements__text');
  text.textContent = data.name;

  caption.appendChild(text);
  article.appendChild(img);
  article.appendChild(caption);

  elementsSection.appendChild(article);
});
