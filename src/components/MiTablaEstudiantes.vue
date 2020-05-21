<template>
  <v-data-table
    :headers="headers"
    :items="estudiantes"
    sort-by="id"
    class="elevation-1"
  >
    <template v-slot:top>
      <v-toolbar flat color="white">
        <v-toolbar-title>Datos de estudiantes</v-toolbar-title>
        <v-divider
          class="mx-4"
          inset
          vertical
        ></v-divider>
        <v-spacer></v-spacer>
        <v-dialog v-model="dialog" max-width="500px">
          <template v-slot:activator="{ on }">
            <v-btn color="primary" dark class="mb-2" v-on="on">Nuevo estudiante</v-btn>
          </template>
          <v-card>
            <v-card-title>
              <span class="headline">{{ formTitle }}</span>
            </v-card-title>

            <v-card-text>
              <v-container>
                <v-row>
                  <v-col cols="12" sm="6" md="4">
                    <v-text-field v-model="editedItem.matricula"  label="Matricula"></v-text-field>
                  </v-col>
                  <v-col cols="12" sm="6" md="4">
                    <v-text-field v-model="editedItem.apellidoPaterno"  label="Paterno"></v-text-field>
                  </v-col>
                  <v-col cols="12" sm="6" md="4">
                    <v-text-field v-model="editedItem.apellidoMaterno"  label="Materno"></v-text-field>
                  </v-col>
                  <v-col cols="12" sm="6" md="4">
                    <v-text-field v-model="editedItem.nombre"  label="Nombre"></v-text-field>
                  </v-col>
                  <v-col cols="12" sm="6" md="4">
                    <v-text-field v-model="editedItem.semestreIngreso"  label="Semestre Ingreso"></v-text-field>
                  </v-col>
                  <v-col cols="12" sm="6" md="4">
                    <v-text-field v-model="editedItem.creditosCursados"  label="Creditos Cursados"></v-text-field>
                  </v-col>

                </v-row>
              </v-container>
            </v-card-text>

            <v-card-actions>
              <v-spacer></v-spacer>
              <v-btn color="blue darken-1" text @click="close">Cancelar</v-btn>
              <v-btn color="blue darken-1" text @click="save(); enviar(); editarestudiante();">Enviar</v-btn>
            </v-card-actions>
          </v-card>
        </v-dialog>
      </v-toolbar>
    </template>
    <template v-slot:item.actions="{ item }">
      <v-icon
        small
        class="mr-2"
        @click="editItem(item); "
      >
        mdi-pencil
      </v-icon>
      <v-icon
        small
        @click="deleteItem(item); eliminar(item);"
      >
        mdi-delete
      </v-icon>
    </template>
    <template v-slot:no-data>
      <v-btn color="primary" @click="initialize">Reset</v-btn>
    </template>
  </v-data-table>
</template>

