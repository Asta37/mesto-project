/*const initialCards = [
    {
      name: "Архыз",
      link: "https://pictures.s3.yandex.net/frontend-developer/cards-compressed/arkhyz.jpg",
    },
    {
      name: "Челябинская область",
      link: "https://pictures.s3.yandex.net/frontend-developer/cards-compressed/chelyabinsk-oblast.jpg",
    },
    {
      name: "Иваново",
      link: "https://pictures.s3.yandex.net/frontend-developer/cards-compressed/ivanovo.jpg",
    },
    {
      name: "Камчатка",
      link: "https://pictures.s3.yandex.net/frontend-developer/cards-compressed/kamchatka.jpg",
    },
    {
      name: "Холмогорский район",
      link: "https://pictures.s3.yandex.net/frontend-developer/cards-compressed/kholmogorsky-rayon.jpg",
    },
    {
      name: "Байкал",
      link: "https://pictures.s3.yandex.net/frontend-developer/cards-compressed/baikal.jpg",
    }
];*/


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
export { initialCards };

export function createCard(cardData, handleDeleteCard, handleLikeCard, handleImageClick) {
    const cardTemplate = document.querySelector('#card-template').content;
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

export function handleDeleteCard(evt) {
    if (confirm('Вы действительно хотите удалить эту карточку?')) {
        evt.target.closest('.card').remove();
    }
}

export function handleLikeCard(evt) {
    evt.target.classList.toggle('card__like-button_is-active');
}
