<template>
  <div id="app">
    <h1>Date Selector Demo</h1>
    <DateSelector id="my-date" value="2012-12-03"/>
  </div>
</template>

<script>
import DateSelector from "./components/DateSelector";

export default {
  name: "App",
  components: {
    DateSelector
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