<script>
  //let i;
  export default {
    props:{
      clave: Number,
      nombre: String,
      creditos: Number
    },
    data: () => ({
      dialog: false,
      headers: [
        {
          text: 'ID',
          align: 'start',
          sortable: true,
          value: 'id',
        },
        { text: 'Matricula', value: 'matricula' },
        { text: 'Paterno', value: 'apellidoPaterno' },
        { text: 'Materno', value: 'apellidoMaterno' },
        { text: 'Nombre', value: 'nombre' },
        { text: 'Semestre Ingreso', value: 'semestreIngreso' },
        { text: 'Creditos Cursados', value: 'creditosCursados' },
        { text: 'Cursos Asociados', value: 'Cursos[0].nombre' },
        { text: 'Actions', value: 'actions', sortable: false },
      ],
      estudiantes: [],
      editedIndex: -1,
      editedItem: {
        matricula: 0,
        apellidoPaterno: '',
        apellidoMaterno: '',
        nombre: '',
        semestreIngreso: 0,
        creditosCursados: 0,
      },
      defaultItem: {
        matricula: 0,
        apellidoPaterno: '',
        apellidoMaterno: '',
        nombre: '',
        semestreIngreso: 0,
        creditosCursados: 0,
      },
    }),

    computed: {
      formTitle () {
        return this.editedIndex === -1 ? 'New Item' : 'Edit Item'
      },
    },

    watch: {
      dialog (val) {
        val || this.close()
      },
    },

    created () {
      this.mounted()
    },
    mounted: function () {
        fetch('http://localhost:4000/inscripciones',{
            method:'GET',
            headers: {
                'Content-Type': 'application/json'
            }
        }).
        then(response => {
            return response.json();
        }).
        then(datos =>{
            datos.forEach(e => {
                if(!e.Cursos)
                    e.Cursos = [];

                e.Cursos.forEach(c => {
                    fetch(c.nombre,{
                        method:'GET',
                        headers: {
                            'Content-Type': 'application/json'
                        }
                    }).
                    then(respCurso => {
                        return respCurso.json();
                    }).
                    then(datoCurso =>{
                        e.Cursos.push(datoCurso.nombre);
                    }).
                    catch(error => {
                        console.log(error);
                    });
                })
            })
            this.estudiantes = datos;
        }).
        catch(error => {
            console.log(error);
        });
    },
    methods: {
      enviar: function () {
          console.log('Entro al enviar');
          console.log(this.editedItem.nombre);
          let obj={
            matricula: this.editedItem.matricula,
            apellidoPaterno: this.editedItem.apellidoPaterno,
            apellidoMaterno: this.editedItem.apellidoMaterno,
            nombre: this.editedItem.nombre,
            semestreIngreso: this.editedItem.semestreIngreso,
            creditosCursados: this.editedItem.creditosCursados
          }
          console.log(obj)
          fetch('http://localhost:4000/estudiantes/',{
              method:'POST',
              headers: {
                  'Content-Type': 'application/json'
              },
              body:JSON.stringify(obj)
          }).
          then(response => {
               return response.json();
          }).catch(err=>{
            console.log(err);
          })
          console.log('enviado');
      },
      eliminar: function(item){
          console.log('Eliminando');
          console.log(item.id);
          //this.$emit('ok');
          fetch('http://localhost:4000/estudiantes/'+item.id,{
              method:'DELETE',
              headers: {
                  'Content-Type': 'application/json'
              }
          }).
          then(response => {
              return response.json();
          })
      },
      editarestudiante: function(){
        console.log('Editando');
        console.log(this.editedItem.nombre);
        let obj={
          matricula: this.editedItem.matricula,
          apellidoPaterno: this.editedItem.apellidoPaterno,
          apellidoMaterno: this.editedItem.apellidoMaterno,
          nombre: this.editedItem.nombre,
          semestreIngreso: this.editedItem.semestreIngreso,
          creditosCursados: this.editedItem.creditosCursados
        }
        fetch('http://localhost:4000/estudiantes/'+this.editedItem.id,{
            method:'PUT',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(obj)
        }).
        then(response => {
            return response.json();
        }).catch(err=>{
          console.log(err);
        })
        console.log('Actualizado');
      },
      editItem (item) {
        this.editedIndex = this.estudiantes.indexOf(item)
        this.editedItem = Object.assign({}, item)
        this.dialog = true
      },

      deleteItem (item) {
        const index = this.estudiantes.indexOf(item)
        confirm('Estas seguro de que quieres borrar el estudiante?') && this.estudiantes.splice(index, 1)
      },

      close () {
        this.dialog = false
        this.$nextTick(() => {
          this.editedItem = Object.assign({}, this.defaultItem)
          this.editedIndex = -1
        })
      },

      save () {
        if (this.editedIndex > -1) {
          Object.assign(this.estudiantes[this.editedIndex], this.editedItem)
        } else {
          this.estudiantes.push(this.editedItem)
        }
        this.close()
      },
      getTagNames (estudiantes) {
        return estudiantes.map(estudiantes => estudiantes.nombre)
      },
    },
  }
</script>
