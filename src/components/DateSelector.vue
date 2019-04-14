<template>
  <div class="date-selector">
    <span 
      class="date-selector-text"
      @click="showPicker = !showPicker"
      @mousedown="changeDateTextClass"
      @mouseup="changeDateTextClass"
    >
      {{ selectedText }}
      <img class="today-icon" :src="todayIcon" ref="todayIcon" @click.stop="handleIconClick"/>
    </span>
    
    <transition name="fade">
      <div v-if="pickerDays.length" class="date-selector-picker" v-show="showPicker">
        <div v-for="w in 6" :key="`week_${w}`" class="week">
          <div
            class="day"
            v-for="d in 7"
            :key="`day_${d}`"
            @click="selectDay(pickerDays[w - 1][d - 1].date)"
            :class="dayClass(pickerDays[w - 1][d - 1].date)"
          >
            <span class="number">{{ pickerDays[w - 1][d - 1].day }}</span>
          </div>
        </div>
        <div class="date-selector-month-controls">
          <i @click="changeMonth('sub')" class="arrow left"/>
          <div class="date-selector-month-text">{{ monthYear.month }}</div>
          <input class="year-input" :value="monthYear.year" @keyup.enter="handleYearChange" @blur="handleYearChange" @input="formatYear" maxlength=4/>
          <i @click="changeMonth('add')" class="arrow right"/>
        </div>
      </div>
    </transition>
  </div>
</template>
<script>
import DateHelper from './date-helper';
import todayIcon from './today-icon.png';

export default {
  mounted() {
    this.firstOfMonth = DateHelper(this.selected).date(1).ms();
    this.calculatePickerDays();
    document.addEventListener("click", this.close);
  },
  destroyed() {
    document.removeEventListener("click", this.close);
  },
  props: ['value'],
  data() {
    return {
      todayIcon,
      firstOfMonth: '',
      showPicker: false,
      pickerDays: [],
      month: "",
      year: ""
    };
  },
  methods: {
    calculatePickerDays() {
      this.pickerDays = [];
      let placeholder = DateHelper(this.firstOfMonth);

      this.month = placeholder.month();
      this.year = placeholder.year();
      const diff = placeholder.dayOfWeek();

      placeholder.subtract('day', diff);
      for (let w = 0; w < 6; w++) {
        let week = [];

        for (let d = 0; d < 7; d++) {
          if (d !== 0 || w !== 0) {
            placeholder.add('day', 1);
          }
          week.push({ date: placeholder.ms(), day: placeholder.day() });
        }

        this.pickerDays.push(week);
      }
    },
    isCurrentMonth(date) {
      const newDate = DateHelper(date);

      return (
        newDate.month() === this.month &&
        newDate.year() === this.year
      );
    },
    isSelected(date) {
      return DateHelper(date).ms() === this.selected;
    },
    changeMonth(dir) {
      let monthYear;
      if (dir === "add") {
        monthYear = DateHelper.nextMonthYear(this.month, this.year);
      } else {
        monthYear = DateHelper.previousMonthYear(this.month, this.year);
      }
      this.firstOfMonth = DateHelper(monthYear.year, monthYear.month, 1).ms();
      this.calculatePickerDays();
    },
    selectDay(date) {
      const newDate = DateHelper(date);
      this.$emit('input', newDate.date());
      this.showPicker = false;

      if (!this.isCurrentMonth(date)) {
        this.month = newDate.month();
        this.year = newDate.year();
        this.firstOfMonth = DateHelper(this.year, this.month, 1).ms();
        this.calculatePickerDays();
      }
    },
    dayClass(date) {
      if (this.isCurrentMonth(date) && !this.isSelected(date))
        return "current-month";
      else if (this.isSelected(date)) return "selected-day";
    },
    close(event) {
      if (!this.$el.contains(event.target)) {
        this.showPicker = false;
      }
    },
    handleIconClick() {
      const today = DateHelper();
      if(this.selected !== today.ms()) this.selectDay(today.ms());
    },
    changeDateTextClass(event) {
      const { type, target } = event;
      if (target == this.$refs.todayIcon) return;
      const classes = type === 'mousedown' ? 'date-selector-text active' : 'date-selector-text';
      target.setAttribute('class', classes);
    },
    handleYearChange(event) {
      const { target } = event;
      const date = DateHelper(this.firstOfMonth);
      const year = Number.parseInt(target.value);
      
      if (target.value.length === 4) {
        this.month = date.month();
        this.year = year;
        this.firstOfMonth = DateHelper(this.year, this.month, 1).ms();
        this.calculatePickerDays();
      } else {
        target.value = date.year();
      }
    },
    formatYear(event) {
      const { target } = event;
      target.value = target.value.replace(/\D/g,'');
    }
  },
  computed: {
    selectedText() {
      const date = DateHelper(this.selected);
      const month = date.month() + 1;
      const day = date.day();
      const year = date.year();
      return `${month}/${day}/${year}`;
    },
    monthYear() {
      const date = DateHelper(this.firstOfMonth);
      return { month: date.month('long'), year: date.year() }
    },
    selected() {
      return DateHelper(this.value).ms();
    }
  },
};
</script>
<style lang="scss">

