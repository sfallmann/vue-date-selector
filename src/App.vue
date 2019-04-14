<template>
  <div id="app">
    <h1>Date Selector Demo</h1>
    <DateSelector id="my-date" v-model="date" />
  </div>
</template>

<script>
import DateSelector from "./components/DateSelector";

export default {
  name: "App",
  components: {
    DateSelector
  },
  data() {
    return {
      date: '12/30/2004',
    }
  },
  methods: {
    test(value) {
      this.date = value;
    }
  }
};
</script>

<style>
#app {
  font-family: "Avenir", Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
  margin-top: 60px;
  position: relative;
}

#my-date {
  position: absolute;
  left: 50%;
  transform: translateX(-50%);
}
</style>
