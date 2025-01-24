import flatpickr from "flatpickr";
import "flatpickr/dist/flatpickr.min.css";

import iziToast from "izitoast";
import "izitoast/dist/css/iziToast.min.css";

const inputEl = document.querySelector('#datetime-picker');
const startBtn = document.querySelector('button');
const timerFields = document.querySelectorAll('.timer [data-days], .timer [data-hours], .timer [data-minutes], .timer [data-seconds]');

let userSelectedDate = null;
let intervalId = null;
let timerActive = false; 

startBtn.disabled = true;

const options = {
  enableTime: true,
  time_24hr: true,
  defaultDate: new Date(),
  minuteIncrement: 1,
  onClose(selectedDates) {
    console.log(selectedDates[0]);
      
    if (selectedDates[0] < new Date()) {
        iziToast.error({
            title: 'Error!',
            message: 'Please, choose a date in the future!'
        });
        startBtn.disabled = true;
    } else {
        userSelectedDate = selectedDates[0];
        startBtn.disabled = false;
    };
  },
};

flatpickr(inputEl, options);

startBtn.addEventListener('click', () => {
    
    if (timerActive) {  
        return;
    }

    startBtn.disabled = true;
    inputEl.disabled = true;

    
    intervalId = setInterval(() => {
        const diff = userSelectedDate - new Date();
        console.log(convertMs(diff)); 
        
        if (diff <= 0) {
            clearInterval(intervalId);
            startBtn.disabled = false;
            inputEl.disabled = false;
            iziToast.success({
                title: 'Countdown Done!',
                message: 'Please, reload page and choose another date!'
            }); 
            timerActive = false;
        } else {
            const { days, hours, minutes, seconds } = convertMs(diff);
            timerFields[0].textContent = addLeadingZero(days);
            timerFields[1].textContent = addLeadingZero(hours);
            timerFields[2].textContent = addLeadingZero(minutes);
            timerFields[3].textContent = addLeadingZero(seconds);
        }
    }, 1000);
    
    timerActive = true;

});

function addLeadingZero(value) {
  return value.toString().padStart(2, '0');
};

function convertMs(ms) {
  // Number of milliseconds per unit of time
  const second = 1000;
  const minute = second * 60;
  const hour = minute * 60;
  const day = hour * 24;

  // Remaining days
  const days = Math.floor(ms / day);
  // Remaining hours
  const hours = Math.floor((ms % day) / hour);
  // Remaining minutes
  const minutes = Math.floor(((ms % day) % hour) / minute);
  // Remaining seconds
  const seconds = Math.floor((((ms % day) % hour) % minute) / second);

  return { days, hours, minutes, seconds };
}

console.log(convertMs(2000)); // {days: 0, hours: 0, minutes: 0, seconds: 2}
console.log(convertMs(140000)); // {days: 0, hours: 0, minutes: 2, seconds: 20}
console.log(convertMs(24140000)); // {days: 0, hours: 6 minutes: 42, seconds: 20}