# Heavy Tech AI Vision Dashboard

A modern, responsive dashboard for monitoring construction vehicles with AI vision capabilities.

## Features

### 🚜 Vehicle Slider
- **Vertical vehicle slider** on the left side
- **Selected vehicle** displayed prominently in the center
- **Fade, blur, and scale effects** for non-selected vehicles
- **Smooth transitions** between vehicle selections

### 📊 Information Panels
- **Battery Status** - Health, charge rate, torque split, drive mode
- **Map Location** - GPS coordinates, address, and operational zone
- **3D Model (AI Vision)** - Real-time AI analysis and status
- **Control Panel** - Power toggle and connection status

### 🔧 Interactive Features
- **Picture-in-picture** mode for expanded views
- **Real-time data updates** (battery, temperature, etc.)
- **Bottom navigation** - Fleet, Maintenance, AI Insights tabs
- **Expandable panels** - Double-click any info card for detailed view
- **Responsive design** - Works on desktop and mobile

### 🤖 AI Vision Integration
- **Live status monitoring** for AI vision systems
- **Efficiency tracking** and performance metrics
- **Work mode detection** and optimization
- **Alert system** for maintenance and issues

## Files Structure

```
├── index.html          # Main HTML structure
├── styles.css          # Modern CSS with glassmorphism effects
├── vehicle-data.js     # JSON data for all vehicles
├── app.js             # Main application logic
├── vehicle-sample-image.png  # Vehicle image asset
└── Backup/            # Your original implementation
```

## Vehicle Data

The dashboard includes data for 5 different construction vehicles:
- Heavy Tech Skid Loader
- Heavy Tech Excavator  
- Heavy Tech Bulldozer
- Heavy Tech Wheel Loader
- Heavy Tech Compact Excavator

Each vehicle has comprehensive data including:
- Battery and power information
- Location and operational details
- AI vision status and efficiency metrics
- Maintenance schedules and alerts
- Attachments and equipment details

## Usage

1. **Select vehicles** by clicking on the thumbnails in the left slider
2. **View information** in the right panels that update automatically
3. **Toggle power** using the On/Off switch
4. **Expand panels** by double-clicking info cards or using the "Picture in picture" button
5. **Navigate tabs** using the bottom navigation (Fleet, Maintenance, AI Insights)

## Technical Features

- **Pure JavaScript** - No external dependencies
- **CSS Grid & Flexbox** - Modern layout techniques
- **Glassmorphism UI** - Beautiful backdrop blur effects
- **Real-time simulation** - Data updates every 3 seconds
- **Responsive design** - Adapts to different screen sizes
- **Smooth animations** - CSS transitions and transforms

## Browser Support

- Chrome 80+
- Firefox 75+
- Safari 13+
- Edge 80+

## Getting Started

Simply open `index.html` in a modern web browser to start using the dashboard.

For local development with a server:
```bash
python -m http.server 8000
# or
npx serve .
```

Then visit `http://localhost:8000` 