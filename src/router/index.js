import Vue from "vue";
import VueRouter from "vue-router";
import Cursos from "../views/Cursos.vue";
import Estudiantes from "../views/Estudiantes.vue";
import Inscripciones from "../views/Inscripciones.vue";


Vue.use(VueRouter);

const routes = [
  {
    path: "/",
    name: "Estudiantes",
    component: Estudiantes
  },
  {
    path: "/cursos",
    name: "Cursos",
    component: Cursos
  },
  {
    path: "/inscripciones",
    name: "Inscripciones",
    component: Inscripciones
  }
];

const router = new VueRouter({
  mode: "history",
  base: process.env.BASE_URL,
  routes
});

export default router;
