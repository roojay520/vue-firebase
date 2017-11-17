<style lang="scss" scoped>
@import "hello";
</style>
<template>
    <div class="hello">
        <div class="drop-menu">
            <button class="btn" type="button" @click="openList">
                <span class="text">选择地址</span>
                <span class="icon"></span>
            </button>
            <div class="card">
                <ul id="prov" class="list" v-show="openProv">
                    <li v-for="(prov, index) of provList" :key="prov.index" @click="clickProv($event, index)">
                        {{ prov.name }}
                    </li>
                </ul>
                <ul id="city" class="list" v-show="openCity">
                    <li v-for="(city, index) of cityList" :key="city.index" @click="clickCity($event, index)">
                        {{ city.name}}
                    </li>
                </ul>
                <ul id="country" class="list" v-show="openCountry">
                    <li v-for="(country, index) of countryList" :key="country.index" @click="clickCountry($event, index)">
                        {{ country.name}}
                    </li>
                </ul>
                <ul id="street" class="list" v-show="openStreet">
                    <li v-for="(street, index) of streetList" :key="street.index" @click="clickStreet($event, index)">
                        {{ street.name}}
                    </li>
                </ul>
            </div>
            <span class="address">你选择的地址是: {{address}}</span>
        </div>
    </div>
</template>

<script>
import Firebase from 'firebase';

const config = {
    apiKey: 'AIzaSyBSHeqABc_pmcXwBgP4GhIvO3DH9eJtZlo',
    authDomain: 'roojay123.firebaseapp.com',
    databaseURL: 'https://roojay123.firebaseio.com',
    projectId: 'roojay123',
    storageBucket: 'roojay123.appspot.com',
    messagingSenderId: '691637156012'
};
// 注册 app
Firebase.initializeApp(config);
// 获取数据库引用
const db = Firebase.database();
const log = e => console.log(e);

export default {
    name: 'hello',
    data() {
        return {
            msg: 'Welcome come to demos.',
            author: '@Roojay',
            address: '',
            prov: '',
            city: '',
            country: '',
            street: '',
            provList: '',
            cityList: '',
            countryList: '',
            streetList: '',
            openProv: false,
            openCity: false,
            openCountry: false,
            openStreet: false
        };
    },
    firebase: {
        provList: db.ref('/')
    },

    methods: {
        openList() {
            this.openProv = !this.openProv;
            this.openCity = false;
            this.openCountry = false;
            this.openStreet = false;
        },
        // clickUl(e) {
        //     this.address = e.target.innerText;
        // },
        clickProv(e, index) {
            // let event = e.currentTarget;
            // event.style += 'background-color: green';
            // log(event);
            this.prov = e.target.innerText;
            this.address = this.prov;
            this.openCity = true;
            this.openCountry = false;
            this.openStreet = false;
            this.cityList = this.provList[index].childs;
        },
        clickCity(e, index) {
            this.city = e.target.innerText;
            this.address = this.prov + this.city;
            this.openCountry = true;
            this.openStreet = false;
            this.countryList = this.cityList[index].childs;
        },
        clickCountry(e, index) {
            this.country = e.target.innerText;
            this.address = this.prov + this.city + this.country;
            this.openStreet = true;
            this.streetList = this.countryList[index].childs;
        },
        clickStreet(e, index) {
            this.street = e.target.innerText;
            this.address = this.prov + this.city + this.country + this.street;
            // this.openProv = false;
            // this.openCity = false;
            // this.openCountry = false;
            // this.openStreet = false;
        }
    }
};
</script>

