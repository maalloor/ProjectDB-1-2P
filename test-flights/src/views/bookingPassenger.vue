<template>
    <div class="p-4 mt-4">
        <table class="table display" id="tabla_register">
            <thead class="thread-table" style="text-align: center; ">
                <tr>
                <th>ID Reserva</th>
                <th>ID Vuelo</th>
                <th>ID Pasajero</th>
                <th>Nombre del pasajero</th>
                <th>Acciones</th>
                </tr>
            </thead>
            <tbody>
                <tr v-for="register in data" :key="register.booking_id" style="text-align: center; ">
                    <td>{{register.booking_id}}</td>
                    <td>{{register.flight_id}}</td>
                    <td>{{register.pass_id}}</td>
                    <td>{{register.pass_name}}</td>
                    <td>
                        <button type="button" class="editbtn btn btn-primary" v-on:click="getRegisterId(register.pass_id)"
                        data-bs-toggle="modal" data-bs-target="#modalRegister"><i class="fas fa-info-circle"></i></button>
                    </td>
                </tr>
            </tbody>
        </table>
        <!-- Scrollable modal -->
        <!-- Modal -->
        <div class="modal fade" id="modalRegister" tabindex="-1" aria-labelledby="exampleModalLabel" aria-hidden="true">
        <div class="modal-dialog modal-dialog-scrollable">
            <div class="modal-content">
            <div class="modal-header">
                <h5 class="modal-title" id="exampleModalLabel">Modal title</h5>
                <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
            </div>
            <div class="modal-body">
                <div class="card mb-2" v-for="reg in registers" :key="reg.pass_id">
                    <div class="card-body">
                        <h5 class="card-title">Fecha de reservación: </h5>
                        <p class="card-text">{{reg.book_date}}</p>
                        <h5 class="card-title">Fecha de vuelo: </h5>
                        <p class="card-text">{{reg.flight_date}}</p>
                        <h5 class="card-title">Asiento: </h5>
                        <p class="card-text">{{reg.flight_seat}}</p>
                    </div>
                </div>
            </div>
            <div class="modal-footer">
                <button type="button" class="btn btn-secondary" data-bs-dismiss="modal">Close</button>
                <button type="button" class="btn btn-primary">Save changes</button>
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
        this.getAllRegisters();
    },
    data ()
    {
        return {
            data: [],
            registers: [],
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
        getAllRegisters()
        {
            axios.get(`http://localhost:3000/bookingpassenger/`)
                .then((response) => {
                this.data = response.data;
                this.tabla();
                console.log(response);
                });
            },
        getRegisterId(id)
        {
            console.log(id);
            axios.get(`http://localhost:3000/bookingpassenger/${id}`)
                .then(res => {
                    this.registers = res.data;
                    console.log(this.registers);
                }).catch(err => {
                    console.log(err);
                });
        },
    }
}
</script>