<template>
  <div class="container">

      <mi-tabla-cursos>Datos de cursos</mi-tabla-cursos>
    </div>
</template>
<script>
// @ is an alias to /src
import miTablaCursos from "@/components/MiTablaCursos.vue";

export default {
  name: "Cursos",
  components: {
    miTablaCursos
  }
};
</script>
<style>
.container{
}

</style>
