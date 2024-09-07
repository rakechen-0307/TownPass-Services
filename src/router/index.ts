import { createRouter, createWebHistory } from 'vue-router';
import HomeView from '../views/HomeView.vue';
import FormView from '../views/FormView.vue';
import SurroundingServiceView from '../views/SurroundingServiceView.vue';
import TopQnAListView from '../views/TopQnAListView.vue';
import QnAListView from '../views/QnAListView.vue';
import CouponView from '../views/CouponView.vue';
import CouponListView from '../views/CouponListView.vue';
import HotSpotView from '../views/HotSpotView.vue';
import TicketDetail from '../views/TicketDetail.vue';
import CouponDetail from '../views/CouponDetail.vue';
import ImageUploadView from '../views/ImageUploadView.vue';
import CityCanvasView from '@/views/CityCanvasView.vue';
import CityCanvasProposalView from '@/views/CityCanvasProposalView.vue';
import CityCanvasDraftView from '@/views/CityCanvasDraftView.vue';
import TourSiteView from '../views/TourSiteView.vue';

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      name: 'home',
      component: HomeView
    },
    {
      path: '/form/:id',
      name: 'form',
      component: FormView
    },
    {
      path: '/surrounding-service',
      name: 'surrounding-service',
      component: SurroundingServiceView
    },
    {
      path: '/qna',
      name: 'top-qna-list',
      component: TopQnAListView
    },
    {
      path: '/qna/categories',
      name: 'qna-list',
      component: QnAListView
    },
    {
      path: '/coupon',
      children: [
        {
          path: '',
          name: 'coupon',
          component: CouponView
        },
        {
          path: 'list',
          name: 'coupon-list',
          component: CouponListView
        },
        {
          path: 'hotspot/:id',
          name: 'hotspot',
          component: HotSpotView
        },
        {
          path: 'ticket-detail/:id',
          name: 'ticket-detail',
          component: TicketDetail
        },
        {
          path: 'coupon-detail/:id',
          name: 'coupon-detail',
          component: CouponDetail
        }
      ]
    },
    {
<<<<<<< HEAD
      path: '/city-canvas',
      children: [
        {
          path: '',
          name: 'city-canvas',
          component: CityCanvasView
        },
        {
          path: 'proposal/:id',
          name: 'proposal',
          component: CityCanvasProposalView
        },
        {
          path: 'draft/:id',
          name: 'draft',
          component: CityCanvasDraftView
        }
      ]
    },
    {
      path: '/upload',
      name: 'upload',
      component: ImageUploadView
    },
    {
=======
>>>>>>> 43b6c53289c88ea1829a36b892b8982321da9cf1
      path: '/tour-site',
      name: 'tour-site',
      component: TourSiteView
    }
  ]
});

export default router;
