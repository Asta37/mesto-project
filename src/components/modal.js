function closeByEscape(evt) {
    if (evt.key === 'Escape') {
        const openedPopup = document.querySelector('.popup_is-opened');
        closeModal(openedPopup);
    }
}

export function openModal(popup) {
    resetFormErrors(popup);
    popup.classList.add('popup_is-opened');
    document.addEventListener('keydown', closeByEscape);
}

export function closeModal(popup) {
    popup.classList.remove('popup_is-opened');
    document.removeEventListener('keydown', closeByEscape);
}

export function handleOverlayClick(evt) {
    if (evt.target === evt.currentTarget) {
        closeModal(evt.currentTarget);
    }
}

export function addPopupAnimations() {
    document.querySelectorAll('.popup').forEach(popup => {
        popup.classList.add('popup_is-animated');
        popup.addEventListener('click', handleOverlayClick);
    });
}

export function setupPopupCloseButtons() {
    document.querySelectorAll('.popup__close').forEach(button => {
        const popup = button.closest('.popup');
        button.addEventListener('click', () => closeModal(popup));
    });
}

export function resetFormErrors(popup) {
    const form = popup.querySelector('.popup__form');
    if (!form) return;

    const errors = form.querySelectorAll('.popup__error');
    errors.forEach(error => {
        error.classList.remove('popup__error');
        error.textContent = '';
    });

    const inputs = form.querySelectorAll('.popup__input');
    inputs.forEach(input => {
        input.classList.remove('popup__input_error');
    });
    const button = form.querySelector('.popup__button');
    if (button) {
        button.classList.add('popup__button_disabled');
        button.disabled = true;
    }
}