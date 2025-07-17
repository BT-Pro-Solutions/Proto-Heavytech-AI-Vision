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
            activeTab: 'fleet',
            torqueChart: null,
            efficiencyChart: null
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
            this.$nextTick(() => {
                this.updateCharts();
            });
        },
        
        togglePower() {
            this.isPowerOn = !this.isPowerOn;
            console.log('Power toggled:', this.isPowerOn);
        },
        
        setActiveTab(tab) {
            this.activeTab = tab;
            console.log('Active tab:', tab);
            this.$nextTick(() => {
                this.updateCharts();
            });
        },
        
        // Battery Status Classification
        getBatteryStatusClass(batteryHealth) {
            const percentage = parseInt(batteryHealth);
            if (percentage >= 90) return 'good';
            if (percentage >= 70) return 'warning';
            return 'error';
        },
        
        // Connection Status Classes
        getConnectionClass(status) {
            return status.toLowerCase().replace(/\s+/g, '-');
        },
        
        getDataStatusClass(status) {
            return status.toLowerCase().replace(/\s+/g, '-');
        },
        
        getAIStatusClass(status) {
            return status.toLowerCase().replace(/\s+/g, '-');
        },
        
        // Date Formatting
        formatDate(dateString) {
            const date = new Date(dateString);
            return date.toLocaleDateString('en-US', {
                year: 'numeric',
                month: 'short',
                day: 'numeric'
            });
        },
        
        // Maintenance Progress Calculation
        getMaintenanceProgress() {
            const lastMaintenance = new Date(this.currentVehicle.lastMaintenance);
            const nextMaintenance = new Date(this.currentVehicle.nextMaintenance);
            const now = new Date();
            
            const totalDays = (nextMaintenance - lastMaintenance) / (1000 * 60 * 60 * 24);
            const daysPassed = (now - lastMaintenance) / (1000 * 60 * 60 * 24);
            
            return Math.min(Math.max((daysPassed / totalDays) * 100, 0), 100);
        },
        
        // Days Until Maintenance
        getDaysUntilMaintenance() {
            const nextMaintenance = new Date(this.currentVehicle.nextMaintenance);
            const now = new Date();
            const diffTime = nextMaintenance - now;
            const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
            
            return diffDays > 0 ? diffDays : 0;
        },
        
        // Parse Torque Split
        parseTorqueSplit(torqueString) {
            const batteryMatch = torqueString.match(/(\d+)%\s*Battery/);
            const iceMatch = torqueString.match(/(\d+)%\s*ICE/);
            
            return {
                battery: batteryMatch ? parseInt(batteryMatch[1]) : 0,
                ice: iceMatch ? parseInt(iceMatch[1]) : 0
            };
        },
        
        // Create Torque Chart
        createTorqueChart() {
            const canvas = document.getElementById('torqueChart');
            if (!canvas) return;
            
            const ctx = canvas.getContext('2d');
            const torqueData = this.parseTorqueSplit(this.currentVehicle.torqueSplit);
            
            // Destroy existing chart
            if (this.torqueChart) {
                this.torqueChart.destroy();
            }
            
            this.torqueChart = new Chart(ctx, {
                type: 'doughnut',
                data: {
                    labels: ['Battery', 'ICE'],
                    datasets: [{
                        data: [torqueData.battery, torqueData.ice],
                        backgroundColor: [
                            '#3b82f6', // Blue for battery
                            '#f59e0b'  // Amber for ICE
                        ],
                        borderWidth: 0,
                        hoverOffset: 4
                    }]
                },
                options: {
                    responsive: true,
                    maintainAspectRatio: false,
                    plugins: {
                        legend: {
                            display: false
                        },
                        tooltip: {
                            callbacks: {
                                label: function(context) {
                                    return context.label + ': ' + context.parsed + '%';
                                }
                            }
                        }
                    },
                    cutout: '70%'
                }
            });
        },
        
        // Create Efficiency Gauge
        createEfficiencyGauge() {
            const canvas = document.getElementById('efficiencyGauge');
            if (!canvas) return;
            
            const ctx = canvas.getContext('2d');
            const efficiency = parseInt(this.currentVehicle.efficiency);
            
            // Destroy existing chart
            if (this.efficiencyChart) {
                this.efficiencyChart.destroy();
            }
            
            this.efficiencyChart = new Chart(ctx, {
                type: 'doughnut',
                data: {
                    datasets: [{
                        data: [efficiency, 100 - efficiency],
                        backgroundColor: [
                            this.getEfficiencyColor(efficiency),
                            '#f3f4f6'
                        ],
                        borderWidth: 0,
                        circumference: 270,
                        rotation: 225
                    }]
                },
                options: {
                    responsive: true,
                    maintainAspectRatio: false,
                    plugins: {
                        legend: {
                            display: false
                        },
                        tooltip: {
                            enabled: false
                        }
                    },
                    cutout: '80%'
                }
            });
        },
        
        // Get Efficiency Color
        getEfficiencyColor(efficiency) {
            if (efficiency >= 90) return '#10b981'; // Green
            if (efficiency >= 75) return '#f59e0b'; // Amber
            return '#ef4444'; // Red
        },
        
        // Update Charts
        updateCharts() {
            setTimeout(() => {
                if (this.activeTab === 'fleet') {
                    this.createTorqueChart();
                } else if (this.activeTab === 'maintenance') {
                    this.createEfficiencyGauge();
                }
            }, 100);
        },
        
        // Initialize Charts
        initCharts() {
            this.$nextTick(() => {
                this.updateCharts();
            });
        }
    },
    
    watch: {
        activeTab(newTab) {
            this.$nextTick(() => {
                this.updateCharts();
            });
        }
    },
    
    mounted() {
        console.log('Heavy Tech AI Vision Dashboard loaded');
        console.log('Current vehicle:', this.currentVehicle);
        
        // Initialize charts after DOM is ready
        this.initCharts();
        
        // Update charts when window is resized
        window.addEventListener('resize', () => {
            this.updateCharts();
        });
    },
    
    beforeUnmount() {
        // Clean up charts
        if (this.torqueChart) {
            this.torqueChart.destroy();
        }
        if (this.efficiencyChart) {
            this.efficiencyChart.destroy();
        }
        
        // Remove event listeners
        window.removeEventListener('resize', this.updateCharts);
    }
}).mount('#app'); 