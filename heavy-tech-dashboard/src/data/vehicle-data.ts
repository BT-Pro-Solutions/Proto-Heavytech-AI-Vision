import vehicleImage from '@/assets/vehicle-sample-image.png'

export interface Vehicle {
  id: number
  name: string
  type: string
  image: string
  serialNumber: string
  operatorId: string
  operationalHours: string
  batteryHealth: string
  chargeRate: string
  torqueSplit: string
  driveMode: string
  fuelLevel: string
  engineTemp: string
  hydraulicPressure: string
  efficiency: string
  powerStatus: boolean
  connectionStatus: string
  dataStatus: string
  aiVizStatus: string
  workMode: string
  location: {
    coordinates: string
    address: string
    zone: string
  }
  lastMaintenance: string
  nextMaintenance: string
  alerts: string[]
  attachments: string[]
}

export const vehicleData: Vehicle[] = [
  {
    id: 1,
    name: 'Heavy Tech Skid Loader',
    type: 'Skid Loader',
    image: vehicleImage,
    serialNumber: 'HT-SL-2024-001',
    operatorId: 'OP-12345',
    operationalHours: '1,247 hrs',
    batteryHealth: '94%',
    chargeRate: '45kW, 2.3hrs to full',
    torqueSplit: '65% Battery / 35% ICE',
    driveMode: 'Normal',
    fuelLevel: '78%',
    engineTemp: '185°F',
    hydraulicPressure: '2,850 PSI',
    efficiency: '87%',
    powerStatus: true,
    connectionStatus: 'Connected',
    dataStatus: 'Streaming',
    aiVizStatus: 'Active',
    workMode: 'Material Handling',
    location: {
      coordinates: '40.7128°N, 74.0060°W',
      address: '123 Construction Ave, New York, NY',
      zone: 'Zone A - Primary Work Area'
    },
    lastMaintenance: '2024-06-15',
    nextMaintenance: '2024-07-30',
    alerts: ['Hydraulic fluid low', 'Scheduled maintenance due'],
    attachments: ['Standard Bucket', 'Fork Extensions', 'Grapple']
  },
  {
    id: 2,
    name: 'Heavy Tech Excavator',
    type: 'Excavator',
    image: vehicleImage,
    serialNumber: 'HT-EX-2024-002',
    operatorId: 'OP-23456',
    operationalHours: '2,156 hrs',
    batteryHealth: '91%',
    chargeRate: '55kW, 3.1hrs to full',
    torqueSplit: '70% Battery / 30% ICE',
    driveMode: 'Eco',
    fuelLevel: '82%',
    engineTemp: '192°F',
    hydraulicPressure: '3,200 PSI',
    efficiency: '89%',
    powerStatus: false,
    connectionStatus: 'Connected',
    dataStatus: 'Streaming',
    aiVizStatus: 'Standby',
    workMode: 'Excavation',
    location: {
      coordinates: '40.7589°N, 73.9851°W',
      address: '456 Dig Site Rd, Manhattan, NY',
      zone: 'Zone B - Excavation Area'
    },
    lastMaintenance: '2024-06-20',
    nextMaintenance: '2024-08-05',
    alerts: [],
    attachments: ['Digging Bucket', 'Hydraulic Hammer', 'Thumb Attachment']
  },
  {
    id: 3,
    name: 'Heavy Tech Bulldozer',
    type: 'Bulldozer',
    image: vehicleImage,
    serialNumber: 'HT-BD-2024-003',
    operatorId: 'OP-34567',
    operationalHours: '1,789 hrs',
    batteryHealth: '96%',
    chargeRate: '60kW, 2.8hrs to full',
    torqueSplit: '60% Battery / 40% ICE',
    driveMode: 'Heavy',
    fuelLevel: '65%',
    engineTemp: '198°F',
    hydraulicPressure: '2,950 PSI',
    efficiency: '85%',
    powerStatus: true,
    connectionStatus: 'Connected',
    dataStatus: 'Streaming',
    aiVizStatus: 'Active',
    workMode: 'Grading',
    location: {
      coordinates: '40.7505°N, 73.9934°W',
      address: '789 Grade St, New York, NY',
      zone: 'Zone C - Grading Area'
    },
    lastMaintenance: '2024-06-10',
    nextMaintenance: '2024-07-25',
    alerts: ['Engine temperature warning'],
    attachments: ['Standard Blade', 'Ripper', 'ROPS Canopy']
  },
  {
    id: 4,
    name: 'Heavy Tech Wheel Loader',
    type: 'Wheel Loader',
    image: vehicleImage,
    serialNumber: 'HT-WL-2024-004',
    operatorId: 'OP-45678',
    operationalHours: '987 hrs',
    batteryHealth: '98%',
    chargeRate: '50kW, 2.5hrs to full',
    torqueSplit: '75% Battery / 25% ICE',
    driveMode: 'Boost',
    fuelLevel: '91%',
    engineTemp: '175°F',
    hydraulicPressure: '3,100 PSI',
    efficiency: '92%',
    powerStatus: false,
    connectionStatus: 'Disconnected',
    dataStatus: 'Cached',
    aiVizStatus: 'Offline',
    workMode: 'Loading',
    location: {
      coordinates: '40.7282°N, 73.7949°W',
      address: '321 Load Point Dr, Queens, NY',
      zone: 'Zone D - Loading Bay'
    },
    lastMaintenance: '2024-07-01',
    nextMaintenance: '2024-08-15',
    alerts: ['Connection timeout', 'GPS signal weak'],
    attachments: ['General Purpose Bucket', 'Pallet Forks', 'Snow Plow']
  },
  {
    id: 5,
    name: 'Heavy Tech Compact Excavator',
    type: 'Compact Excavator',
    image: vehicleImage,
    serialNumber: 'HT-CE-2024-005',
    operatorId: 'OP-56789',
    operationalHours: '543 hrs',
    batteryHealth: '99%',
    chargeRate: '35kW, 1.8hrs to full',
    torqueSplit: '80% Battery / 20% ICE',
    driveMode: 'Normal',
    fuelLevel: '88%',
    engineTemp: '168°F',
    hydraulicPressure: '2,750 PSI',
    efficiency: '94%',
    powerStatus: true,
    connectionStatus: 'Connected',
    dataStatus: 'Streaming',
    aiVizStatus: 'Active',
    workMode: 'Precision Work',
    location: {
      coordinates: '40.6892°N, 74.0445°W',
      address: '654 Precision Ln, Brooklyn, NY',
      zone: 'Zone E - Precision Area'
    },
    lastMaintenance: '2024-07-05',
    nextMaintenance: '2024-08-20',
    alerts: [],
    attachments: ['Mini Bucket', 'Auger', 'Hydraulic Breaker']
  }
] 