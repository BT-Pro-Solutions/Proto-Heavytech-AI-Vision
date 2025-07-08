# Heavy Tech AI Vision Dashboard - Vue.js Version

## Project Structure

```
Proto-Heavytech-AI-Vision/
├── index.html              # Main Vue.js application
├── app.js                  # Vue root component
├── components/
│   └── VehicleSelector.js  # Vehicle selector component
├── styles.css              # Component-organized styles
├── vehicle-data.js         # Vehicle data
└── README-Vue.md           # This file
```

## Vue.js Components

### 1. Root App Component (`app.js`)
- **Data**: `vehicles`, `currentVehicleIndex`, `isPowerOn`, `activeTab`
- **Computed**: `currentVehicle` - Returns the currently selected vehicle
- **Methods**: 
  - `onVehicleSelected()` - Handles vehicle selection events
  - `togglePower()` - Controls power toggle state
  - `setActiveTab()` - Manages navigation tab states

### 2. VehicleSelector Component (`components/VehicleSelector.js`)
- **Props**: `vehicles` (Array), `currentVehicleIndex` (Number)
- **Data**: `vehicleElements` (Array of DOM references)
- **Events**: `@vehicle-selected` - Emits when a vehicle is clicked or scroll-selected
- **Methods**:
  - `selectVehicle()` - Emits vehicle selection event
  - `centerCurrentVehicle()` - Centers the selected vehicle in the viewport
  - `updateVehicleEffects()` - Applies scale/blur/opacity effects based on scroll position
  - `setupKeyboardListeners()` - Handles arrow key navigation

## Key Vue.js Features Used

### 1. **Component Communication**
```javascript
// Parent to Child (Props)
<vehicle-selector :vehicles="vehicles" :current-vehicle-index="currentVehicleIndex">

// Child to Parent (Events)
@vehicle-selected="onVehicleSelected"
```

### 2. **Reactivity**
```javascript
// Computed properties automatically update when dependencies change
computed: {
    currentVehicle() {
        return this.vehicles[this.currentVehicleIndex] || {};
    }
}
```

### 3. **Template Directives**
```html
<!-- Conditional classes -->
:class="{ active: isPowerOn }"

<!-- Event handling -->
@click="togglePower"

<!-- Template interpolation -->
{{ currentVehicle.name }}

<!-- List rendering -->
v-for="(vehicle, index) in vehicles"
```

### 4. **Lifecycle Hooks**
```javascript
mounted() {
    // Component initialization
    this.setupKeyboardListeners();
    this.$nextTick(() => {
        this.updateVehicleEffects();
        this.centerCurrentVehicle();
    });
}
```

### 5. **Watchers**
```javascript
watch: {
    currentVehicleIndex() {
        // React to vehicle index changes
        this.$nextTick(() => {
            this.centerCurrentVehicle();
            this.updateVehicleEffects();
        });
    }
}
```

## Benefits of Vue.js Conversion

1. **Reactive Data Binding**: Vehicle title automatically updates when selection changes
2. **Component Isolation**: Vehicle selector is now a reusable component
3. **Declarative Templates**: HTML is more readable with Vue directives
4. **Event System**: Clean parent-child communication via props/events
5. **Lifecycle Management**: Proper component initialization and cleanup
6. **Better State Management**: All state is centralized and reactive

## Usage

1. Load the page - Vue app initializes with vehicle #3 selected
2. **Vehicle Selection**: Click vehicles or use arrow keys
3. **Power Toggle**: Click the toggle switch in the panel
4. **Navigation**: Click FLEET/MAINTENANCE/AI INSIGHTS tabs
5. **Scroll Effects**: Vehicle images scale/blur based on scroll position

## Future Enhancements

- Convert to Single File Components (.vue files) with build system
- Add TypeScript for type safety
- Implement Vuex/Pinia for state management
- Create additional components (InfoPanel, BottomNav, etc.)
- Add unit testing with Vue Test Utils
- Implement Vue Router for multi-page navigation 