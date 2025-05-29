import {
    enableValidation,
    showInputError,
    hideInputError,
    toggleButtonState
} from '../components/validate.js';
import {
    openModal, closeModal, handleOverlayClick, addPopupAnimations, setupPopupCloseButtons, resetFormErrors
} from '../components/modal.js';
import {
    createCard,
    handleDeleteCard,
    handleLikeCard
} from './cards.js';
import { initialCards } from './cards.js';
import '../pages/index.css';


// DOM-элементы
// Темплейт карточки
const cardTemplate = document.querySelector('#card-template').content;
//
const placesList = document.querySelector('.places__list');
const profilePopup = document.querySelector('.popup_type_edit');
const cardPopup = document.querySelector('.popup_type_new-card');
const imagePopup = document.querySelector('.popup_type_image');
// Элементы профиля
const profileTitle = document.querySelector('.profile__title');
const profileDescription = document.querySelector('.profile__description');
const profileEditButton = document.querySelector('.profile__edit-button');
const profileAddButton = document.querySelector('.profile__add-button');
// Формы
const profileForm = document.querySelector('.popup__form[name="edit-profile"]');
const cardForm = document.querySelector('.popup__form[name="new-place"]');
const nameInput = profileForm.querySelector('.popup__input_type_name');
const jobInput = profileForm.querySelector('.popup__input_type_description');
const cardNameInput = cardForm.querySelector('.popup__input_type_card-name');
const cardLinkInput = cardForm.querySelector('.popup__input_type_url');
// Элементы попапа с изображением
const imagePopupImage = imagePopup.querySelector('.popup__image');
const imagePopupCaption = imagePopup.querySelector('.popup__caption');


// Настройки валидации
const validationSettings = {
    formSelector: '.popup__form',
    inputSelector: '.popup__input',
    submitButtonSelector: '.popup__button',
    inactiveButtonClass: 'popup__button_disabled',
    inputErrorClass: 'popup__input_error',
    errorClass: 'popup__error'
};


// Функции для работы с карточками
function renderInitialCards() {
    initialCards.forEach(cardData => {
        const cardElement = createCard(cardData, handleDeleteCard, handleLikeCard, handleImageClick);
        placesList.append(cardElement);
    });
}

// Функции для работы с модальными окнами
function handleEscapeKey(evt) {
    if (evt.key === 'Escape') {
        const openedPopup = document.querySelector('.popup_is-opened');
        closeModal(openedPopup);
    }
}
// Функция открытия изображения
function handleImageClick(cardData) {
    imagePopupImage.src = cardData.link;
    imagePopupImage.alt = `Изображение ${cardData.name}`;
    imagePopupCaption.textContent = cardData.name;
    openModal(imagePopup);
}
// Обработчики открытия попапов
function handleProfileEditClick() {
    nameInput.value = profileTitle.textContent;
    jobInput.value = profileDescription.textContent;
    resetFormErrors(profilePopup);
    openModal(profilePopup);
}
function handleAddCardClick() {
    cardForm.reset();
    openModal(cardPopup);
}

// Обработчики форм
function handleProfileFormSubmit(evt) {
    evt.preventDefault();
    profileTitle.textContent = nameInput.value;
    profileDescription.textContent = jobInput.value;
    closeModal(profilePopup);
    resetFormErrors(profilePopup);
}
function handleCardFormSubmit(evt) {
    evt.preventDefault();

    const newCard = {
        name: cardNameInput.value,
        link: cardLinkInput.value
    };

    const cardElement = createCard(newCard, handleDeleteCard, handleLikeCard, handleImageClick);
    placesList.prepend(cardElement);

    cardForm.reset();
    closeModal(cardPopup);
    resetFormErrors(cardPopup);
}


// Инициализация приложения
function init() {
    addPopupAnimations();
    setupPopupCloseButtons();
    renderInitialCards();
    enableValidation(validationSettings);

    profileEditButton.addEventListener('click', handleProfileEditClick);
    profileAddButton.addEventListener('click', handleAddCardClick);

    profileForm.addEventListener('submit', handleProfileFormSubmit);
    cardForm.addEventListener('submit', handleCardFormSubmit);
}

// Запуск
document.addEventListener('DOMContentLoaded', init);