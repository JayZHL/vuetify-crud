<template>
  <nav>
    <v-app-bar app color="dark" dark>
      <v-app-bar-nav-icon @click.stop="drawer = !drawer"></v-app-bar-nav-icon>
      <div class="d-flex align-center">
        <v-img
          alt="UABC Logo"
          class="shrink mr-2"
          contain
          src="../assets/uabc.png"
          transition="scale-transition"
          width="80"
        />
        </div>
    </v-app-bar>
    <v-navigation-drawer v-model="drawer" app class="dark">
      <v-list
        nav
        dense
      >
        <v-list-item-group v-model="item" color="dark">
          <v-list-item
            v-for="(item, i) in items"
            :key="i"
          router :to="item.route">
            <v-list-item-icon>
              <v-icon v-text="item.icon"></v-icon>
            </v-list-item-icon>

            <v-list-item-content>
              <v-list-item-title v-text="item.text"></v-list-item-title>
            </v-list-item-content>
          </v-list-item>
        </v-list-item-group>
      </v-list>
    </v-navigation-drawer>
  </nav>
</template>

<script>
export default {
  data(){
    return{
      drawer:false,
      items: [
        { text: 'Estudiantes', icon: 'mdi-account-group',route: '/' },
        { text: 'Cursos', icon: 'mdi-notebook-multiple', route: '/cursos'},
        { text: 'Inscripciones', icon: 'mdi-pencil-plus', route: '/inscripciones'},
      ],
    }
  }
}
</script>

<style>
</style>
