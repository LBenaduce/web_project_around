import './page/index.css';
import { Card } from './scripts/Card.js';
import { FormValidator } from './scripts/FormValidator.js';
import { Section } from './scripts/Section.js';
import PopupWithImage from './scripts/PopupWithImage.js';
import PopupWithForm from './scripts/PopupWithForm.js';
import PopupWithConfirmation  from './scripts/PopupWithConfirmation.js';
import { UserInfo } from './scripts/UserInfo.js';
import ModalProfile from './scripts/ModalProfile.js';
import Api from './scripts/Api.js';
import logoSrc from './images/logo.png';
import profileImageSrc from './images/profile__image.jpg';
import addIconSrc from './images/add.svg';
import editIconSrc from './images/edit.svg';


let userId; // Variável que armazenará o ID do usuário logadoconst modalProfile = new ModalProfile('#popup__profile-image'); // Seleção do modal de perfil
const profileEditButton = document.querySelector(".profile__edit"); // Botão de editar o perfil
const profileAddButton = document.querySelector(".profile__add"); // Botão de adicionar um novo cartão
const modalProfile = new ModalProfile('#popup__profile-image');
const popupProfileImage = document.querySelector(".profile__image-container");; // Seleciona o popup de edição da imagem do perfil
const cardsContainerSelector = '.card__container'; // Seleciona o contêiner de cartões
const profileImage = document.querySelector('.profile__image');
profileImage.src = profileImageSrc;

const headerLogo = document.querySelector('.header__logo');
headerLogo.src = logoSrc;

// Define os ícones de edição e de adição no botão
const profileEdit = document.querySelector('.profile__edit');
profileEdit.style.backgroundImage = `url(${editIconSrc})`;

const profileAdd = document.querySelector('.profile__add');
profileAdd.style.backgroundImage = `url(${addIconSrc})`;


// Instância da API com a URL base e o cabeçalho de autorização
const api = new Api({
    baseUrl: "https://around.nomoreparties.co/v1/web-ptbr-cohort-12",
    headers: {
        authorization: "c27e8b71-839c-45ed-b81c-981deeb16426",
        "Content-Type": "application/json"
    }
});
// Função para lidar com a curtida de um cartão
function handleLikeClick(cardId, isLiked) {
    
    let apiCall;

    // Verifica se o cartão já foi curtido e decide se deve curtir ou remover curtida
    if (isLiked) {
        apiCall = api.unlikeCard(cardId);  // Remove curtida
    } else {
        apiCall = api.likeCard(cardId);    // Adiciona curtida
    }
    return apiCall;
  
    // Atualiza o estado da curtida no cartão após a resposta da API
    
}




const deletePopup = new PopupWithConfirmation({
    popupSelector: '#popup_type_delete-card',
    handleFormSubmit: (card) => {
        api.deleteCard(card._id)
            .then(() => {
                console.log("card", card)
              card._element.remove(); // Remove o cartão do DOM após a exclusão
             
                deletePopup.close(); // Fecha o popup
            })
            .catch((err) => {
                console.error('Erro ao excluir o cartão:', err);
            });
    }
});
deletePopup.setEventListeners();
// Função para criar um novo cartão com as informações fornecidas
function createCard(data) {
    const card = new Card(
        {
            name: data.name,
            link: data.link,
            likes: data.likes,
            id: data._id,
            userId: userId,  // Passa o ID do usuário atual
            ownerId: data.owner._id // Passa o ID do dono do cartão
        },
        '#template-card',
      ({name, link}) => handleCardClick({name, link}),  // Define o comportamento ao clicar no cartão
       (cardId, isLiked, card) => handleLikeClick(cardId, isLiked, card), 
        () => {
            deletePopup.open(card)
            
        }

    );
    return card.generateCard(); // Gera o elemento HTML do cartão
}

