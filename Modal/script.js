'use strict';
const showModalButtons = document.querySelectorAll('.show-modal');
const closeModalButton = document.querySelector('.close-modal');
const modal = document.querySelector('.modal');
const overlay = document.querySelector('.overlay');

const removeHiddenClass = function () {
  modal.classList.remove('hidden');
  overlay.classList.remove('hidden');
};

const addHiddenClass = function () {
  modal.classList.add('hidden');
  overlay.classList.add('hidden');
};

for (let i = 0; i < 3; i++) {
  showModalButtons[i].addEventListener('click', removeHiddenClass);
}

closeModalButton.addEventListener('click', addHiddenClass);
overlay.addEventListener('click', addHiddenClass);
