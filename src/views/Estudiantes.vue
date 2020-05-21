<template>
  <div class="container">

      <mi-tabla-estudiantes>Datos de estudiantes</mi-tabla-estudiantes>
    </div>
</template>

<script>
import miTablaEstudiantes from "@/components/MiTablaEstudiantes.vue";

export default {
  name: "Estudiantes",
  components: {
    miTablaEstudiantes
  }
};
</script>

<style lang="css" scoped>
</style>