@mixin noselect {
  -webkit-user-select: none; /* Chrome all / Safari all */
  -moz-user-select: none; /* Firefox all */
  -ms-user-select: none; /* IE 10+ */
  user-select: none; /* Likely future */
}
@mixin highlightDay {
  &:hover {
    background-color: lightgreen;
  }
}
.arrow {
  border: solid white;
  border-width: 0 4px 4px 0;
  padding: 5px;
  cursor: pointer;
}

.right {
  transform: rotate(-45deg);
  -webkit-transform: rotate(-45deg);
  margin-left: 5px;
}

.left {
  transform: rotate(135deg);
  -webkit-transform: rotate(135deg);
  margin-right: 5px;
}

.up {
  transform: rotate(-135deg);
  -webkit-transform: rotate(-135deg);
}

.down {
  transform: rotate(45deg);
  -webkit-transform: rotate(45deg);
}
.date-selector {
  position: relative;
  width: 150px;
  text-align: center;
  height: 35px;
  border: 2px solid lightgrey;
  border-radius: 2px;
  cursor: pointer;
  &:hover {
    box-shadow: 0 0 5px rgba(81, 203, 238, 1);
    border: 2px solid rgba(81, 203, 238, 1);
  }
}
.date-selector-text {
  font-size: 16px;
  text-align: justify;
  text-align: center;

  line-height: 35px;
  display: block;
  width: 115px;
  height: 100%;
  font-weight: 700;
  &.active {
    font-size: 15px;
  }  
}
.today-icon {
  width: 35px;
  position: absolute;
  top: 0;
  right: 0;
  z-index: 100;
  &:active {
    border: 3px solid transparent;
  }
}
.date-selector-picker {
  @include noselect;
  background-color: white;
  position: absolute;
  width: 210px;
  border: 1px solid black;
  z-index: 100;
  box-shadow: 0 4px 8px 0 rgba(0, 0, 0, 0.2), 0 6px 20px 0 rgba(0, 0, 0, 0.19);
}

.week {
  box-sizing: border-box;
  height: 30px;
  display: flex;
  justify-content: flex-start;
}

.day {
  position: relative;
  box-sizing: border-box;
  padding: 0;
  width: 30px;
  height: 30px;
  border: 1px solid black;
  @include highlightDay;

  &.current-month {
    background-color: lightblue;
    @include highlightDay;
  }
  &.selected-day {
    background-color: lighten(blue, 20%);
    color: white;
    font-weight: 700;
    @include highlightDay;
  }

  .number {
    position: absolute;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
    font-size: 14px;
    font-weight: 700;
  }
}
.date-selector-month-controls {
  background-color: black;
  height: 30px;
  color: white;

  i {
    display: inline-block;
  }

  .date-selector-month-text {
    display: inline-block;
    width: 80px;
    text-align: center;
    font-size: 16px;
    line-height: 30px;
    font-weight: 700;
    margin-right: 5px;
  }

  .year-input {
    display: inline-block;
    font-weight: 700;
    font-size: 16px;
    line-height: 30px;
    height: 100%;
    text-align: center;
    border: 0;
    padding: 0;
    width: 40px;
    background-color: black;
    color: white;
    &:hover, &:focus {
      cursor: pointer;
      background-color: white;
      color: black;
    }
  }
}


.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.15s;
}
.fade-enter,
.fade-leave-to {
  opacity: 0;
}
</style>

