<template>
  <v-data-table
    :headers="headers"
    :items="inscripciones"
    sort-by="id"
    class="elevation-1"
  >
    <template v-slot:top>
      <v-toolbar flat color="white">
        <v-toolbar-title>Datos de inscripciones</v-toolbar-title>
        <v-divider
          class="mx-4"
          inset
          vertical
        ></v-divider>
        <v-spacer></v-spacer>
        <v-dialog v-model="dialog" max-width="500px">
          <template v-slot:activator="{ on }">
            <v-btn color="primary" dark class="mb-2" v-on="on">Nueva inscripcion</v-btn>
          </template>
          <v-card>
            <v-card-title>
              <span class="headline">{{ formTitle }}</span>
            </v-card-title>

            <v-card-text>
              <v-container>
                <v-row>
                  <v-col cols="12" sm="6" md="4">
                    <v-text-field v-model="editedItem.estudianteid"  label="Estudiante ID"></v-text-field>
                  </v-col>
                  <v-col cols="12" sm="6" md="4">
                    <v-text-field v-model="editedItem.cursoid"  label="Curso ID"></v-text-field>
                  </v-col>

                </v-row>
              </v-container>
            </v-card-text>

            <v-card-actions>
              <v-spacer></v-spacer>
              <v-btn color="blue darken-1" text @click="close">Cancelar</v-btn>
              <v-btn color="blue darken-1" text @click="save(); enviar();">Enviar</v-btn>
            </v-card-actions>
          </v-card>
        </v-dialog>
      </v-toolbar>
    </template>
    <template v-slot:item.actions="{ item }">
      <!-- <v-icon
        small
        class="mr-2"
        @click="editItem(item); "
      >
        mdi-pencil
      </v-icon> -->
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
          value: 'Cursos[0].Inscripciones.id',
        },
        { text: 'Estudiante ID', value: 'Cursos[0].Inscripciones.estudianteid' },
        { text: 'Curso ID', value: 'Cursos[0].Inscripciones.cursoid' },
        { text: 'Actions', value: 'actions', sortable: false },
      ],
      inscripciones: [],
      editedIndex: -1,
      editedItem: {
        estudianteid: 0,
        cursoid: 0,
      },
      defaultItem: {
        estudianteid: 0,
        cursoid: 0,
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
            this.inscripciones = datos;
        }).
        catch(error => {
            console.log(error);
        });
    },
    methods: {
      enviar: function () {
          console.log('Entro al enviar');
          let obj={
            estudianteid: this.editedItem.estudianteid,
            cursoid: this.editedItem.cursoid
          }
          console.log(obj)
          fetch('http://localhost:4000/inscripciones/',{
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
          console.log(item.Cursos[0].Inscripciones.id);
          //this.$emit('ok');
          fetch('http://localhost:4000/inscripciones/'+item.Cursos[0].Inscripciones.id,{
              method:'DELETE',
              headers: {
                  'Content-Type': 'application/json'
              }
          }).
          then(response => {
              return response.json();
          })
      },
      editarcurso: function(item){
        console.log('Editando');
        console.log(item.Curso);
        let obj={
          clave: item.clave,
          nombre: item.nombre,
          creditos: item.creditos
        }
        fetch('http://localhost:4000/cursos/'+item.id,{
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
        this.editedIndex = this.inscripciones.indexOf(item)
        this.editedItem = Object.assign({}, item)
        this.dialog = true
      },

      deleteItem (item) {
        const index = this.inscripciones.indexOf(item)
        confirm('Estas seguro de que quieres borrar la inscripcion?') && this.inscripciones.splice(index, 1)
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
          Object.assign(this.inscripciones[this.editedIndex], this.editedItem)
        } else {
          this.inscripciones.push(this.editedItem)
        }
        this.close()
      },
      getTagNames (inscripciones) {
        return inscripciones.map(inscripciones => inscripciones.nombre)
      },
    },
  }
</script>
