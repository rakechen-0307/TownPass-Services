<script setup lang="ts">
import FindPlace, { type Place } from '@/components/molecules/FindPlace.vue';
import SpotList from '@/components/organisms/SpotListView.vue';
import SpotDetail from '@/components/organisms/SpotDetailView.vue';
import MessageModal from '@/components/molecules/MessageModal.vue';
import { useGoogleMapsStore } from '@/stores/googleMaps';
import axios from 'axios';
import { onMounted, ref, watch, computed } from 'vue';
import { MarkerClusterer, SuperClusterAlgorithm } from '@googlemaps/markerclusterer';
import greenDotIconUrl from '/public/images/map/youbike/mappin-green.svg';
import defaultFocusIconUrl from '/public/images/map/icon_mappin-garbagetruck-green-pressed.svg';
import { mappingFormatter, getNestedValue } from '@/utils/spot-formatter';
import tourSiteJson from '../../public/mock/tour_site.json';
import BaseInput from '@/components/atoms/BaseInput.vue';
import BaseButton from '@/components/atoms/BaseButton.vue';

interface TourSite {
  id: number;
  cn_name: string;
  en_name: string;
  rate: number;
  category: string[];
  district: string;
  website: string;
  longitude: number;
  latitude: number;
}

const googleMapsStore = useGoogleMapsStore();

const allTourSiteList = ref<TourSite[]>([]);

let isMapReady = ref(false);

let map: any = null;
/** 使用者定位 */
let marker: any = null;
let markers: google.maps.Marker[] = [];
let markerCluster: any = null;

/** 是否展開找地點面板 */
const isExpand = ref(false);
/** 是否點選展開列表 */
const isExpandList = ref(false);
/** 是否點選展開明細 */
const isExpandDetail = ref(false);
const isFrom = ref<'spot' | 'list' | ''>('');

/**
 * 目前位置
 */
const currentLocation = ref<{ lat: number; lng: number; results: any[] }>({
  // 預設經緯度在信義區附近
  lat: 25.0325917,
  lng: 121.5624999,
  results: []
});

/**
 * 是否顯示未開啟取用位置權限通知
 */
let isShowGeoError = ref(false);

const districtList: string[] = ["北投區", "士林區", "內湖區", "松山區", "中山區", "大同區", 
                                "南港區", "信義區", "大安區", "中正區", "萬華區", "文山區"]
const categoryList: string[] = ["養生溫泉", "單車遊蹤", "歷史建築", "宗教信仰", "藝文館所",
                                "公共藝術", "戶外踏青", "藍色水路", "親子共遊", "夜市商圈",
                                "主題商街", "無障礙"]
const selectedDistricts = ref<string[]>([]);
const selectedCategories = ref<string[]>([]);

onMounted(() => {
  initMap(currentLocation.value.lat, currentLocation.value.lng);
  initData(tourSiteJson);
  searchSpotList.value = allTourSiteList.value;
});

const setMapHeight = () => {
  const mapElement = document.getElementById('map');
  if (mapElement) {
    mapElement.style.height = `${window.innerHeight - 88}px`;
  }
};

const initData = (data: any) => {
  allTourSiteList.value = [];
  data.map((item) => {
    const tourSite: TourSite = {
      id: item.id,
      cn_name: item.cn_name,
      en_name: item.en_name,
      rate: item.rate,
      category: item.category,
      district: item.district,
      website: item.website,
      longitude: item.longitude,
      latitude: item.latitude
    };
    allTourSiteList.value.push(tourSite);
  });
  console.log(allTourSiteList.value);
}

/** 搜尋結果 */
const searchSpotList = ref<TourSite[]>([]);
/** 視窗下搜尋結果 */
const filteredSpotList = ref<TourSite[]>([]);
const selectedSpot = ref<TourSite | null>(null);

/**
 * 初始化地圖
 * @param lat 緯度
 * @param lng 經度
 */
