<template>
  <div class="vehicle-information">
    <Header>
      <template #title>
        Vehicle Information
      </template>
      <template #subtitle>
        Front End Loader
      </template>
    </Header>
    <CardGrid>
      <!-- 2/3 width card -->
      <Card grid-column="1 / 2" grid-row="1 / 3">
        <img src="/map.png" alt="map" class="map">
        <h3 class="card-title">Location</h3>
        <div class="map-pin-group">
          <Icon icon="tabler:map-pin-filled" />
          <div class="map-pin-address">
            1234 Example Street, New York, NY 10001
          </div>
        </div>
      </Card>

             <Card grid-column="2 / 4" grid-row="1 / 3">
         <div class="battery-chart">
           <div class="battery-header">
             <h3 class="battery-title">BATTERY</h3>
             <div class="battery-legend">
               <div class="legend-item">
                 <div class="legend-dot yellow"></div>
                 <span>Current Charge - 18%</span>
               </div>
               <div class="legend-item">
                 <div class="legend-dot green"></div>
                 <span>Charge Rate - 0kW</span>
               </div>
             </div>
           </div>
           
           <div class="chart-container">
             <svg viewBox="0 0 800 280" preserveAspectRatio="none" class="battery-svg">
               <!-- Grid lines -->
               <defs>
                 <pattern id="grid" width="100" height="50" patternUnits="userSpaceOnUse">
                   <path d="M 100 0 L 0 0 0 50" fill="none" stroke="rgba(255,255,255,0.1)" stroke-width="1"/>
                 </pattern>
                 
                 <!-- Gradients -->
                 <linearGradient id="yellowGradient" x1="0%" y1="0%" x2="0%" y2="100%">
                   <stop offset="0%" style="stop-color:var(--color-secondary);stop-opacity:0.8" />
                   <stop offset="100%" style="stop-color:var(--color-secondary);stop-opacity:0.1" />
                 </linearGradient>
                 
                 <linearGradient id="greenGradient" x1="0%" y1="0%" x2="0%" y2="100%">
                   <stop offset="0%" style="stop-color:var(--color-primary);stop-opacity:0.8" />
                   <stop offset="100%" style="stop-color:var(--color-primary);stop-opacity:0.1" />
                 </linearGradient>
               </defs>
                                <rect width="800" height="280" fill="url(#grid)"/>
               
                                <!-- Yellow area chart -->
                 <path class="area-fill yellow-area" d="M 92,55 C 51,55 46,1 0,1 L 0,280 L 800,280 L 800,218 C 724,218 688,178 637,178 C 586,178 548,150 498,150 C 448,150 444,178 389,178 C 333,178 346,122 288,122 C 230,122 244,21 183,21 C 122,21 132,55 92,55 Z"/>
                 <path class="area-line yellow-line" d="M 0,1 C 46,1 51,55 92,55 C 132,55 122,21 183,21 C 244,21 230,122 288,122 C 346,122 333,178 389,178 C 444,178 448,150 498,150 C 548,150 586,178 637,178 C 688,178 724,218 800,218"/>
                 
                 <!-- Green area chart -->
                 <path class="area-fill green-area" d="M 0,275 C 46,275 51,275 92,275 C 132,275 120,183 181,183 C 242,183 230,5 289,5 C 348,5 333,54 389,54 C 445,54 446,169 496,169 C 546,169 586,275 637,275 C 688,275 724,275 800,275 L 800,280 L 0,280 Z"/>
                 <path class="area-line green-line" d="M 0,275 C 46,275 51,275 92,275 C 132,275 120,183 181,183 C 242,183 230,5 289,5 C 348,5 333,54 389,54 C 445,54 446,169 496,169 C 546,169 586,275 637,275 C 688,275 724,275 800,275"/>
             </svg>
             
             <!-- Time labels -->
             <div class="time-labels">
               <span>7AM</span>
               <span>8AM</span>
               <span>9AM</span>
               <span>10AM</span>
               <span>11AM</span>
               <span>12PM</span>
               <span>1PM</span>
               <span>2PM</span>
             </div>
           </div>
         </div>
       </Card>

      <!-- 1/3 width cards -->
      <Card grid-column="1 / 2" grid-row="3 / 4">
        <h3 class="card-title">Runtime</h3>
        <div class="big-number">
          20 HRS
        </div>
      </Card>
      <Card grid-column="2 / 3" grid-row="3 / 4">
        <h3 class="card-title">Battery</h3>
        <div class="big-number yellow">
          18%
        </div>
      </Card>
      <Card grid-column="3 / 4" grid-row="3 / 4">
        <h3 class="card-title">Battery Health</h3>
        <div class="big-number green">
          80%
        </div>
      </Card>
      

      
      <!-- Full width card -->
      <Card grid-column="1 / 3" grid-row="4 / 5">
        <div class="pwr-split">
          <h3 class="card-title">Power<br>Utilization</h3>
          <div class="pwr-split-graphs">
            <div class="ice">
              <!-- engine icon -->
              <Icon icon="tabler:engine" />
              60%
              <div class="pwr-split-graphs-bar">
                <div class="pwr-split-graphs-bar-fill">
                  <div class="pwr-split-graphs-bar-fill-thumb"></div>
                </div>
              </div>
            </div>
            <div class="electric">
              <!-- electric icon -->
              <Icon icon="tabler:bolt" />
              40%
              <div class="pwr-split-graphs-bar">
                <div class="pwr-split-graphs-bar-fill">
                  <div class="pwr-split-graphs-bar-fill-thumb"></div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </Card>

      <Card grid-column="3 / 3" grid-row="4 / 5">
        <h3 class="card-title">Fuel Usage</h3>
        <div class="big-number red">
          4 GAL/H
        </div>
      </Card>
    </CardGrid>
  </div>
