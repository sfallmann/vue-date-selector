import namesOfMonths from './months';
import namesOfDays from './days';

const dateprop = Symbol('date');

class DateHelper {
  constructor() {
    this[dateprop] = DateHelper.normalize(...arguments);
    return this;
  }

  static normalize() {
    // if there are no arguments get today
    let date = !arguments.length ? new Date() : new Date(...arguments);
    
    //if the date is invalid set it to today
    if (Number.isNaN(date.getTime())) {
      date = new Date();
    }

    const month = date.getMonth();
    const day = date.getDate();
    const year = date.getFullYear();

    return new Date(year, month, day);
  }

  month(format) {
    const month = this[dateprop].getMonth();
    return format === 'long' || format === 'short' ? namesOfMonths[month][format] : month;
  }

  dayOfWeek(format) {
    const dayOfWeek = this[dateprop].getDay();
    return format === 'long' || format === 'short' ? namesOfDays[dayOfWeek][format] : dayOfWeek;
  }

  day() {
    return this[dateprop].getDate();
  }

  year() {
    return this[dateprop].getFullYear();
  }

  ms() {
    return this[dateprop].getTime();
  }

  date(num) {
    if (num === undefined) {
      return this[dateprop];
    }
    this[dateprop]= new Date(this.year(), this.month(), num);
    return this;
  }

  static daysToMs(num) {
    return num * 24 * 60 * 60 * 1000;
  }

  static previousMonthYear(month, year) {
    return {
      month: month === 0 ? 11 : month - 1,
      year: month === 0 ? year - 1 : year,
    }
  }

  static nextMonthYear(month, year) {
    return {
      month:  month === 11 ? 0 : month + 1,
      year:  month === 11 ? year + 1 : year,
    }
  }

  yesterday() {
    return new Date(this._timestamp - DateHelper.daysToMs(1));
  }

  tomorrow() {
    return new Date(this._timestamp + DateHelper.daysToMs(1));
  }

  add(type, num) {
    let day = this.day();
    let month = this.month();
    let year = this.year();

    switch (type) {
      case 'day':
        day += num;
        break;
      case 'month':
        month += num;
        break;
      case 'year':
        year += year;
        break;
    }
    this[dateprop] = new Date(year, month, day);
    return this;
  }

  subtract(type, num) {
    let day = this.day();
    let month = this.month();
    let year = this.year();

    switch (type) {
      case 'day':
        day -= num;
        break;
      case 'month':
        month -= num;
        break;
      case 'year':
        year -= year;
        break;
    }
    this[dateprop] = new Date(year, month, day);
    return this;
  }
}

function DateHelperFactory() {
  return new DateHelper(...arguments);
}

DateHelperFactory.normalize = DateHelper.normalize;
DateHelperFactory.daysToMs = DateHelper.daysToMs;
DateHelperFactory.previousMonthYear = DateHelper.previousMonthYear;
DateHelperFactory.nextMonthYear = DateHelper.nextMonthYear;

export default DateHelperFactory;
