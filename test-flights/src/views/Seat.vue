<template>
    <div class="p-4 mt-4">
        <button type="button" class="addbtn btn mb-4"
        data-bs-toggle="modal" data-bs-target="#exampleModalAdd"><i class="fas fa-plus-circle"></i> Añadir nuevo asiento</button>
        <table class="table display" id="tabla_register">
            <thead class="thread-table" style="text-align: center; ">
                <tr>
                    <th>ID Asiento</th>
                    <th>ID Vuelo</th>
                    <th>Número de asiento</th>
                    <th>Costo</th>
                    <th>Acciones</th>
                </tr>
            </thead>
            <tbody>
                <tr v-for="seat in seats" :key="seat.seatid" style="text-align: center; ">
                    <td>{{seat.seatid}}</td>
                    <td>{{seat.flightid}}</td>
                    <td>{{seat.seatnumber}}</td>
                    <td>{{seat.seatcost}}</td>
                    <td>
                        <button type="button" class="editbtn btn btn-warning" v-on:click="getSeatId(seat.seatid)"
                        data-bs-toggle="modal" data-bs-target="#exampleModalEdit"><i class="fas fa-pencil-alt"></i></button>
                        <button type="button" v-on:click="deleteSeat(seat.seatid)" class="btn btn-danger"><i class="fas fa-trash-alt"></i></button>
                    </td>
                </tr>
            </tbody>
        </table>
        <!-- MODAL ADD SEAT -->
        <div class="modal fade" id="exampleModalAdd" tabindex="-1" aria-labelledby="exampleModalLabel" aria-hidden="true">
            <div class="modal-dialog">
                <div class="modal-content">
                    <div class="modal-header">
                        <h5 class="modal-title" id="exampleModalLabel">Añadir nuevo asiento</h5>
                        <button type="button" class="xbtn btn" data-bs-dismiss="modal" aria-label="Close">X</button>
                    </div>
                    <div class="modal-body">
                        <form v-on:submit.prevent="addSeat" method="post" class="row register g-3">
                            <div class="col-12">
                                <label for="inputId" class="form-label">ID Asiento: </label>
                                <input type="text" class="form-control" name="inputId" id="form-field" v-model="form.seatid">
                            </div>
                            <div class="col-12">
                                <label for="inputName" class="form-label">ID Vuelo: </label>
                                <input type="text" class="form-control" name="inputName" id="form-field" v-model="form.flightid">
                            </div>
                            <div class="col-12">
                                <label for="inputEmail" class="form-label">Número de asiento: </label>
                                <input type="text" class="form-control" name="inputEmail" id="form-field" v-model="form.seatnumber">
                            </div>
                            <div class="col-12">
                                <label for="inputDob" class="form-label">Costo de asiento: </label>
                                <input type="number" step="any" class="form-control" name="inputDob" id="form-field" v-model="form.seatcost">
                            </div>
                            <div class="col-12">
                                <button type="submit" class="savebtn btn">Añadir asiento</button>
                                <button type="button" class="btn btn-danger" data-bs-dismiss="modal">Cancelar</button>
                            </div>
                        </form>
                    </div>
                </div>
            </div>
        </div>
        <!-- MODAL EDIT SEAT -->
        <div class="modal fade" id="exampleModalEdit" tabindex="-1" aria-labelledby="exampleModalLabel" aria-hidden="true">
            <div class="modal-dialog">
                <div class="modal-content">
                    <div class="modal-header">
                        <h5 class="modal-title" id="exampleModalLabel">Editar asiento: {{seat.seatid}}</h5>
                        <button type="button" class="xbtn btn" data-bs-dismiss="modal" aria-label="Close">X</button>
                    </div>
                    <div class="modal-body">
                        <form v-on:submit.prevent="editSeat(seat.seatid)" method="post" class="row register g-3">
                            <div class="col-12">
                                <label for="inputId" class="form-label">ID Asiento: </label>
                                <input type="text" class="form-control" name="inputId" id="form-field" v-model="seat.seatid" disabled>
                            </div>
                            <div class="col-12">
                                <label for="inputName" class="form-label">ID Vuelo: </label>
                                <input type="text" class="form-control" name="inputName" id="form-field" v-model="seat.flightid" disabled>
                            </div>
                            <div class="col-12">
                                <label for="inputEmail" class="form-label">Número de asiento: </label>
                                <input type="text" class="form-control" name="inputEmail" id="form-field" v-model="seat.seatnumber" disabled>
                            </div>
                            <div class="col-12">
                                <label for="inputDob" class="form-label">Costo de asiento: </label>
                                <input type="number" step="any" class="form-control" name="inputDob" id="form-field" v-model="seat.seatcost">
                            </div>
                            <div class="col-12">
                                <button type="submit" class="savebtn btn">Editar asiento</button>
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
        this.getAllSeats();
    },
    data ()
    {
        return {
            form: {
                seatid: '',
                flightid: '',
                seatnumber: '',
                seatcost: '',
            },
            seats: [],
            seat: {}
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
        getAllSeats()
        {
        axios.get(`http://localhost:3000/seat/`)
            .then((response) => {
            this.seats = response.data;
            this.tabla();
            console.log(response);
            });
        },
        getSeatId(id)
        {
            this.seat = {};
            console.log(id);
            axios.get(`http://localhost:3000/seat/${id}`)
                .then(res => {
                    this.seat = res.data[0];
                    console.log(this.seat);
                }).catch(err => {
                    console.log(err);
                });
        },
        addSeat()
        {
            axios.post(`http://localhost:3000/seat/`, this.form,
            {
                headers:
                {
                    'Content-type': 'application/json'
                }
            }).then(res => {
                console.log(res);
                this.getAllPassengers();
                alert("¡Asiento guardado con éxito!")
            }).catch(err => {
                console.log(err);
            })
        },
        editSeat(id)
        {
            console.log(this.passenger);
            axios.put(`http://localhost:3000/seat/${id}`, this.passenger,
            {
                headers:
                {
                    'Content-type': 'application/json'
                }
            }).then(res => {
                console.log(res.data);
                this.getAllSeats();
                alert(`¡Se notifica que el asiento con el id(${id}) ha sido actualizado con éxito!`);
            }).catch(err => {
                console.log(err);
            })
        },
        deleteSeat(id)
        {
            console.log(id);
            axios.delete(`http://localhost:3000/seat/${id}`)
                .then((resData) => {
                    console.log(resData.data);
                    this.getAllSeats();
                    alert(`¡Se notifica que el asiento con el id(${id}) ha sido eliminado con éxito!`);
                }).catch(err => {
                    console.log(err);
                });
        }
    }
}
</script>