<template>
  <div class="date-selector">
    <img class="today-icon" :src="todayIcon" ref="todayIcon" @click.stop="handleIconClick">
    <span
      class="date-selector-text"
      @click="handleDateClick"
      @mousedown="changeDateTextClass"
      @mouseup="changeDateTextClass"
    >{{ selectedText }}</span>
    <img
      class="clear-icon"
      :src="clearIcon"
      ref="clearIcon"
      @click.stop="handleIconClick"
      v-show="showClearIcon"
    >
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
          <input
            class="year-input"
            :value="monthYear.year"
            @keyup.enter="handleYearChange"
            @blur="handleYearChange"
            @input="formatYear"
            maxlength="4"
          >
          <i @click="changeMonth('add')" class="arrow right"/>
        </div>
      </div>
    </transition>
  </div>
</template>
<script>
import DateHelper from "./date-helper";
import todayIcon from "./today-icon.png";
import clearIcon from "./clear-symbol.png";

export default {
  mounted() {
    this.firstOfMonth = DateHelper(this.selected)
      .date(1)
      .ms();
    this.calculatePickerDays();
    document.addEventListener("click", this.close);
  },
  destroyed() {
    document.removeEventListener("click", this.close);
  },
  props: ["value", "required"],
  data() {
    return {
      todayIcon,
      clearIcon,
      firstOfMonth: "",
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

      placeholder.subtract("day", diff);
      for (let w = 0; w < 6; w++) {
        let week = [];

        for (let d = 0; d < 7; d++) {
          if (d !== 0 || w !== 0) {
            placeholder.add("day", 1);
          }
          week.push({ date: placeholder.ms(), day: placeholder.day() });
        }

        this.pickerDays.push(week);
      }
    },
    isCurrentMonth(date) {
      const newDate = DateHelper(date);

      return newDate.month() === this.month && newDate.year() === this.year;
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
      this.$emit("input", newDate.date());
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
    handleIconClick(event) {
      const { target } = event;

      if (target === this.$refs.todayIcon) {
        const today = DateHelper();
        if (this.selected !== today.ms()) this.selectDay(today.ms());
      } else {
        this.$emit("input", "");
      }
    },
    changeDateTextClass(event) {
      const { type, target } = event;
      if (target === this.$refs.todayIcon || target === this.$refs.clearIcon)
        return;
      const classes =
        type === "mousedown"
          ? "date-selector-text active"
          : "date-selector-text";
      target.setAttribute("class", classes);
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
      target.value = target.value.replace(/\D/g, "");
    },
    handleDateClick() {
      if (!this.showPicker) {
        const date = DateHelper(this.selected);
        const month = date.month();
        const year = date.year();

        if (this.month !== month || this.year !== year) {
          this.month = month;
          this.year = year;
          this.firstOfMonth = DateHelper(this.year, this.month, 1).ms();
          this.calculatePickerDays();
        }
      }
      this.showPicker = !this.showPicker;
    }
  },
  computed: {
    selectedText() {
      if (!this.selected) return "";
      const date = DateHelper(this.selected);
      const month = date.month() + 1;
      const day = date.day();
      const year = date.year();
      return `${month}/${day}/${year}`;
    },
    monthYear() {
      const date = DateHelper(this.firstOfMonth);
      return { month: date.month("long"), year: date.year() };
    },
    selected() {
      if (this.required && !this.value) return DateHelper().ms();
      return this.value ? DateHelper(this.value).ms() : "";
    },
    showClearIcon() {
      if (this.required) return false;
      return !!this.selected;
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
  border-width: 0 0.4rem 0.4rem 0;
  padding: 0.5rem;
  cursor: pointer;
}

.right {
  transform: rotate(-45deg);
  -webkit-transform: rotate(-45deg);
  margin-left: 0.5rem;
}

.left {
  transform: rotate(135deg);
  -webkit-transform: rotate(135deg);
  margin-right: 0.5rem;
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
  box-sizing: border-box;
  position: relative;
  width: 15rem;
  text-align: center;
  height: 3.5rem;
  cursor: pointer;
  * {
    box-sizing: border-box;
  }
}
.date-selector-text {
  margin-left: 3.5rem;
  position: relative;
  font-size: 1.6rem;
  padding: 0.7rem 0 0.8rem 0.65rem;
  text-align: justify;
  display: inline-block;
  width: 11.5rem;
  height: 3.5rem;
  font-weight: 700;
  &.active {
    font-size: 1.5rem;
  }
  border: 0.2rem solid lightgrey;
  border-radius: 0.2rem;

  &:hover {
    box-shadow: 0 0 0.5rem rgba(81, 203, 238, 1);
    border: 0.2rem solid rgba(81, 203, 238, 1);
  }
}
.today-icon {
  @include noselect;
  position: absolute;
  top: -0.1rem;
  left: 0;
  width: 3.5rem;
  display: inline-block;
  &:active {
    border: 0.3rem solid transparent;
  }
}
.clear-icon {
  @include noselect;
  width: 2.5rem;
  height: 100%;
  position: absolute;
  top: 0;
  right: 0.4rem;
  z-index: 100;
  &:active {
    border: 0.3rem solid transparent;
  }
}
.date-selector-picker {
  @include noselect;
  background-color: white;
  position: absolute;
  left: -3rem;
  width: 21rem;
  border: 0.1rem solid black;
  z-index: 100;
  box-shadow: 0 0.4rem 0.8rem 0 rgba(0, 0, 0, 0.2),
    0 0.6rem 2rem 0 rgba(0, 0, 0, 0.19);
}

.week {
  height: 3rem;
  display: flex;
  justify-content: flex-start;
}

.day {
  position: relative;
  box-sizing: border-box;
  padding: 0;
  width: 3rem;
  height: 3rem;
  border: 0.1rem solid black;
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
  height: 3rem;
  color: white;

  i {
    display: inline-block;
  }

  .date-selector-month-text {
    display: inline-block;
    width: 8rem;
    text-align: center;
    font-size: 1.6rem;
    line-height: 3rem;
    font-weight: 700;
    margin-right: 0.5rem;
  }

  .year-input {
    display: inline-block;
    font-weight: 700;
    font-size: 1.6rem;
    line-height: 30px;
    height: 100%;
    text-align: center;
    border: 0;
    padding: 0;
    width: 4rem;
    background-color: black;
    color: white;
    &:hover,
    &:focus {
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

