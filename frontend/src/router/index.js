import { createRouter, createWebHistory } from 'vue-router'
import Home from '../views/Home.vue'
import Passenger from '../views/Passenger.vue'
import BookingPassenger from '../views/bookingPassenger'
import Seat from '../views/seat'
const routes = [
  {
    path: '/',
    name: 'Home',
    component: Home
  },
  {
    path: '/about',
    name: 'About',
    component: () => import(/* webpackChunkName: "about" */ '../views/About.vue')
  },
  {
    path: '/passenger',
    name: 'Passenger',
    component: Passenger
  },
  {
    path: '/bookingpassenger',
    name: 'BookingPassenger',
    component: BookingPassenger
  },
  {
    path: '/seat',
    name: 'Seat',
    component: Seat
  }
]

const router = createRouter({
  history: createWebHistory(process.env.BASE_URL),
  routes
})

export default router
