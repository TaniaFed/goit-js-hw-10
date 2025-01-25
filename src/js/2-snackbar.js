// Описаний у документації
import iziToast from "izitoast";
// Додатковий імпорт стилів
import "izitoast/dist/css/iziToast.min.css";

const form = document.querySelector('.form');
const delayInput = form.querySelector('.input-text');
const stateInputs = form.querySelectorAll('input[name="state"]');

form.addEventListener('submit', (event) => {
    event.preventDefault();

    const selectedStateInput = Array.from(stateInputs).find(input => input.checked);

    if (!delayInput.checkValidity() || !selectedStateInput) {
        iziToast.error({
            title: 'Error',
            message: 'Please enter a valid delay and select a state.',
        });
        
        return;
    };

    const delay = parseInt(delayInput.value);

    const promise = new Promise((resolve, reject) => {
        setTimeout(() => {
            if (selectedStateInput.value === 'fulfilled') {
                resolve(delay);
            } else {
                reject(delay);
            }
        }, delay);
    });

    promise
        .then((delay) => {
            iziToast.success({
                message: `Fulfilled promise in ${delay}ms`,
            });
        })
        .catch((delay) => {
            iziToast.error({
                message: `Rejected promise in ${delay}ms`,
            });
        });

    form.reset();
});
