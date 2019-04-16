<template>
  <div id="app">
    <h1>Date Selector Demo</h1>
    <DateSelector id="my-date" v-model="date"/>
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
      date: ""
    };
  },
  methods: {
    test(value) {
      this.date = value;
    }
  }
};
</script>

<style>
@import url("https://fonts.googleapis.com/css?family=Roboto:400,700");
html {
  font-size: 0.625rem;
}
body * {
  font-family: "Roboto", sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
}

#app {
  text-align: center;
  color: #2c3e50;
  margin-top: 6rem;
  position: relative;
}

#my-date {
  position: absolute;
  left: 50%;
  transform: translateX(-50%);
}

h1 {
  font-size: 3.2rem;
}
</style>
