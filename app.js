// Vue.js Application
const { createApp } = Vue;

createApp({
    components: {
        VehicleSelector
    },
    
    data() {
        return {
            vehicles: vehicleData,
            currentVehicleIndex: 2, // Start with vehicle #3
            isPowerOn: false,
            activeTab: 'fleet'
        }
    },
    
    computed: {
        currentVehicle() {
            return this.vehicles[this.currentVehicleIndex] || {};
        }
    },
    
    methods: {
        onVehicleSelected(index) {
            this.currentVehicleIndex = index;
        },
        
        togglePower() {
            this.isPowerOn = !this.isPowerOn;
            console.log('Power toggled:', this.isPowerOn);
        },
        
        setActiveTab(tab) {
            this.activeTab = tab;
            console.log('Active tab:', tab);
        }
    },
    
    mounted() {
        console.log('Heavy Tech AI Vision Dashboard loaded');
        console.log('Current vehicle:', this.currentVehicle);
    }
}).mount('#app'); 