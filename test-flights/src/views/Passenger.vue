<template>
    <div class="p-4 mt-4">
        <button type="button" class="addbtn btn mb-4"
        data-bs-toggle="modal" data-bs-target="#exampleModalAdd"><i class="fas fa-plus-circle"></i> Añadir nuevo pasajero</button>
        <table class="table display" id="tabla_register">
            <thead class="thread-table" style="text-align: center; ">
                <tr>
                    <th>ID Pasajero</th>
                    <th>Nombre</th>
                    <th>Email</th>
                    <th>Fecha de nacimiento</th>
                    <th>Acciones</th>
                </tr>
            </thead>
            <tbody>
                <tr v-for="passenger in passengers" :key="passenger.passid" style="text-align: center; ">
                    <td>{{passenger.passid}}</td>
                    <td>{{passenger.passname}}</td>
                    <td>{{passenger.passemail}}</td>
                    <td>{{passenger.passdob}}</td>
                    <td>
                        <button type="button" class="editbtn btn btn-warning" v-on:click="getPassengerId(passenger.passid)"
                        data-bs-toggle="modal" data-bs-target="#exampleModalEdit"><i class="fas fa-pencil-alt"></i></button>
                        <button type="button" v-on:click="deletePassenger(passenger.passid)" class="btn btn-danger"><i class="fas fa-trash-alt"></i></button>
                    </td>
                </tr>
            </tbody>
        </table>
        <!-- MODAL ADD FLIGHT -->
        <div class="modal fade" id="exampleModalAdd" tabindex="-1" aria-labelledby="exampleModalLabel" aria-hidden="true">
            <div class="modal-dialog">
                <div class="modal-content">
                    <div class="modal-header">
                        <h5 class="modal-title" id="exampleModalLabel">Añadir nuevo pasajero</h5>
                        <button type="button" class="xbtn btn" data-bs-dismiss="modal" aria-label="Close">X</button>
                    </div>
                    <div class="modal-body">
                        <form v-on:submit.prevent="addPassenger" method="post" class="row register g-3">
                            <div class="col-12">
                                <label for="inputId" class="form-label">ID del pasajero: </label>
                                <input type="text" class="form-control" name="inputId" id="form-field" v-model="form.passid">
                            </div>
                            <div class="col-12">
                                <label for="inputName" class="form-label">Nombre del pasajero: </label>
                                <input type="text" class="form-control" name="inputName" id="form-field" v-model="form.passname">
                            </div>
                            <div class="col-12">
                                <label for="inputEmail" class="form-label">E-mail del pasajero: </label>
                                <input type="text" class="form-control" name="inputEmail" id="form-field" v-model="form.passemail">
                            </div>
                            <div class="col-12">
                                <label for="inputDob" class="form-label">Fecha de nacimiento: </label>
                                <input type="text" step="any" class="form-control" name="inputDob" id="form-field" v-model="form.passdob">
                            </div>
                            <div class="col-12">
                                <button type="submit" class="savebtn btn">Añadir pasajero</button>
                                <button type="button" class="btn btn-danger" data-bs-dismiss="modal">Cancelar</button>
                            </div>
                        </form>
                    </div>
                </div>
            </div>
        </div>
        <!-- MODAL EDIT PASSENGER -->
        <div class="modal fade" id="exampleModalEdit" tabindex="-1" aria-labelledby="exampleModalLabel" aria-hidden="true">
            <div class="modal-dialog">
                <div class="modal-content">
                    <div class="modal-header">
                        <h5 class="modal-title" id="exampleModalLabel">Editar pasajero: {{passenger.passid}}</h5>
                        <button type="button" class="xbtn btn" data-bs-dismiss="modal" aria-label="Close">X</button>
                    </div>
                    <div class="modal-body">
                        <form v-on:submit.prevent="editPassenger(passenger.passid)" method="post" class="row register g-3">
                            <div class="col-12">
                                <label for="inputId" class="form-label">ID del pasajero: </label>
                                <input type="text" class="form-control" name="inputId" id="form-field" v-model="passenger.passid" disabled>
                            </div>
                            <div class="col-12">
                                <label for="inputName" class="form-label">Nombre del pasajero: </label>
                                <input type="text" class="form-control" name="inputName" id="form-field" v-model="passenger.passname">
                            </div>
                            <div class="col-12">
                                <label for="inputEmail" class="form-label">E-mail del pasajero: </label>
                                <input type="text" class="form-control" name="inputEmail" id="form-field" v-model="passenger.passemail">
                            </div>
                            <div class="col-12">
                                <label for="inputDob" class="form-label">Fecha de nacimiento: </label>
                                <input type="text" step="any" class="form-control" name="inputDob" id="form-field" disabled v-model="passenger.passdob">
                            </div>
                            <div class="col-12">
                                <button type="submit" class="savebtn btn">Editar pasajero</button>
                                <button type="button" class="btn btn-danger" data-bs-dismiss="modal">Cancelar</button>
                            </div>
                        </form>
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>
<script>
import $ from 'jquery';
import axios from "axios";
export default {
    mounted ()
    {
        this.getAllPassengers();
    },
    data ()
    {
        return {
            form: {
                passid: '',
                passname: '',
                passemail: '',
                passdob: '',
            },
            passengers: [],
            passenger: {}
        }
    },
    methods: {
        tabla()
        {
        this.$nextTick(() => {
            $('#tabla_register').DataTable({
            "language": {
                "url": "https://cdn.datatables.net/plug-ins/1.11.3/i18n/es_es.json"
            },
            "pageLength": 5,
            "lengthMenu": [[5, 10, 20, -1], [5, 10, 20, "All"]],
            "retrieve": true
            });
        });
        },
        getAllPassengers()
        {
        axios.get(`http://localhost:3000/passenger/`)
            .then((response) => {
            this.passengers = response.data;
            this.tabla();
            console.log(response);
            });
        },
        getPassengerId(id)
        {
            this.passenger = {};
            console.log(id);
            axios.get(`http://localhost:3000/passenger/${id}`)
                .then(res => {
                    this.passenger = res.data[0];
                    console.log(this.passenger);
                }).catch(err => {
                    console.log(err);
                });
        },
        addPassenger()
        {
            axios.post(`http://localhost:3000/passenger/`, this.form,
            {
                headers:
                {
                    'Content-type': 'application/json'
                }
            }).then(res => {
                console.log(res);
                this.getAllPassengers();
                alert("¡Pasajero guardado con éxito!")
            }).catch(err => {
                console.log(err);
            })
        },
        editPassenger(id)
        {
            console.log(this.passenger);
            axios.put(`http://localhost:3000/passenger/${id}`, this.passenger,
            {
                headers:
                {
                    'Content-type': 'application/json'
                }
            }).then(res => {
                console.log(res.data);
                this.getAllPassengers();
                alert(`¡Se notifica que el pasajero con el id(${id}) ha sido actualizado con éxito!`);
            }).catch(err => {
                console.log(err);
            })
        },
        deletePassenger(id)
        {
            console.log(id);
            axios.delete(`http://localhost:3000/passenger/${id}`)
                .then((resData) => {
                    console.log(resData.data);
                    this.getAllPassengers();
                    alert(`¡Se notifica que el pasajero con el id(${id}) ha sido eliminado con éxito!`);
                }).catch(err => {
                    console.log(err);
                });
        }
    }
}
</script>