</template>

<script setup>
import Header from './Header.vue';
import CardGrid from './CardGrid.vue'
import Card from './Card.vue'
</script>

<style scoped>
.vehicle-information {
  height: 100%;
  width: 100%;
  overflow: auto;
  padding-right: 2rem;
}
.map {
  width: 100%;
  height: 100%;
  object-fit: cover;
  position: absolute;
  top: 0;
  left: 0;
}
.map-pin-group {
  color: var(--color-secondary);
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  text-align: center;

  svg {
    margin: 0 auto;
    width: 30px;
    height: 30px;
  }
}
 .map-pin-address {
   background: #000;
   color: #fff;
   padding: 5px;
   font-size: 0.8rem;
   margin-top: 10px;
   line-height: 1.1em;
   border-radius: 10px;
 }

 .pwr-split {
   height: 100%;
   display: flex;
   align-items: center;
   gap: 2rem;
   padding: 1rem;
 }


 .pwr-split-graphs {
   flex: 1;
   display: flex;
   flex-direction: column;
 }

 .ice, .electric {
   display: flex;
   align-items: center;
   gap: 1rem;
   font-family: var(--font-heading);
   font-size: 1.5rem;
   font-weight: 600;
 }

 .ice {
   color: var(--color-secondary);
 }

 .electric {
   color: var(--color-primary);
 }

 .ice svg, .electric svg {
   width: 24px;
   height: 24px;
 }

 .pwr-split-graphs-bar {
   flex: 1;
   height: 20px;
   background: #1a1a1a;
   border-radius: 15px;
   position: relative;
 }

 .pwr-split-graphs-bar-fill {
   height: 100%;
   position: relative;
 }

 .ice .pwr-split-graphs-bar-fill {
  border-radius: 15px 0 0 15px;
  background: var(--color-secondary);
  width: 60%;
  animation: ice-pulse 3s ease-in-out infinite alternate;
  box-shadow: 0 0 15px var(--color-secondary-transparent);
 }

 .electric .pwr-split-graphs-bar-fill {
  border-radius: 0 15px 15px 0;
  background: var(--color-primary);
  width: 40%;
  margin-left: auto;
  animation: electric-pulse 3s ease-in-out infinite alternate;
  box-shadow: 0 0 15px var(--color-primary-transparent);
 }

 .pwr-split-graphs-bar-fill-thumb {
    border-radius: 5px;
    position: absolute;
    bottom: -6px;
    width: 5px;
    height: 70px;
    background: linear-gradient(to bottom, var(--color-secondary), var(--color-primary));
 }

 .ice .pwr-split-graphs-bar-fill-thumb {
  display: none;
 }

 @keyframes ice-pulse {
   0% { width: 60%; }
   50% { width: 65%; }
   100% { width: 58%; }
 }

    @keyframes electric-pulse {
     0% { width: 40%; }
     50% { width: 35%; }
     100% { width: 42%; }
   }

   .battery-chart {
     height: 100%;
     position: relative;
     margin: -1.5rem;
     padding: 0;
     top: 3rem;
   }

   .battery-header {
     position: absolute;
     top: -1.5rem;
     left: 1.5rem;
     right: 1.5rem;
     z-index: 10;
     display: flex;
     justify-content: space-between;
     align-items: flex-start;
   }

   .battery-title {
     font-family: var(--font-heading);
     font-size: 1rem;
     letter-spacing: 0.1em;
     color: rgba(255, 255, 255, 0.8);
     margin: 0;
     font-weight: 400;
   }

   .battery-legend {
     display: flex;
     flex-direction: column;
     gap: 0.5rem;
   }

   .legend-item {
     display: flex;
     align-items: center;
     gap: 0.5rem;
     font-family: var(--font-body);
     font-size: 0.9rem;
     color: rgba(255, 255, 255, 0.7);
   }

   .legend-dot {
     width: 12px;
     height: 12px;
     border-radius: 50%;
   }

   .legend-dot.yellow {
     background: var(--color-secondary);
   }

   .legend-dot.green {
     background: var(--color-primary);
   }

   .chart-container {
     position: absolute;
     top: 0;
     left: 0;
     right: 0;
     bottom: 0;
     width: 100%;
     height: 100%;
   }

   .battery-svg {
     width: 100%;
     height: 100%;
   }

   .area-fill {
     opacity: 0.8;
     animation: area-draw 2s ease-out forwards;
   }

   .area-line {
     fill: none;
     stroke-width: 3;
     animation: line-draw 2s ease-out forwards;
   }

   .yellow-area {
     fill: url(#yellowGradient);
   }

   .yellow-line {
     stroke: var(--color-secondary);
   }

   .green-area {
     fill: url(#greenGradient);
   }

   .green-line {
     stroke: var(--color-primary);
   }

   .time-labels {
     position: absolute;
     bottom: 0;
     left: 0;
     right: 0;
     display: flex;
     justify-content: space-between;
     padding: 0.5rem 1rem;
     font-family: var(--font-body);
     font-size: 0.8rem;
     color: rgba(255, 255, 255, 0.6);
     background: linear-gradient(to top, rgba(0,0,0,0.3), transparent);
     z-index: 10;
   }

   @keyframes area-draw {
     0% {
       opacity: 0;
     }
     100% {
       opacity: 0.8;
     }
   }

   @keyframes line-draw {
     0% {
       stroke-dasharray: 1000;
       stroke-dashoffset: 1000;
     }
     100% {
       stroke-dasharray: 1000;
       stroke-dashoffset: 0;
     }
   }
   </style> 