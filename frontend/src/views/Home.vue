<template>
    <div class="p-5 mt-4">
        <button type="button" class="addbtn btn mb-4"
        data-bs-toggle="modal" data-bs-target="#exampleModalAdd"><i class="fas fa-plus-circle"></i> Añadir nuevo vuelo</button>
        <table class="table display" id="tabla_register">
            <thead class="thread-table" style="text-align: center; ">
                <tr>
                <th>ID Vuelo</th>
                <th>Origen</th>
                <th>Destino</th>
                <th>Fecha</th>
                <th>Acciones</th>
                </tr>
            </thead>
            <tbody>
                <tr v-for="flight in flights" :key="flight.flightid" style="text-align: center; ">
                <td>{{flight.flightid}}</td>
                <td>{{flight.flightsource}}</td>
                <td>{{flight.flightdest}}</td>
                <td>{{flight.flightdate}}</td>
                <td>
                    <div class="btn-group" role="group" aria-label="Basic example">
                        <button type="button" class="editbtn btn btn-primary" v-on:click="getSetsId(flight.flightid)"
                        data-bs-toggle="modal" data-bs-target="#modalSeats"><i class="fas fa-info-circle"></i></button>
                        <button type="button" class="editbtn btn btn-warning" v-on:click="getFlightId(flight.flightid)"
                        data-bs-toggle="modal" data-bs-target="#exampleModalEdit"><i class="fas fa-pencil-alt"></i></button>
                        <button type="button" v-on:click="deleteFlight(flight.flightid)" class="btn btn-danger">
                        <i class="fas fa-trash-alt"></i></button>
                    </div>
                </td>
                </tr>
            </tbody>
        </table>
        <!-- MODAL ADD FLIGHT -->
        <div class="modal fade" id="exampleModalAdd" tabindex="-1" aria-labelledby="exampleModalLabel" aria-hidden="true">
            <div class="modal-dialog">
                <div class="modal-content">
                    <div class="modal-header">
                        <h5 class="modal-title" id="exampleModalLabel">Añadir nuevo vuelo</h5>
                        <button type="button" class="xbtn btn" data-bs-dismiss="modal" aria-label="Close">X</button>
                    </div>
                    <div class="modal-body">
                        <form v-on:submit.prevent="addFlight" method="post" class="row register g-3">
                            <div class="col-12">
                                <label for="inputId" class="form-label">ID del vuelo: </label>
                                <input type="text" class="form-control" name="inputId" id="form-field" v-model="form.flightid">
                            </div>
                            <div class="col-12">
                                <label for="inputSource" class="form-label">Origen del vuelo: </label>
                                <input type="text" class="form-control" name="inputSource" id="form-field" v-model="form.flightsource">
                            </div>
                            <div class="col-12">
                                <label for="inputDest" class="form-label">Destino del vuelo: </label>
                                <input type="text" class="form-control" name="inputDest" id="form-field" v-model="form.flightdest">
                            </div>
                            <div class="col-12">
                                <label for="inputDate" class="form-label">Fecha del vuelo: </label>
                                <input type="text" class="form-control" name="inputDate" id="form-field" v-model="form.flightdate">
                            </div>
                            <div class="col-12">
                                <button type="submit" class="savebtn btn">Añadir vuelo</button>
                                <button type="button" class="btn btn-danger" data-bs-dismiss="modal">Cancelar</button>
                            </div>
                        </form>
                    </div>
                </div>
            </div>
        </div>
        <!-- MODAL EDIT FLIGHT -->
        <div class="modal fade" id="exampleModalEdit" tabindex="-1" aria-labelledby="exampleModalLabel" aria-hidden="true">
            <div class="modal-dialog">
                <div class="modal-content">
                    <div class="modal-header">
                        <h5 class="modal-title" id="exampleModalLabel">Editar Vuelo: {{flight.flightid}}</h5>
                        <button type="button" class="xbtn btn" data-bs-dismiss="modal" aria-label="Close">X</button>
                    </div>
                    <div class="modal-body">
                        <form v-on:submit.prevent="editFlight(flight.flightid)" method="post" class="row register g-3">
                            <div class="col-12">
                                <label for="inputId" class="form-label">ID del vuelo: </label>
                                <input type="text" class="form-control" name="inputId" id="form-field" v-model="flight.flightid" disabled>
                            </div>
                            <div class="col-12">
                                <label for="inputSource" class="form-label">Origen del vuelo: </label>
                                <input type="text" class="form-control" name="inputSource" id="form-field" v-model="flight.flightsource">
                            </div>
                            <div class="col-12">
                                <label for="inputDest" class="form-label">Destino del vuelo: </label>
                                <input type="text" class="form-control" name="inputDest" id="form-field" v-model="flight.flightdest">
                            </div>
                            <div class="col-12">
                                <label for="inputDate" class="form-label">Fecha del vuelo: </label>
                                <input type="text" class="form-control" name="inputDate" id="form-field" v-model="flight.flightdate" disabled>
                            </div>
                            <div class="col-12">
                                <button type="submit" class="savebtn btn">Editar vuelo</button>
                                <button type="button" class="btn btn-danger" data-bs-dismiss="modal">Cancelar</button>
                            </div>
                        </form>
                    </div>
                </div>
            </div>
        </div>
        <!-- Scrollable modal -->
        <!-- Modal -->
        <div class="modal fade" id="modalSeats" tabindex="-1" aria-labelledby="exampleModalLabel" aria-hidden="true">
            <div class="modal-dialog modal-dialog-scrollable">
                <div class="modal-content">
                    <div class="modal-header">
                        <h5 class="modal-title" id="exampleModalLabel">Asientos reservados</h5>
                        <button type="button" class="xbtn btn" data-bs-dismiss="modal" aria-label="Close">X</button>
                    </div>
                    <div class="modal-body">
                        <div class="card mb-2" v-for="seat in seats" :key="seat.flight_id">
                            <div class="card-body">
                                <h5 class="card-title">ID Vuelo: </h5>
                                <p class="card-text">{{seat.flight_id}}</p>
                                <h5 class="card-title">Numero de asiento: </h5>
                                <p class="card-text">{{seat.seat_number}}</p>
                                <h5 class="card-title">Costo de asiento: </h5>
                                <p class="card-text">{{seat.seat_cost}}</p>
                            </div>
                        </div>
                    </div>
                    <div class="modal-footer">
                        <button type="button" class="btn btn-secondary" data-bs-dismiss="modal">Cerrar</button>
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
        this.getAllFlights();
    },
    data ()
    {
        return {
        form: {
            flightid: '',
            flightsource: '',
            flightdest: '',
            flightdate: '',
        },
        flights: [],
        flight: {},
        seats: [],
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
        getAllFlights()
        {
        axios.get(`http://localhost:3000/crud/`)
            .then((response) => {
            this.flights = response.data;
            this.tabla();
            console.log(response);
            });
        },
        getFlightId(id)
        {
            this.flight = {};
            console.log(id);
            axios.get(`http://localhost:3000/crud/${id}`)
                .then(res => {
                    this.flight = res.data[0];
                    console.log(this.flight);
                }).catch(err => {
                    console.log(err);
                });
        },
        getSetsId(id)
        {
            console.log(id);
            this.seats = [];
            axios.get(`http://localhost:3000/seatflight/${id}`)
                .then(res => {
                if (res.data != null)
                {
                    this.seats = res.data;
                    console.log(this.seats);
                }
                }).catch(err => {
                    console.log(err);
                });
        },
        addFlight()
        {
            axios.post(`http://localhost:3000/crud/`, this.form,
            {
                headers:
                {
                    'Content-type': 'application/json'
                }
            }).then(res => {
                console.log(res);
                this.getAllFlights();
                alert("¡Vuelo guardado con éxito!")
            }).catch(err => {
                console.log(err);
            })
        },
        editFlight(id)
        {
            console.log(this.flight);
            this.flight.ticketcost = parseFloat(this.flight.ticketcost);
            axios.put(`http://localhost:3000/crud/${id}`, this.flight,
            {
                headers:
                {
                    'Content-type': 'application/json'
                }
            }).then(res => {
                console.log(res.data);
                this.getAllFlights();
                alert(`¡Se notifica que el vuelo con el id(${id}) ha sido actualizado con éxito!`);
            }).catch(err => {
                console.log(err);
            })
        },
        deleteFlight(id)
        {
            console.log(id);
            axios.delete(`http://localhost:3000/crud/${id}`)
                .then((resData) => {
                    console.log(resData.data);
                    this.getAllFlights();
                    alert(`¡Se notifica que el vuelo con el id(${id}) ha sido eliminado con éxito!`);
                }).catch(err => {
                    console.log(err);
                });
        }
    }
}
</script>
