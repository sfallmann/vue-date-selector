import namesOfMonths from './months';
import namesOfDays from './days';

function daysToMs(num) {
  return num * 24 * 60 * 60 * 1000;
}

function today() {
  const date = new Date();
  const month = date.getMonth();
  const day = date.getDate();
  const year = date.getFullYear();
  return new Date(year, month, day);
}

function previousMonth(month, year) {
  const newMonth = month === 0 ? 11 : month - 1;
  const newYear = month === 0 ? year - 1 : year;
  
  return { newMonth, newYear };
}

function nextMonth(month, year) {
  const newMonth = month === 11 ? 0 : month + 1;
  const newYear = month === 11 ? year + 1 : year;
  
  return { newMonth, newYear };
}

function previousDay(date) {
  const timestamp = new Date(date).getTime();
  return new Date(timestamp - daysToMs(1));
}

function nextDay(date) {
  const timestamp = new Date(date).getTime();
  return new Date(timestamp + daysToMs(1));
}

function firstOfMonth(date) {
  const startdate = new Date(date);
  const month = startdate.getMonth();
  const year = startdate.getFullYear();
  return new Date(year, month, 1);
};

function getNameOfDay(day, format = 'long') {
  return namesOfDays[day][format];
}

function getNameOfMonth(month, format = 'long') {
  return namesOfMonths[month][format];
}

function formatDate(date) {
  const d = new Date(date);
  const month = d.getMonth();
  const year = d.getFullYear();
  const dayOfWeek = d.getDay();
  const day = d.getDate();
  return `${getNameOfDay(dayOfWeek)}, ${getNameOfMonth(month)} ${day} ${year}`;
}

export default {
  daysToMs,
  today,
  previousMonth,
  nextMonth,
  previousDay,
  nextDay,
  firstOfMonth,
  getNameOfDay,
  getNameOfMonth,
  formatDate,
}
