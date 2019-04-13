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
            <span>{{ pickerDays[w - 1][d - 1].dayOfWeek }}</span>
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
import moment from "moment";

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
      default: moment()
        .date(1)
        .format()
    }
  },
  data() {
    return {
      firstOfMonth: moment()
        .date(1)
        .format(),
      showPicker: false,
      pickerDays: [],
      selected: moment().format(),
      month: "",
      year: ""
    };
  },
  methods: {
    calculatePickerDays() {
      this.pickerDays = [];
      const placeholder = moment(this.firstOfMonth);
      this.month = placeholder.get("month");
      this.year = placeholder.get("year");
      const diff = placeholder.get("day");
      placeholder.date(1).subtract(diff, "days");

      for (let w = 0; w < 6; w++) {
        let week = [];
        for (let d = 0; d < 7; d++) {
          const dayObj = {};

          dayObj.date =
            d === 0 && w === 0
              ? moment(placeholder).format()
              : moment(placeholder.add(1, "days")).format();
          dayObj.dayOfWeek = moment(dayObj.date).format("D");
          week.push(dayObj);
        }
        this.pickerDays.push(week);
      }
    },
    isCurrentMonth(date) {
      return (
        moment(date).get("month") === this.month &&
        moment(date).get("year") === this.year
      );
    },
    isSelected(date) {
      return date === this.selected;
    },
    changeMonth(dir) {
      if (dir === "add") {
        this.firstOfMonth = moment(this.firstOfMonth)
          .add(1, "months")
          .format();
      } else {
        this.firstOfMonth = moment(this.firstOfMonth)
          .subtract(1, "months")
          .format();
      }
      this.calculatePickerDays();
    },
    selectDay(date) {
      this.selected = moment(date).format();
      this.showPicker = false;

      if (!this.isCurrentMonth(date)) {
        this.month = moment(this.selected).get("month");
        this.year = moment(this.selected).get("year");
        this.firstOfMonth = moment(date)
          .date(1)
          .format();
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
      return moment(this.selected).format("M/DD/YYYY");
    },
    monthYearText() {
      return moment(this.firstOfMonth).format("MMM YYYY");
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