const initMap = (lat: number, lng: number) => {
  googleMapsStore.loader.load().then(async () => {
    const { Map } = (await google.maps.importLibrary('maps')) as google.maps.MapsLibrary;

    map = new Map(document.getElementById('map') as HTMLElement, {
      // 設定地圖的中心點經緯度位置
      center: { lat, lng },
      // 設定地圖縮放比例 0-20
      zoom: 13,
      // 限制使用者能縮放地圖的最大比例
      maxZoom: 20,
      // 限制使用者能縮放地圖的最小比例
      minZoom: 3,
      // 設定是否呈現右下角街景小人
      streetViewControl: false,
      // 設定是否讓使用者可以切換地圖樣式：一般、衛星圖等
      mapTypeControl: false,
      fullscreenControl: false,
      zoomControl: false,
      // 替換成您的 MAP ID
      mapId: ''
    });

    // init marker
    marker = new google.maps.Marker({
      position: {
        lat,
        lng
      },
      map,
      title: 'your location',
      icon: {
        path: google.maps.SymbolPath.CIRCLE,
        fillColor: '#4285F4',
        fillOpacity: 1,
        scale: 8, // 控制大小
        strokeColor: 'white',
        strokeWeight: 2
      }
    });

    // get current location
    getPositionClick();

    // 在地圖的dragend事件上使用該函數
    map.addListener('dragend', function () {
      updateMarkers();
    });

    // // 在地圖的zoom_changed事件上使用該函數
    map.addListener('zoom_changed', function () {
      updateMarkers();
    });

    isMapReady.value = true;
    setMapHeight();
    window.addEventListener('resize', setMapHeight);
  });
};

const getPositionClick = () => {
  googleMapsStore
    .gettingPosition()!!
    .then((position: any) => successCallback(position))
    .catch((error) => errorCallback(error));
};

const successCallback = (position: GeolocationPosition) => {
  currentLocation.value.lat = position.coords.latitude;
  currentLocation.value.lng = position.coords.longitude;

  // 使用者目前位置
  marker.setPosition(new google.maps.LatLng(position.coords.latitude, position.coords.longitude));
  map.setCenter(marker.getPosition()!);
};
const errorCallback = (error: any) => {
  console.log(error);
  if (error.code === 1) {
    // 使用者未開啟定位
    isShowGeoError.value = true;
  }
};

const updateMarkers = async () => {
  const bounds = map.getBounds();
  if (!bounds) return;

  filteredSpotList.value = searchSpotList.value
    .map((spot) => ({
      ...spot,
      position: new google.maps.LatLng(spot.latitude, spot.longitude)
    }))
    .filter((spot) => bounds.contains(spot.position))
    .map((spot) => ({
      ...spot,
      distance: parseFloat(
        (
          google.maps.geometry.spherical.computeDistanceBetween(
            new google.maps.LatLng(currentLocation.value.lat, currentLocation.value.lng),
            new google.maps.LatLng(spot.latitude, spot.longitude)
          ) / 1000
        ).toFixed(1)
      )
    }));

  console.log('filteredSpotList:', filteredSpotList.value);

  // Clear existing markers
  clearMarkers();

  let currentFocusedMarker: any = null;

  filteredSpotList.value.forEach((spot) => {
    const greenDotIcon = {
      url: greenDotIconUrl, // 預設綠色小圓點圖標的路徑
      scaledSize: new google.maps.Size(20, 20), // 設置圖標的大小
      anchor: new google.maps.Point(10, 20) // 設置圖標的錨點，使其中心對齊底部
    };

    const marker = new google.maps.Marker({
      position: { lat: Number(spot.latitude), lng: Number(spot.longitude) },
      map,
      icon: greenDotIcon
    });

    marker.addListener('click', () => {
      if (currentFocusedMarker && currentFocusedMarker !== marker) {
        // 恢復之前聚焦的標記為預設圖標
        currentFocusedMarker.setIcon(greenDotIcon);
        selectedSpot.value = null;
      }

      const focusedIcon = {
        url: defaultFocusIconUrl, // 點擊後聚焦圖標的路徑
        scaledSize: new google.maps.Size(48, 69), // 設置圖標的大小
        anchor: new google.maps.Point(24, 69) // 設置圖標的錨點，使其中心對齊底部
      };

      // 設置當前標記為聚焦圖標
      marker.setIcon(focusedIcon);
      currentFocusedMarker = marker;

      // 獲取所選擇的 spot 的所有屬性
      selectedSpot.value = spot;
      console.log('Selected spot:', selectedSpot);
    });

    markers.push(marker);
  });

  // Add a marker clusterer to manage the markers.
  markerCluster = new MarkerClusterer({
    markers,
    map,
    algorithm: new SuperClusterAlgorithm({ radius: 300 }), // 设置gridSize
    renderer: {
      render({ count, position }, stats) {
        // change color if this cluster has more markers than the mean cluster
        const circleRadius =
          count > Math.max(10, stats.clusters.markers.mean)
            ? count > Math.max(100, stats.clusters.markers.mean)
              ? '100'
              : '90'
            : '80';
        // create svg literal with fill color
        const svg =
          window.btoa(`<svg fill="#2eb6c7" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 240 240" width="50" height="50">
          <circle fill="#2eb6c7" cx="120" cy="120" opacity=".6" r="${circleRadius}" />
          <circle fill="#fff" cx="120" cy="120" r="70" />
          <text x="50%" y="50%" style="fill:#2eb6c7" text-anchor="middle" font-size="50" dominant-baseline="middle" font-family="roboto,arial,sans-serif">${count}</text>
          </svg>`);

        // create marker using svg icon
        return new google.maps.Marker({
          position,
          icon: {
            url: `data:image/svg+xml;base64,${svg}`,
            scaledSize: new google.maps.Size(75, 75)
          },
          // adjust zIndex to be above other markers
          zIndex: Number(google.maps.Marker.MAX_ZINDEX) + count
        });
      }
    }
  });
};

