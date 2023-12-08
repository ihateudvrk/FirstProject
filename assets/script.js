// Contact Info Modal
const contactinfoButton = document.querySelector('#contact');
const modalBg = document.querySelector('.modal-background');
const modal = document.querySelector('.modal');

//This opens the modal
contactinfoButton.addEventListener ('click', () => {
    modal.classList.add('is-active');
});

//This allows the modal to be closed
modalBg.addEventListener ('click', () => {
    modal.classList.remove('is-active');
});