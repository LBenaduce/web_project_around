import Card from './Card.js';

const elementsSection = document.querySelector('.elements');

function handleCardClick(name, link) {
  console.log('clicou na imagem:', name, link);
}

function handleDeleteClick(cardElement) {
  console.log('deletar card', cardElement);
}

function createCard(data) {
  const card = new Card(
    data,
    '#cardTemplate',
    handleCardClick,
    handleDeleteClick
  );
  return card.generateCard();
}

const initialCards = [
  {
    name: 'Vale de Yosemite',
    link: 'https://practicum-content.s3.us-west-1.amazonaws.com/web-code/moved_yosemite.jpg'
  },
  {
    name: 'Lago Louise',
    link: 'https://practicum-content.s3.us-west-1.amazonaws.com/web-code/moved_lake-louise.jpg'
  },
  {
    name: 'Montanhas Carecas',
    link: 'https://practicum-content.s3.us-west-1.amazonaws.com/web-code/moved_bald-mountains.jpg'
  },
  {
    name: 'Latemar',
    link: 'https://practicum-content.s3.us-west-1.amazonaws.com/web-code/moved_latemar.jpg'
  },
  {
    name: 'Parque Nacional Vanoise',
    link: 'https://practicum-content.s3.us-west-1.amazonaws.com/web-code/moved_vanoise.jpg'
  },
  {
    name: 'Lago di Braies',
    link: 'https://practicum-content.s3.us-west-1.amazonaws.com/web-code/moved_braies.jpg'
  }
];

initialCards.forEach((data) => {
  const cardElement = createCard(data);
  elementsSection.appendChild(cardElement);
});
