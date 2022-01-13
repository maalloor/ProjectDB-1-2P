<template>
    <div class="p-5 mt-4">
      <button type="button" class="addbtn btn mb-4"
      data-bs-toggle="modal" data-bs-target="#exampleModalAdd"><i class="fas fa-plus-circle"></i> Añadir nueva reserva</button>
        <table class="table display" id="tabla_register">
            <thead class="thread-table" style="text-align: center; ">
                <tr>
                    <th>ID Reserva</th>
                    <th>ID Vuelo</th>
                    <th>ID Asiento</th>
                    <th>Fecha de reserva</th>
                    <th>Acciones</th>
                </tr>
            </thead>
            <tbody>
                <tr v-for="booking in bookings" :key="booking.bookingid" style="text-align: center; ">
                    <td>{{booking.bookingid}}</td>
                    <td>{{booking.flightid}}</td>
                    <td>{{booking.seatid}}</td>
                    <td>{{booking.bookdate}}</td>
                    <td>
                        <button type="button" class="editbtn btn btn-primary" v-on:click="getDetailsId(booking.bookingid)"
                        data-bs-toggle="modal" data-bs-target="#modalDetails"><i class="fas fa-info-circle"></i></button>
                        <button type="button" v-on:click="deleteBooking(booking.bookingid)" class="btn btn-danger"><i class="fas fa-trash-alt"></i></button>
                    </td>
                </tr>
            </tbody>
        </table>
        <!-- MODAL ADD BOOKING -->
        <div class="modal fade" id="exampleModalAdd" tabindex="-1" aria-labelledby="exampleModalLabel" aria-hidden="true">
            <div class="modal-dialog">
                <div class="modal-content">
                    <div class="modal-header">
                        <h5 class="modal-title" id="exampleModalLabel">Añadir nueva reserva</h5>
                        <button type="button" class="xbtn btn" data-bs-dismiss="modal" aria-label="Close">X</button>
                    </div>
                    <div class="modal-body">
                        <form v-on:submit.prevent="addBooking" method="post" class="row register g-3">
                            <div class="col-12">
                                <label for="inputId" class="form-label">ID Reserva: </label>
                                <input type="text" class="form-control" name="inputId" id="form-field" v-model="form.bookingid">
                            </div>
                            <div class="col-12">
                                <label for="inputIdf" class="form-label">ID Vuelo: </label>
                                <input type="text" class="form-control" name="inputIdf" id="form-field" v-model="form.flightid">
                            </div>
                            <div class="col-12">
                                <label for="inputIdf" class="form-label">ID Asiento: </label>
                                <input type="text" class="form-control" name="inputIdf" id="form-field" v-model="form.seatid">
                            </div>
                            <div class="col-12">
                                <label for="inputDate" class="form-label">Fecha de reserva: </label>
                                <input type="text" class="form-control" name="inputDate" id="form-field" v-model="form.bookdate">
                            </div>
                            <div class="col-12">
                                <label for="inputIdp" class="form-label">ID pasajero: </label>
                                <input type="number" class="form-control" name="inputIdp" id="form-field" v-model="form.passid">
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
        <!-- Scrollable modal -->
        <!-- Modal -->
        <div class="modal fade" id="modalDetails" tabindex="-1" aria-labelledby="exampleModalLabel" aria-hidden="true">
            <div class="modal-dialog modal-dialog-scrollable">
                <div class="modal-content">
                    <div class="modal-header">
                        <h5 class="modal-title" id="exampleModalLabel">Detalles de la reserva</h5>
                        <button type="button" class="xbtn btn" data-bs-dismiss="modal" aria-label="Close">X</button>
                    </div>
                    <div class="modal-body">
                        <div class="card mb-2" v-for="reg in details" :key="reg.booking_id">
                            <div class="card-body">
                                <h5 class="card-title">ID Reserva: </h5>
                                <p class="card-text">{{reg.booking_id}}</p>
                                <h5 class="card-title">ID Vuelo: </h5>
                                <p class="card-text">{{reg.flight_id}}</p>
                                <h5 class="card-title">ID Pasajero: </h5>
                                <p class="card-text">{{reg.pass_id}}</p>
                                <h5 class="card-title">Nombre del Pasajero: </h5>
                                <p class="card-text">{{reg.pass_name}}</p>
                                <h5 class="card-title">Destino: </h5>
                                <p class="card-text">{{reg.flight_dest}}</p>
                                <h5 class="card-title">Fecha de reserva: </h5>
                                <p class="card-text">{{reg.book_date}}</p>
                                <h5 class="card-title">Fecha de vuelo: </h5>
                                <p class="card-text">{{reg.flight_date}}</p>
                                <h5 class="card-title">Costo de asiento: </h5>
                                <p class="card-text">{{reg.seat_cost}}</p>
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
import Home from './Home.vue';
export default {
    mounted ()
    {
        this.getAllBookings();
    },
    data ()
    {
        return {
            form: {
                bookingid: '',
                flightid: '',
                seatid: '',
                bookdate: '',
                passid: ''
            },
            bookings: [],
            details: [],
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
                "retrieve": true,
                "pageLength": 5,
                "lengthMenu": [[5, 10, 20, -1], [5, 10, 20, "All"]]
                });
            });
        },
        getAllBookings()
        {
        axios.get(`http://localhost:3000/booking/`)
            .then((response) => {
            this.bookings = response.data;
            this.tabla();
            console.log(response);
            });
        },
        getDetailsId(id)
        {
            console.log(id);
            this.details = [];
            axios.get(`http://localhost:3000/bookingpassenger/${id}`)
                .then(res => {
                if (res.data != null)
                {
                    this.details = res.data;
                    console.log(this.details);
                }
                }).catch(err => {
                    console.log(err);
                });
        },
        addBooking()
        {
            axios.post(`http://localhost:3000/booking/`, this.form,
            {
                headers:
                {
                    'Content-type': 'application/json'
                }
            }).then(res => {
                console.log(res);
                this.getAllBookings();
                alert("¡Reserva guardada con éxito!")
            }).catch(err => {
                console.log(err);
            })
        },
        deleteBooking(id)
        {
            console.log(id);
            axios.delete(`http://localhost:3000/booking/${id}`)
                .then((resData) => {
                    console.log(resData.data);
                    this.getAllBookings();
                    alert(`¡Se notifica que la reserva con el id(${id}) ha sido eliminada con éxito!`);
                }).catch(err => {
                    console.log(err);
                });
        }
    }
}
</script>