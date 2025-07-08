// VehicleSelector.js - Vue Component
const VehicleSelector = {
    template: `
        <div class="vehicle-slider">
            <div class="vehicle-list" ref="vehicleList" @scroll="updateVehicleEffects">
                <div 
                    v-for="(vehicle, index) in vehicles" 
                    :key="vehicle.id"
                    class="vehicle-item"
                    :ref="el => vehicleElements[index] = el"
                    @click="selectVehicle(index)"
                >
                    <img :src="vehicle.image" :alt="vehicle.name">
                </div>
            </div>
        </div>
    `,
    
    props: {
        vehicles: {
            type: Array,
            required: true
        },
        currentVehicleIndex: {
            type: Number,
            default: 0
        }
    },
    
    data() {
        return {
            vehicleElements: []
        }
    },
    
    mounted() {
        this.setupKeyboardListeners();
        this.$nextTick(() => {
            this.updateVehicleEffects();
            this.centerCurrentVehicle();
        });
    },
    
    watch: {
        currentVehicleIndex() {
            this.$nextTick(() => {
                this.centerCurrentVehicle();
                this.updateVehicleEffects();
            });
        }
    },
    
    methods: {
        selectVehicle(index) {
            this.$emit('vehicle-selected', index);
        },
        
        centerCurrentVehicle() {
            const vehicleList = this.$refs.vehicleList;
            const currentVehicle = this.vehicleElements[this.currentVehicleIndex];
            
            if (currentVehicle && vehicleList) {
                const listHeight = vehicleList.clientHeight;
                const vehicleHeight = currentVehicle.offsetHeight + 30;
                const vehicleTop = currentVehicle.offsetTop;
                const centerPosition = vehicleTop - (listHeight / 2) + (vehicleHeight / 2);
                
                vehicleList.scrollTo({
                    top: centerPosition,
                    behavior: 'smooth'
                });
            }
        },
        
        updateVehicleEffects() {
            const vehicleList = this.$refs.vehicleList;
            if (!vehicleList) return;
            
            const listRect = vehicleList.getBoundingClientRect();
            const centerY = listRect.top + listRect.height / 2;

            let closestIndex = 0;
            let closestDistance = Infinity;

            this.vehicleElements.forEach((element, index) => {
                if (!element) return;
                
                const elementRect = element.getBoundingClientRect();
                const elementCenterY = elementRect.top + elementRect.height / 2;
                const distanceFromCenter = Math.abs(elementCenterY - centerY);
                
                if (distanceFromCenter < closestDistance) {
                    closestDistance = distanceFromCenter;
                    closestIndex = index;
                }
                
                const maxDistance = listRect.height / 2;
                const normalizedDistance = Math.min(distanceFromCenter / maxDistance, 1);
                
                const scale = 1.0 - (normalizedDistance * 0.6);
                const opacity = 1.0 - (normalizedDistance * 0.8);
                const blur = normalizedDistance * 8;
                
                element.style.transform = `scale(${scale})`;
                element.style.opacity = opacity;
                element.style.filter = `blur(${blur}px)`;
            });

            if (closestIndex !== this.currentVehicleIndex) {
                this.$emit('vehicle-selected', closestIndex);
            }
        },
        
        setupKeyboardListeners() {
            document.addEventListener('keydown', (e) => {
                if (e.key === 'ArrowUp' && this.currentVehicleIndex > 0) {
                    this.selectVehicle(this.currentVehicleIndex - 1);
                } else if (e.key === 'ArrowDown' && this.currentVehicleIndex < this.vehicles.length - 1) {
                    this.selectVehicle(this.currentVehicleIndex + 1);
                }
            });
        }
    }
}; 