// Instância da lista de cartões, responsável por renderizar os cartões
const cardList = new Section({
    items: [],
    renderer: (item) => {
        const cardElement = createCard(item); // Cria um novo cartão
        cardList.addItem(cardElement); // Adiciona o cartão à lista
    }
}, cardsContainerSelector);

// Chama a API para carregar os cartões iniciais
api.getInitialCards()
    .then((cards) => {
        if (Array.isArray(cards)) {
            cardList.renderItems(cards); // Renderiza os cartões se o retorno for um array
        } else {
            console.error("Erro: O retorno da API não é um array", cards);
        }
    })
    .catch((err) => {
        console.log("Erro ao carregar os cartões:", err);
    });

// Instância para gerenciar as informações do usuário
const userInfo = new UserInfo({
    nameSelector: '.profile__name',
    jobSelector: '.profile__about'
});

// Carrega as informações do usuário da API
api.getUserInfo()
    .then((result) => {
        userId = result._id;  // Armazena o ID do usuário
        userInfo.setUserInfo({
            name: result.name,
            job: result.about
        });
        document.querySelector('.profile__image').src = result.avatar; // Define a imagem do avatar do usuário
    })
    .catch((err) => {
        console.log("Erro ao carregar as informações do usuário:", err);
    });

// Função para abrir o popup de imagem ao clicar no cartão
function handleCardClick({ name, link }) {
    imagePopup.open({ name, link });
}

// Instância do popup de imagem e definição de seus eventos
const imagePopup = new PopupWithImage('.modalImage');
imagePopup.setEventListeners();

// Instância do popup de criação de cartão e configuração do comportamento ao submeter o formulário
const addCardPopup = new PopupWithForm({
    popupSelector: '#popup-card',
    handleFormSubmit: (formData) => {
        api.addCard({
            name: formData['popup-card-name'],
            link: formData['popup-card-link']
        }).then((newCard) => {
            const cardElement = createCard(newCard); // Cria o novo cartão
            cardList.addItem(cardElement); // Adiciona o novo cartão à lista
        }).catch(err => {
            console.log("Erro ao adicionar um novo cartão:", err);
        });
    }
});

addCardPopup.setEventListeners(); // Adiciona os eventos de escuta para o popup de adicionar cartão

const editProfilePopup = new PopupWithForm({
    popupSelector: '#popup-profile',
    handleFormSubmit: (data) => {
        api.updateUserInfo({
            name: data.name,
            about: data.about
        }).then((newProfileData) => {
           userInfo.setUserInfo({name: data.name, about: data.about});
        }).catch(err => {
            console.log("erro ao atualizar nome", err);
        });
    }
})
// Adiciona o comportamento ao botão de editar o perfil
profileEditButton.addEventListener('click', () => {
 
    const userInfoData = userInfo.getUserInfo(); // Obtém as informações do usuário
    document.querySelector('#popup-profile-name').value = userInfoData.name; // Preenche o campo de nome no formulário
    document.querySelector('#popup-profile-about').value = userInfoData.job; // Preenche o campo de ocupação no formulário
    editProfilePopup.open(); // Abre o popup de edição de perfil
});


// Abre o modal de edição de imagem do perfil ao clicar na imagem
popupProfileImage.addEventListener('click', () => {
    modalProfile.open();
});


// Abre o popup de adicionar cartão ao clicar no botão de adicionar
profileAddButton.addEventListener('click', () => {
    addCardPopup.open();
});


// Configurações de validação dos formulários
const validationSettings = {
    formSelector: ".popup__form",
    inputSelector: ".popup__edit-text",
    submitButtonSelector: ".popup__button-save",
    inactiveButtonClass: "popup__button-disable",
    inputErrorClass: "popup__input-error",
    errorClass: "popup__error_visible"
};

// Habilita a validação de todos os formulários na página
document.querySelectorAll(validationSettings.formSelector).forEach((formElement) => {
    const formValidator = new FormValidator(validationSettings, formElement);
    formValidator.enableValidation();
});
