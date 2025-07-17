# Heavy Tech AI Vision Dashboard

A modern Vue.js application for monitoring and controlling heavy construction equipment with AI-powered insights.

## 🚀 Features

- **Vehicle Selection**: Interactive vehicle carousel with scroll-based effects
- **Real-time Monitoring**: Battery status, location tracking, and system diagnostics
- **Power Control**: Toggle equipment power remotely
- **Navigation Tabs**: Fleet management, maintenance scheduling, and AI insights
- **Responsive Design**: Optimized for desktop and mobile devices
- **TypeScript Support**: Fully typed for better development experience

## 🛠️ Technology Stack

- **Vue 3** - Progressive JavaScript framework
- **TypeScript** - Type-safe development
- **Vite** - Fast build tool and development server
- **Composition API** - Modern Vue development patterns
- **CSS3** - Advanced styling with custom properties
- **ESLint** - Code quality and consistency

## 📁 Project Structure

```
heavy-tech-dashboard/
├── src/
│   ├── components/
│   │   └── VehicleSelector.vue    # Vehicle carousel component
│   ├── data/
│   │   └── vehicle-data.ts        # Vehicle data and types
│   ├── assets/
│   │   └── vehicle-sample-image.png
│   ├── App.vue                    # Main dashboard component
│   └── main.ts                    # Application entry point
├── public/                        # Static assets
├── index.html                     # HTML template
└── package.json                   # Dependencies and scripts
```

## 🏃‍♂️ Getting Started

### Prerequisites

- Node.js (v18 or higher)
- npm or yarn

### Installation

1. Clone or navigate to the project:
   ```bash
   cd heavy-tech-dashboard
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Start the development server:
   ```bash
   npm run dev
   ```

4. Open your browser and visit `http://localhost:5173`

### Available Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run preview` - Preview production build
- `npm run lint` - Run ESLint
- `npm run type-check` - Run TypeScript compiler check

## 🎮 Usage

### Vehicle Selection
- **Scroll** through the vehicle list on the left
- **Click** any vehicle to select it
- Use **arrow keys** for keyboard navigation
- Selected vehicle automatically centers in viewport

### Dashboard Controls
- **Power Toggle**: Click the switch in the bottom-left panel
- **Navigation**: Use FLEET/MAINTENANCE/AI INSIGHTS tabs
- **Vehicle Info**: Automatically updates when switching vehicles

### Responsive Behavior
- **Desktop**: Side-by-side layout (30% selector, 70% details)
- **Mobile**: Stacked layout (40% selector, 60% details)

## 🏗️ Component Architecture

### VehicleSelector Component
- **Props**: `vehicles`, `currentVehicleIndex`
- **Events**: `@vehicle-selected`
- **Features**: Scroll effects, keyboard navigation, auto-centering

### App Component (Main Dashboard)
- **State Management**: Vehicle selection, power status, active tab
- **Computed Properties**: Current vehicle details
- **Event Handling**: Vehicle selection, power toggle, tab switching

## 📱 Features in Detail

### Interactive Vehicle Carousel
- Smooth scroll-based scaling and blur effects
- CSS snap scrolling for precise alignment
- Mix-blend-mode for visual enhancement
- Responsive image sizing with max-width constraints

### Information Panels
- **Battery Status**: Health, charge rate, torque split, drive mode
- **Map Location**: GPS coordinates and work zone information
- **Power Control**: Interactive toggle with smooth animations
- **Connection Status**: Wireless, data, and AI visualization status

### Bottom Navigation
- Tab-based navigation system
- Active state indicators with smooth transitions
- Hover effects and accessibility considerations

## 🎨 Styling Architecture

- **CSS Custom Properties**: Consistent color theming
- **Scoped Styles**: Component-level style isolation
- **Global Styles**: Shared typography and layout utilities
- **Responsive Design**: Mobile-first approach with breakpoints
- **Modern CSS**: Flexbox, Grid, and custom properties

## 🔧 Development

### Adding New Vehicles
Update `src/data/vehicle-data.ts`:

```typescript
export const vehicleData: Vehicle[] = [
  // Add new vehicle objects here
  {
    id: 6,
    name: 'New Heavy Tech Vehicle',
    type: 'Custom Type',
    image: vehicleImage,
    // ... other properties
  }
]
```

### Creating New Components
1. Create `.vue` file in `src/components/`
2. Use `<script setup lang="ts">` for TypeScript support
3. Define props and emits with proper typing
4. Add scoped styles with `<style scoped>`

### State Management
Currently using local component state. For larger applications, consider:
- **Pinia** - Vue's official state management
- **Vuex** - Legacy but still supported
- **Composables** - Reusable reactive logic

## 🚀 Production Build

```bash
npm run build
```

Builds the app for production to the `dist` folder. The build is optimized and files are hashed for caching.

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Run tests and linting
5. Submit a pull request

## 📄 License

This project is part of the Heavy Tech AI Vision prototype system.

---

Built with ❤️ using Vue.js and TypeScript