const clearMarkers = () => {
  markers.forEach((marker) => marker.setMap(null));
  markers = [];
  if (markerCluster) {
    markerCluster.clearMarkers();
  }
  selectedSpot.value = null;
};

const filteredTourSiteList = computed(() => {
  return allTourSiteList.value.filter((site) => {
    const districtMatches =
      selectedDistricts.value.length > 0
        ? selectedDistricts.value.includes(site.district)
        : true;

    const categoryMatches =
      selectedCategories.value.length > 0
        ? site.category.some((cat) => selectedCategories.value.includes(cat))
        : true;

    return districtMatches && categoryMatches;
  });
});

watch([selectedDistricts, selectedCategories], () => {
  searchSpotList.value = filteredTourSiteList.value;
  updateMarkers();
});

// Watch for changes in searchSpotList
// watch(searchSpotList, updateMarkers);

const filter = ref("none");
const toggleFilter = (mode) => {
  filter.value = filter.value === mode ? 'none' : mode;
}
const isSelectedDistrict = (item) => {
  return selectedDistricts.value.length > 0
    ? selectedDistricts.value.includes(item)
    : true;
}
const isSelectedCategory = (item) => {
  return selectedCategories.value.length > 0
    ? selectedCategories.value.includes(item)
    : true;
}
const shouldBeShown = (item: String, list: String[]) => {
  return list.includes(item) ? "chosen" : "notchosen"
}
const toggleDistrict = (item) => {
  selectedDistricts.value.includes(item)
    ? selectedDistricts.value = selectedDistricts.value.filter(d => d !== item)
    : selectedDistricts.value = [...selectedDistricts.value, item];
}
const toggleCategory = (item) => {
  selectedCategories.value.includes(item)
    ? selectedCategories.value = selectedCategories.value.filter(d => d !== item)
    : selectedCategories.value = [...selectedCategories.value, item];
}
</script> 

