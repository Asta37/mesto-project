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
import {
    getUserInfo,
    getInitialCards,
    updateUserInfo,
    addNewCard,
    deleteCard,
    likeCard,
    unlikeCard,
    updateAvatar
} from '../components/api.js';
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

const avatarPopup = document.querySelector('.popup_type_avatar');
const avatarForm = document.querySelector('.popup__form[name="edit-avatar"]');
const profileAvatar = document.querySelector('.profile__image');
const avatarEditButton = document.querySelector('.profile__avatar-edit');
const avatarLinkInput = avatarForm.querySelector('.popup__input_type_avatar-url');


// Настройки валидации
const validationSettings = {
    formSelector: '.popup__form',
    inputSelector: '.popup__input',
    submitButtonSelector: '.popup__button',
    inactiveButtonClass: 'popup__button_disabled',
    inputErrorClass: 'popup__input_error',
    errorClass: 'popup__error'
};

let userId;

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
    const submitButton = evt.target.querySelector('.popup__button');
    const originalText = submitButton.textContent;
    submitButton.textContent = 'Сохранение...';

    const inputs = profileForm.querySelectorAll('.popup__input');
    inputs.forEach(input => input.disabled = true);
    submitButton.disabled = true;

    updateUserInfo(nameInput.value, jobInput.value)
        .then(userData => {
            profileTitle.textContent = userData.name;
            profileDescription.textContent = userData.about;
            closeModal(profilePopup);
        })
        .catch(err => {
            console.error('Ошибка при обновлении профиля:', err);
        })
        .finally(() => {
            submitButton.textContent = originalText;
            inputs.forEach(input => input.disabled = false);
            submitButton.disabled = false;
        });
}

function renderCard(cardData, userId) {
    const cardElement = createCard(
        cardData,
        (cardId, cardElement) => handleDeleteCard(cardId, cardElement),
        handleLikeCard,
        handleImageClick,
        userId
    );
    placesList.prepend(cardElement);
}

function handleAvatarEditClick() {
    avatarForm.reset();
    openModal(avatarPopup);
}

function handleCardFormSubmit(evt) {
    evt.preventDefault();
    const submitButton = evt.target.querySelector('.popup__button');
    const originalText = submitButton.textContent;
    submitButton.textContent = 'Сохранение...';

    const inputs = cardForm.querySelectorAll('.popup__input');
    inputs.forEach(input => input.disabled = true);
    submitButton.disabled = true;

    addNewCard(cardNameInput.value, cardLinkInput.value)
        .then(newCard => {
            renderCard(newCard, userId);
            cardForm.reset();
            closeModal(cardPopup);
        })
        .catch(err => console.error('Ошибка:', err))
        .finally(() => {
            submitButton.textContent = originalText;
            inputs.forEach(input => input.disabled = false);
            submitButton.disabled = false;
        });
}

function handleAvatarFormSubmit(evt) {
    evt.preventDefault();
    const submitButton = evt.target.querySelector('.popup__button');
    const originalText = submitButton.textContent;
    submitButton.textContent = 'Сохранение...';

    const input = avatarForm.querySelector('.popup__input');
    input.disabled = true;
    submitButton.disabled = true;

    updateAvatar(avatarLinkInput.value)
        .then(userData => {
            profileAvatar.style.backgroundImage = `url(${userData.avatar})`;
            closeModal(avatarPopup);
        })
        .catch(err => console.log('Ошибка:', err))
        .finally(() => {
            submitButton.textContent = originalText;
            input.disabled = false;
            submitButton.disabled = false;
        });
}


// Инициализация приложения
function init() {
    addPopupAnimations();
    setupPopupCloseButtons();
    enableValidation(validationSettings);

    Promise.all([getUserInfo(), getInitialCards()])
        .then(([userData, cards]) => {
            userId = userData._id;
            profileTitle.textContent = userData.name;
            profileDescription.textContent = userData.about;
            profileAvatar.style.backgroundImage = `url(${userData.avatar})`;

            // Очищаем список карточек перед добавлением
            placesList.innerHTML = '';

            cards.reverse().forEach(cardData => {
                renderCard(cardData, userId);
            });
        })
        .catch(err => {
            console.error('Ошибка при загрузке данных:', err);
        });

    // Навешиваем обработчики
    profileEditButton.addEventListener('click', handleProfileEditClick);
    profileAddButton.addEventListener('click', handleAddCardClick);
    avatarEditButton.addEventListener('click', handleAvatarEditClick);

    profileForm.addEventListener('submit', handleProfileFormSubmit);
    cardForm.addEventListener('submit', handleCardFormSubmit);
    avatarForm.addEventListener('submit', handleAvatarFormSubmit);
}


// Запуск
document.addEventListener('DOMContentLoaded', init);