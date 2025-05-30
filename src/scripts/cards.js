import { deleteCard, likeCard, unlikeCard } from '../components/api.js';
import arkhyzImage from '../images/arkhyz.jpg';
import chelyabinskImage from '../images/chelyabinsk-oblast.jpg';
import ivanovoImage from '../images/ivanovo.jpg';
import kamchatkaImage from '../images/kamchatka.jpg';
import kholmogorskyImage from '../images/kholmogorsky-rayon.jpg';
import baikalImage from '../images/baikal.jpg';

const initialCards = [
    {
        name: 'Архыз',
        link: arkhyzImage,
        alt: 'Горный пейзаж Архыза'
    },
    {
        name: 'Челябинская область',
        link: chelyabinskImage,
        alt: 'Природа Челябинской области'
    },
    {
        name: 'Иваново',
        link: ivanovoImage,
        alt: 'Пейзаж Иваново'
    },
    {
        name: 'Камчатка',
        link: kamchatkaImage,
        alt: 'Вулканы Камчатки'
    },
    {
        name: 'Холмогорский район',
        link: kholmogorskyImage,
        alt: 'Природа Холмогорского района'
    },
    {
        name: 'Байкал',
        link: baikalImage,
        alt: 'Озеро Байкал'
    },
];

export function createCard(cardData, handleDeleteCard, handleLikeCard, handleImageClick, userId) {
    const cardTemplate = document.querySelector('#card-template').content;
    const cardElement = cardTemplate.querySelector('.card').cloneNode(true);
    const cardImage = cardElement.querySelector('.card__image');
    const cardTitle = cardElement.querySelector('.card__title');
    const deleteButton = cardElement.querySelector('.card__delete-button');
    const likeButton = cardElement.querySelector('.card__like-button');
    const likeCountElement = cardElement.querySelector('.card__like-count');

    cardImage.src = cardData.link;
    cardImage.alt = cardData.alt || cardData.name;
    cardTitle.textContent = cardData.name;
    likeCountElement.textContent = cardData.likes.length;

    // Проверка лайков
    if (cardData.likes.some(like => like._id === userId)) {
        likeButton.classList.add('card__like-button_is-active');
    }

    // Удаление только своих карточек
    if (cardData.owner._id === userId) {
        deleteButton.addEventListener('click', () => handleDeleteCard(cardData._id, cardElement));
    } else {
        deleteButton.remove();
    }

    likeButton.addEventListener('click', () => handleLikeCard(cardData._id, likeButton, likeCountElement));
    cardImage.addEventListener('click', () => handleImageClick(cardData));

    return cardElement;
}

export function handleDeleteCard(cardId, cardElement) {
    return new Promise((resolve, reject) => {
        if (confirm('Вы действительно хотите удалить эту карточку?')) {
            deleteCard(cardId)
                .then(() => {
                    cardElement.remove();
                    resolve();
                })
                .catch(err => {
                    console.error('Ошибка при удалении карточки:', err);
                    reject(err);
                });
        } else {
            resolve('Удаление отменено');
        }
    });
}

export function handleLikeCard(cardId, likeButton, likeCountElement) {
    const isLiked = likeButton.classList.contains('card__like-button_is-active');

    return (isLiked ? unlikeCard(cardId) : likeCard(cardId))
        .then(updatedCard => {
            likeButton.classList.toggle('card__like-button_is-active');
            likeCountElement.textContent = updatedCard.likes.length;
            return updatedCard;
        })
        .catch(err => {
            console.error('Ошибка при обработке лайка:', err);
            throw err;
        });
}