<template>
  <v-app>
    <Navbar/>

    <v-content>
      <div id="app">

    <router-view />
  </div>
    </v-content>
  </v-app>
</template>

<script>
import Navbar from "./components/Navbar.vue";
export default {
  name: "App",

  components: {
    Navbar
  },

  data: () => ({
    //
  })
};
</script>
