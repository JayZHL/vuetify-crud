<template>
  <v-data-table
    :headers="headers"
    :items="cursos"
    sort-by="id"
    class="elevation-1"
  >
    <template v-slot:top>
      <v-toolbar flat color="white">
        <v-toolbar-title>Datos de cursos</v-toolbar-title>
        <v-divider
          class="mx-4"
          inset
          vertical
        ></v-divider>
        <v-spacer></v-spacer>
        <v-dialog v-model="dialog" max-width="500px">
          <template v-slot:activator="{ on }">
            <v-btn color="primary" dark class="mb-2" v-on="on">Nuevo curso</v-btn>
          </template>
          <v-card>
            <v-card-title>
              <span class="headline">{{ formTitle }}</span>
            </v-card-title>

            <v-card-text>
              <v-container>
                <v-row>
                  <!-- <v-col cols="12" sm="6" md="4">
                    <v-text-field v-model="editedItem.name" label="ID"></v-text-field>
                  </v-col> -->
                  <v-col cols="12" sm="6" md="4">
                    <v-text-field v-model="editedItem.clave"  label="Clave"></v-text-field>
                  </v-col>
                  <v-col cols="12" sm="6" md="4">
                    <v-text-field v-model="editedItem.nombre"  label="Nombre"></v-text-field>
                  </v-col>
                  <v-col cols="12" sm="6" md="4">
                    <v-text-field v-model="editedItem.creditos"  label="Creditos"></v-text-field>
                  </v-col>

                </v-row>
              </v-container>
            </v-card-text>

            <v-card-actions>
              <v-spacer></v-spacer>
              <v-btn color="blue darken-1" text @click="close">Cancelar</v-btn>
              <v-btn color="blue darken-1" text @click="save(); enviar(); editarcurso()">Enviar</v-btn>
              <!-- <v-btn color="blue darken-1" text @click="save();  editarcurso()">Modificar</v-btn> -->
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
        { text: 'Clave', value: 'clave' },
        { text: 'Nombre', value: 'nombre' },
        { text: 'Creditos', value: 'creditos' },
        { text: 'Actions', value: 'actions', sortable: false },
      ],
      cursos: [],
      editedIndex: -1,
      editedItem: {
        clave: 0,
        nombre: '',
        creditos: 0,
      },
      defaultItem: {
        clave: 0,
        nombre: '',
        creditos: 0,
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
        fetch('http://localhost:4000/cursos',{
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
                if(!e.cursosNombre)
                    e.cursosNombre = [];
                e.cursosNombre.forEach(c => {
                    fetch(c,{
                        method:'GET',
                        headers: {
                            'Content-Type': 'application/json'
                        }
                    }).
                    then(respCurso => {
                        return respCurso.json();
                    }).
                    then(datoCurso =>{
                        e.cursosNombre.push(datoCurso.nombre);
                    }).
                    catch(error => {
                        console.log(error);
                    });
                })
            })
            this.cursos = datos;
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
            clave: this.editedItem.clave,
            nombre:this.editedItem.nombre,
            creditos: this.editedItem.creditos
          }
          console.log(obj)
          fetch('http://localhost:4000/cursos/',{
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
          fetch('http://localhost:4000/cursos/'+item.id,{
              method:'DELETE',
              headers: {
                  'Content-Type': 'application/json'
              }
          }).
          then(response => {
              return response.json();
          })
      },
      editarcurso:  function(){
        console.log('Editando');
        console.log(this.editedItem.nombre);
        let obj={
          clave: this.editedItem.clave,
          nombre: this.editedItem.nombre,
          creditos: this.editedItem.creditos
        }
         fetch('http://localhost:4000/cursos/'+this.editedItem.id,{
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
        this.editedIndex = this.cursos.indexOf(item)
        this.editedItem = Object.assign({}, item)
        this.dialog = true
      },

      deleteItem (item) {
        const index = this.cursos.indexOf(item)
        confirm('Estas seguro de que quieres borrar el curso?') && this.cursos.splice(index, 1)
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
          Object.assign(this.cursos[this.editedIndex], this.editedItem)
        } else {
          this.cursos.push(this.editedItem)
        }
        this.close()
      },
    },
  }
</script>
