<template>
  <nav class="navbar navbar-expand-lg">
    <div class="container-fluid">
        <router-link class="navbar-brand principal" to="/"><img class="logo" src="https://cdn-icons-png.flaticon.com/512/201/201623.png"> SISTEMA DE VUELOS</router-link>
        <button class="navbar-toggler" type="button" data-bs-toggle="collapse"
        data-bs-target="#navbarNavAltMarkup" aria-controls="navbarNavAltMarkup"
        aria-expanded="false" aria-label="Toggle navigation">
            <span class="navbar-toggler-icon"></span>
        </button>
        <div class="collapse navbar-collapse" id="navbarNavAltMarkup">
            <div class="navbar-nav">
              <router-link class="nav-link" to="/"><i class="icono fab fa-avianex"></i>Vuelos</router-link>
              <router-link class="nav-link" to="/passenger"><i class="icono fas fa-user"></i> Pasajeros</router-link>
              <router-link class="nav-link" to="/about"><i class="icono fas fa-location-arrow"></i> Reservas de vuelos</router-link>
              <router-link class="nav-link" to="/seat"><i class="icono fas fa-chair"></i> Asientos</router-link>
              <router-link class="nav-link" to="/bookingpassenger"><i class="icono fas fa-receipt"></i> Reservas de pasajeros</router-link>
            </div>
        </div>
    </div>
  </nav>
  <router-view/>
</template>
