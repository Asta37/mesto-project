// Темплейт карточки
const cardTemplate = document.querySelector('#card-template').content;

// DOM узлы
const placesList = document.querySelector('.places__list');

// Попапы
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

// Функции для работы с модальными окнами
function openModal(popup) {
    popup.classList.add('popup_is-opened');
    document.addEventListener('keydown', handleEscapeKey);
}

function closeModal(popup) {
    popup.classList.remove('popup_is-opened');
    document.removeEventListener('keydown', handleEscapeKey);
}

function handleEscapeKey(evt) {
    if (evt.key === 'Escape') {
        const openedPopup = document.querySelector('.popup_is-opened');
        closeModal(openedPopup);
    }
}

function handleOverlayClick(evt) {
    if (evt.target === evt.currentTarget) {
        closeModal(evt.currentTarget);
    }
}

// Добавляем анимацию всем попапам
function addPopupAnimations() {
    document.querySelectorAll('.popup').forEach(popup => {
        popup.classList.add('popup_is-animated');
        popup.addEventListener('click', handleOverlayClick);
    });
}

// Функция создания карточки
function createCard(cardData, handleDeleteCard, handleLikeCard, handleImageClick) {
    const cardElement = cardTemplate.querySelector('.card').cloneNode(true);
    const cardImage = cardElement.querySelector('.card__image');
    const cardTitle = cardElement.querySelector('.card__title');
    const deleteButton = cardElement.querySelector('.card__delete-button');
    const likeButton = cardElement.querySelector('.card__like-button');

    cardImage.src = cardData.link;
    cardImage.alt = cardData.name;
    cardTitle.textContent = cardData.name;

    deleteButton.addEventListener('click', handleDeleteCard);
    likeButton.addEventListener('click', handleLikeCard);
    cardImage.addEventListener('click', () => handleImageClick(cardData));

    return cardElement;
}

// Функция удаления карточки
function handleDeleteCard(evt) {
    if (confirm('Вы действительно хотите удалить эту карточку?')) {
        evt.target.closest('.card').remove();
    }
}

// Функция лайка карточки
function handleLikeCard(evt) {
    evt.target.classList.toggle('card__like-button_is-active');
}

// Функция открытия изображения
function handleImageClick(cardData) {
    imagePopupImage.src = cardData.link;
    imagePopupImage.alt = `Изображение ${cardData.name}`;
    imagePopupCaption.textContent = cardData.name;
    openModal(imagePopup);
}

// Обработчики форм
function handleProfileFormSubmit(evt) {
    evt.preventDefault();
    profileTitle.textContent = nameInput.value;
    profileDescription.textContent = jobInput.value;
    closeModal(profilePopup);
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
}

// Обработчики открытия попапов
function handleProfileEditClick() {
    nameInput.value = profileTitle.textContent;
    jobInput.value = profileDescription.textContent;
    openModal(profilePopup);
}

function handleAddCardClick() {
    cardForm.reset();
    openModal(cardPopup);
}

// Инициализация попапов
function setupPopupCloseButtons() {
    document.querySelectorAll('.popup__close').forEach(button => {
        const popup = button.closest('.popup');
        button.addEventListener('click', () => closeModal(popup));
    });
}

// Инициализация карточек
function renderInitialCards() {
    initialCards.forEach(cardData => {
        const cardElement = createCard(cardData, handleDeleteCard, handleLikeCard, handleImageClick);
        placesList.append(cardElement);
    });
}

// Инициализация приложения
function init() {
    addPopupAnimations();
    setupPopupCloseButtons();
    renderInitialCards();

    profileEditButton.addEventListener('click', handleProfileEditClick);
    profileAddButton.addEventListener('click', handleAddCardClick);

    profileForm.addEventListener('submit', handleProfileFormSubmit);
    cardForm.addEventListener('submit', handleCardFormSubmit);
}

// Запуск приложения
document.addEventListener('DOMContentLoaded', init);