<template>
  <div class="pb-8 h-screen">
    <div class="header" :class="{ hidden: isExpandList || isExpandDetail, visible: !isExpandList && !isExpandDetail }">
      <div class="header flex flex-row" style="justify-content: center;">
        <div class="header flex flex-row m-3" style="width: 100%; justify-content: space-evenly;">
          <BaseButton @click="toggleFilter('district')" class="filters">
            地點
          </BaseButton>
          <BaseButton @click="toggleFilter('category')" class="filters">
            分類
          </BaseButton>
        </div>
        <!-- District Filter -->
      </div>
      <div class="flex flex-col bg" style="justify-content: center;">
        <transition name="slide">
          <div v-if="filter === 'district'" class="mt-2 mb-2">
            <div class="flex wrapper">
              <div v-for="district in districtList" :key="district" class="flex items-center space-x-2">
                <button
                  :class="shouldBeShown(district, selectedDistricts)"
                  @click="toggleDistrict(district)"
                    class="py-1 px-3 rounded smallFilter"
                >
                  {{ district }}
                </button>
              </div>
            </div>
          </div>
        </transition>
        <!-- Category Filter -->
        <transition name="slide">
          <div v-if="filter === 'category'" class="mt-2 mb-2">
            <div class="flex wrapper">
              <div v-for="category in categoryList" :key="category" class="flex items-center space-x-2">
                <button
                    :class="shouldBeShown(category, selectedCategories)"
                  @click="toggleCategory(category)"
                  class="py-1 px-3 rounded smallFilter"
                >
                  {{ category }}
                </button>
              </div>
            </div>
          </div>
        </transition>
        <!-- <label>Filter by District:</label>
        <div class="flex flex-wrap gap-4">
          <div v-for="district in districtList" :key="district" class="flex items-center space-x-2">
            <input type="checkbox" :value="district" v-model="selectedDistricts" />
            <label>{{ district }}</label>
          </div>
        </div>
        <div>
          <label>Filter by Category:</label>
          <div class="flex flex-wrap gap-4">
            <div v-for="category in cag-grtegoryList" :key="category" class="flex items-center space-x-2">
              <input type="checkbox" :value="category" v-model="selectedCategories" />
              <label>{{ category }}</label>
            </div>
          </div>
        </div> -->
      </div>  
      <!-- 地圖 -->
      <div class="relative flex-1" :class="{ hidden: isExpand, visible: !isExpand }">
        <div class="google-map" id="map"></div>
        <div v-if="isMapReady" class="gps" @click="getPositionClick">
          <img src="@/assets/images/gps.png" width="20" alt="" />
        </div>
      </div>
      <!-- 選取的點 -->
      <div
        v-if="!isExpand && selectedSpot"
        class="floating-box bottom-24 left-[50%] translate-x-[-50%] w-[90%]"
        @click="
          isExpandDetail = true;
        isFrom = 'spot';
        "
      >
        <div>
          <div class="flex mb-2">
            <p class="font-bold mb-2">{{ selectedSpot.cn_name }}</p>
            <p class="font-medium mb-2">{{ selectedSpot.en_name }}</p>
          </div>
          <!-- custom template -->
          <div class="flex text-white r-7">
            <div v-for="cat in selectedSpot.category"  style="border-radius: 100rem;" :key="cat" class="mr-4 bg-primary-500 p-2">
              {{ cat }}
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>

  <!-- geo modal -->
  <MessageModal :is-show="isShowGeoError">
    <template #header>
      <p>請啟用定位服務</p>
    </template>
    <template #body>
      <p class="text-grey-700">打開定位服務來允許“台北通”確認您的位置</p>
    </template>
    <template #footer>
      <button class="text-primary-500 px-7 py-2 w-full" @click="isShowGeoError = false">
        確認
      </button>
    </template>
  </MessageModal>
</template>

<style lang="postcss" scoped>
.google-map {
  width: 100%;
  height: 400px;
}

.marker {
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  width: 60px;
}

.gps {
  position: absolute;
  right: 10px;
  top: 10px;
  background-color: rgb(255, 255, 255);
  width: 40px;
  height: 40px;
  user-select: none;
  box-shadow: rgba(0, 0, 0, 0.3) 0px 1px 4px -1px;
  border-radius: 20px;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
}

.floating-box {
  @apply absolute flex items-center justify-between bg-white px-4 py-6 rounded-xl;
  box-shadow: rgba(0, 0, 0, 0.04) 0px -4px 10px;
}

.header{
  background-color: #50B0C0;
}
.filters{
  border-radius: 10rem;
  width: 120px;
  font-weight: bold;
  font-size: 1.5rem;
  padding-top: 10px;
  background-color: white;
  color: #50B0C0;
}
.bg{
  background-color: white;
}
.wrapper{
  flex-wrap: wrap;
  justify-content: center;
  align-items: center;
}
.chosen{
  background-color: #F0C87C;
  color: white;
}
.notchosen{
  background-color: white;
  color: grey;
}
.smallFilter{
  border-radius: 10rem;
  width: 90px;
  margin: 6px;
  margin-left: 10px;
  margin-right: 10px;
}
.slide-fade-enter-active {
  transition: all 0.3s ease-out;
}
.slide-fade-leave-active {
  transition: all 0.3s cubic-bezier(1, 0.5, 0.8, 1);
}
.slide-fade-enter-from,
.slide-fade-leave-to {
  transform: translateY(-20px);
  opacity: 0;
}
</style>
