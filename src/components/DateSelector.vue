<template>
  <div class="date-selector">
    <span class="date-selector-text" @click="showPicker = !showPicker">{{ selectedText }}</span>
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
            <span>{{ pickerDays[w - 1][d - 1].day }}</span>
          </div>
        </div>
        <div class="date-selector-month-controls">
          <i @click="changeMonth('sub')" class="arrow left"/>
          <div class="date-selector-month-text">{{ monthYearText }}</div>
          <i @click="changeMonth('add')" class="arrow right"/>
        </div>
      </div>
    </transition>
  </div>
</template>
<script>
import DateHelper from './date-helper';

export default {
  mounted() {
    this.calculatePickerDays();
    document.addEventListener("click", this.close);
  },
  destroyed() {
    document.removeEventListener("click", this.close);
  },
  props: {
    value: {
      type: [String, Date],
      default: DateHelper().ms(),
    }
  },
  data() {
    return {
      firstOfMonth: DateHelper().date(1).ms(),
      showPicker: false,
      pickerDays: [],
      selected: DateHelper().ms(),
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
      this.selected = newDate.ms();
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
    monthYearText() {
      const date = DateHelper(this.firstOfMonth);
      return `${date.month('long')} ${date.year()}`;
    }
  }
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
  display: inline-block;
  padding: 4px;
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
  line-height: 35px;
  display: block;
  width: 100%;
  height: 100%;
  font-weight: bold;
}
.date-selector-picker {
  @include noselect;
  background-color: white;
  position: absolute;
  width: 210px;
  border: 1px solid black;
  z-index: 100;
}

.week {
  box-sizing: border-box;
  height: 30px;
}

.day {
  position: relative;
  display: inline-block;
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
    background-color: lightyellow;
    font-weight: bold;
    @include highlightDay;
  }

  span {
    position: absolute;
    font-size: 12px;
    width: 12px;
    height: 12px;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
  }
}
.date-selector-month-controls {
  background-color: black;
  height: 30px;
  color: white;
}
.date-selector-month-text {
  display: inline-block;
  line-height: 30px;
  font-weight: bold;
  width: 140px;
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

