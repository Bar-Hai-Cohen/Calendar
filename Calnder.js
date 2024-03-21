const months = [
  'January', 'February', 'March', 'April', 'May', 'June',
  'July', 'August', 'September', 'October', 'November', 'December'
];

let currentDate = new Date();
let currentMonth = currentDate.getMonth();
let currentYear = currentDate.getFullYear();
const events = {};

const monthDisplay = document.getElementById('monthDisplay');
const calendarBody = document.getElementById('calendarBody');
const prevMonthBtn = document.getElementById('prevMonth');
const nextMonthBtn = document.getElementById('nextMonth');
const currentMonthBtn = document.getElementById('currentMonth');
const eventModal = document.getElementById('eventModal');
const eventDate = document.getElementById('eventDate');
const addEventBtn = document.getElementById('addEvent');
const closeModalBtn = document.getElementsByClassName('close')[0];
const eventList = document.getElementById('eventList');
const startTimeInput = document.getElementById('startTime');
const endTimeInput = document.getElementById('endTime');
const descriptionInput = document.getElementById('description');

function renderCalendar() {
  const daysInMonth = new Date(currentYear, currentMonth + 1, 0).getDate();
  const firstDayOfMonth = new Date(currentYear, currentMonth, 1).getDay();
  const lastDateOfPrevMonth = new Date(currentYear, currentMonth, 0).getDate();

  monthDisplay.textContent = `${months[currentMonth]} ${currentYear}`;
  calendarBody.innerHTML = '';
  eventList.innerHTML = '';

  let date = 1;
  for (let i = 0; i < 6; i++) {
    const row = document.createElement('tr');

    for (let j = 0; j < 7; j++) {
      const cell = document.createElement('td');

      if (i === 0 && j < firstDayOfMonth) {
        const prevMonthDate = lastDateOfPrevMonth - firstDayOfMonth + j + 1;
        cell.textContent = prevMonthDate;
        cell.classList.add('outsideDay');
      } else if (date > daysInMonth) {
        const nextMonthDate = date - daysInMonth;
        cell.textContent = nextMonthDate;
        cell.classList.add('outsideDay');
        date++;
      } else {
        const currentDateObj = new Date(currentYear, currentMonth, date);
        cell.textContent = date;
        if (currentDateObj.toDateString() === currentDate.toDateString()) {
          cell.classList.add('today');
        }
        cell.addEventListener('click', showEventModal);
        date++;
      }

      row.appendChild(cell);
    }

    calendarBody.appendChild(row);
  }
}

function showEventModal(e) {
  clearInputFields();
  const clickedDate = new Date(currentYear, currentMonth, e.target.textContent);
  eventDate.textContent = `${months[clickedDate.getMonth()]} ${clickedDate.getDate()}, ${clickedDate.getFullYear()}`;
  eventModal.style.display = 'block';

  const dateKey = clickedDate.toDateString();
  if (events[dateKey]) {
    eventList.innerHTML = events[dateKey]
      .map((event, index) => `<li>${index + 1}. ${event.description} (${event.startTime} - ${event.endTime})</li>`)
      .join('');
  } else {
    eventList.innerHTML = '';
  }
}

function clearInputFields() {
  startTimeInput.value = '';
  endTimeInput.value = '';
  descriptionInput.value = '';
}

function closeModal() {
  eventModal.style.display = 'none';
  clearInputFields();
}

function addEvent() {
  const startTime = startTimeInput.value;
  const endTime = endTimeInput.value;
  const description = descriptionInput.value;

  if (startTime && endTime && description) {
    // Check if start time is less than end time
    if (startTime < endTime) {
      const clickedDate = new Date(eventDate.textContent);
      const dateKey = clickedDate.toDateString();

      if (!events[dateKey]) {
        events[dateKey] = [];
      }

      events[dateKey].push({ startTime, endTime, description });
      // Close modal immediately after adding event
      closeModal();
    } else {
      alert('Start time must be before end time.');
    }
  } else {
    alert('Please fill in all fields.');
  }
}

prevMonthBtn.addEventListener('click', () => {
  currentMonth--;
  if (currentMonth < 0) {
    currentMonth = 11;
    currentYear--;
  }
  renderCalendar();
});

nextMonthBtn.addEventListener('click', () => {
  currentMonth++;
  if (currentMonth > 11) {
    currentMonth = 0;
    currentYear++;
  }
  renderCalendar();
});

currentMonthBtn.addEventListener('click', () => {
  currentMonth = currentDate.getMonth();
  currentYear = currentDate.getFullYear();
  renderCalendar();
});

closeModalBtn.addEventListener('click', closeModal);
window.addEventListener('click', (e) => {
  if (e.target === eventModal) {
    closeModal();
  }
});

addEventBtn.addEventListener('click', addEvent);

renderCalendar();
