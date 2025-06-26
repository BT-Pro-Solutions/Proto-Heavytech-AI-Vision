// HeavyTech Construction Equipment 3D Viewer
class ConstructionEquipmentViewer {
    constructor() {
        this.scene = null;
        this.camera = null;
        this.renderer = null;
        this.controls = null;
        this.model = null;
        this.mixer = null;
        this.clock = new THREE.Clock();
        
        // Equipment parts
        this.frontPivot = null;
        this.armGroup = null;
        this.bucket = null;
        
        // Video synchronization
        this.video = null;
        this.isVideoSynced = false;
        this.animationStartTime = 0;
        this.currentAnimationTime = 0;
        
        // Synchronized animation keyframes based on video timestamps
        this.keyframes = [
            { time: 0.0, center: 0, arm: 165, bucket: 175, description: "defaults" },
            { time: 5.0, center: 0, arm: 145, bucket: 175, description: "maintain half up" },
            { time: 10.0, center: 15, arm: 145, bucket: 157, description: "turn right" },
            { time: 13.0, center: 0, arm: 145, bucket: 157, description: "center again" },
            { time: 17.0, center: 0, arm: 120, bucket: 200, description: "full up" },
            { time: 22.0, center: 0, arm: 90, bucket: 300, description: "max up, max down bucket" },
            { time: 24.0, center: 0, arm: 90, bucket: 300, description: "max up, max down bucket" },
            { time: 25.0, center: 4, arm: 100, bucket: 200, description: "returning" },
            { time: 28.0, center: -10, arm: 155, bucket: 175, description: "turn left, down" },
            { time: 30.0, center: 0, arm: 175, bucket: 175, description: "back to defaults" }
        ];
        
        this.init();
    }
    
    init() {
        this.setupScene();
        this.setupLighting();
        this.setupCamera();
        this.setupRenderer();
        this.setupControls();
        this.loadModel();
        this.setupVideo();
        this.animate();
    }
    
    setupScene() {
        this.scene = new THREE.Scene();
        // No background color - transparent to show HTML body background
        
        // Add a white ground plane that receives shadows
        const groundGeometry = new THREE.PlaneGeometry(20, 20);
        const groundMaterial = new THREE.ShadowMaterial({ opacity: 0.3 }); // Shadow-only material for clean white ground
        const ground = new THREE.Mesh(groundGeometry, groundMaterial);
        ground.rotation.x = -Math.PI / 2;
        ground.position.y = -1.5; // Moved ground down to match model position
        ground.receiveShadow = true;
        this.scene.add(ground);
    }
    
    setupLighting() {
        // Ambient light (reduced for better shadow contrast on white background)
        const ambientLight = new THREE.AmbientLight(0x404040, 0.4);
        this.scene.add(ambientLight);
        
        // Main directional light (sun) with enhanced shadows
        const directionalLight = new THREE.DirectionalLight(0xffffff, 1.0);
        directionalLight.position.set(10, 15, 10);
        directionalLight.castShadow = true;
        directionalLight.shadow.mapSize.width = 4096;
        directionalLight.shadow.mapSize.height = 4096;
        directionalLight.shadow.camera.near = 0.5;
        directionalLight.shadow.camera.far = 50;
        directionalLight.shadow.camera.left = -15;
        directionalLight.shadow.camera.right = 15;
        directionalLight.shadow.camera.top = 15;
        directionalLight.shadow.camera.bottom = -15;
        directionalLight.shadow.bias = -0.0001;
        this.scene.add(directionalLight);
        
        // Fill lights for even illumination (no shadows)
        const fillLight1 = new THREE.DirectionalLight(0xffffff, 0.3);
        fillLight1.position.set(-10, 8, -10);
        fillLight1.castShadow = false;
        this.scene.add(fillLight1);
        
        const fillLight2 = new THREE.DirectionalLight(0xffffff, 0.2);
        fillLight2.position.set(5, 8, -15);
        fillLight2.castShadow = false;
        this.scene.add(fillLight2);
    }
    
    setupCamera() {
        this.camera = new THREE.PerspectiveCamera(
            75,
            window.innerWidth / window.innerHeight,
            0.1,
            1000
        );
        this.camera.position.set(9, 5, 9); // Backed off further from the model
        this.camera.lookAt(0, 0, 0);
    }
    
    setupRenderer() {
        const canvas = document.getElementById('canvas');
        this.renderer = new THREE.WebGLRenderer({ 
            canvas: canvas, 
            antialias: true, 
            alpha: true,
            powerPreference: "high-performance"
        });
        this.renderer.setSize(window.innerWidth, window.innerHeight);
        this.renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
        this.renderer.shadowMap.enabled = true;
        this.renderer.shadowMap.type = THREE.PCFSoftShadowMap;
        this.renderer.outputEncoding = THREE.sRGBEncoding;
        
        // Reduce banding by using linear tone mapping and lower exposure
        this.renderer.toneMapping = THREE.LinearToneMapping;
        this.renderer.toneMappingExposure = 0.8;
        
        this.renderer.setClearColor(0x000000, 0); // Transparent background
    }
    
    setupControls() {
        this.controls = new THREE.OrbitControls(this.camera, this.renderer.domElement);
        this.controls.enableDamping = true;
        this.controls.dampingFactor = 0.05;
        this.controls.screenSpacePanning = false;
        this.controls.minDistance = 2;
        this.controls.maxDistance = 20;
        this.controls.maxPolarAngle = Math.PI / 2;
    }
    
    setupVideo() {
        this.video = document.getElementById('loader-video');
        const placeholder = document.querySelector('.camera-placeholder');
        
        // Track previous time to detect loop restart
        this.previousVideoTime = 0;
        
        // Set up video event listeners for synchronization
        this.video.addEventListener('loadeddata', () => {
            console.log('Video loaded successfully');
        });
        
        this.video.addEventListener('play', () => {
            console.log('Video started playing - syncing animation');
            this.startSyncedAnimation();
        });
        
        this.video.addEventListener('timeupdate', () => {
            // Detect if video has looped (current time is less than previous time)
            if (this.video.currentTime < this.previousVideoTime && !this.isVideoSynced) {
                console.log('Video looped - restarting animation sync');
                this.startSyncedAnimation();
            }
            this.previousVideoTime = this.video.currentTime;
        });
        
        this.video.addEventListener('seeked', () => {
            // Also catch manual seeks or loop restarts
            if (this.video.currentTime < 1 && !this.isVideoSynced) {
                console.log('Video seeked to beginning - restarting animation sync');
                this.startSyncedAnimation();
            }
        });
        
        this.video.addEventListener('ended', () => {
            console.log('Video ended - waiting for loop restart');
            this.isVideoSynced = false;
        });
        
        this.video.addEventListener('error', () => {
            console.log('Video not found, showing placeholder and starting fallback animation');
            this.video.style.display = 'none';
            placeholder.style.display = 'block';
            // Start animation anyway as fallback
            this.startSyncedAnimation();
        });
        
        // Try to play the video
        this.video.play().catch(e => {
            console.log('Video autoplay prevented:', e.message);
            // Start animation anyway as fallback
            this.startSyncedAnimation();
        });
    }
    
    startSyncedAnimation() {
        this.isVideoSynced = true;
        this.animationStartTime = performance.now();
        console.log('Animation synchronized with video');
    }
    
    loadModel() {
        const loader = new THREE.GLTFLoader();
        
        loader.load(
            'test-machine.glb',
            (gltf) => {
                this.model = gltf.scene;
                
                // Scale and position the model to sit on the ground
                this.model.scale.setScalar(1);
                this.model.position.set(0, -1.5, -5); // Moved down 1.5 units to show top better
                
                // Enable shadows for all mesh children
                this.model.traverse((child) => {
                    if (child.isMesh) {
                        child.castShadow = true;
                        child.receiveShadow = true;
                    }
                });
                
                this.scene.add(this.model);
                
                // Find the pivot points by name
                this.findPivotPoints();
                
                // Hide loading message
                document.getElementById('loading').style.display = 'none';
                
                // Set initial position
                this.setInitialPosition();
                
                console.log('Model loaded successfully');
                this.logModelStructure(this.model);
            },
            (progress) => {
                console.log('Loading progress:', (progress.loaded / progress.total * 100) + '%');
            },
            (error) => {
                console.error('Error loading model:', error);
                document.getElementById('loading').innerHTML = 'ERROR LOADING MODEL<br>CHECK CONSOLE';
            }
        );
    }
    
    setInitialPosition() {
        // Set to first keyframe position
        const initialFrame = this.keyframes[0];
        this.setFrontPivotRotation(initialFrame.center);
        this.setArmGroupRotation(initialFrame.arm);
        this.setBucketRotation(initialFrame.bucket);
        this.updateIndicators(initialFrame.center, initialFrame.arm, initialFrame.bucket);
    }
    
    findPivotPoints() {
        // Find pivot points in the model hierarchy
        this.model.traverse((child) => {
            const name = child.name.toLowerCase();
            
            if (name.includes('front') && name.includes('pivot')) {
                this.frontPivot = child;
                console.log('Found Front Pivot:', child.name);
            } else if (name.includes('arm') && name.includes('group')) {
                this.armGroup = child;
                console.log('Found Arm Group:', child.name);
            } else if (name.includes('bucket')) {
                this.bucket = child;
                console.log('Found Bucket:', child.name);
            }
        });
        
        // If not found by name, try alternative names or create manual references
        if (!this.frontPivot || !this.armGroup || !this.bucket) {
            console.log('Some pivot points not found by name. Searching by alternative names...');
            this.findPivotPointsAlternative();
        }
    }
    
    findPivotPointsAlternative() {
        // Try alternative naming patterns
        this.model.traverse((child) => {
            const name = child.name.toLowerCase();
            
            // More flexible name matching
            if (!this.frontPivot && (name.includes('pivot') || name.includes('base') || name.includes('turret'))) {
                this.frontPivot = child;
                console.log('Found Front Pivot (alternative):', child.name);
            }
            if (!this.armGroup && (name.includes('arm') || name.includes('boom'))) {
                this.armGroup = child;
                console.log('Found Arm Group (alternative):', child.name);
            }
            if (!this.bucket && (name.includes('bucket') || name.includes('scoop') || name.includes('shovel'))) {
                this.bucket = child;
                console.log('Found Bucket (alternative):', child.name);
            }
        });
    }
    
    logModelStructure(object, level = 0) {
        const indent = '  '.repeat(level);
        console.log(`${indent}${object.name || 'unnamed'} (${object.type})`);
        
        object.children.forEach(child => {
            this.logModelStructure(child, level + 1);
        });
    }
    
    setFrontPivotRotation(degrees) {
        if (this.frontPivot) {
            this.frontPivot.rotation.y = THREE.MathUtils.degToRad(degrees);
        }
    }
    
    setArmGroupRotation(degrees) {
        if (this.armGroup) {
            this.armGroup.rotation.x = THREE.MathUtils.degToRad(degrees);
        }
    }
    
    setBucketRotation(degrees) {
        if (this.bucket) {
            this.bucket.rotation.x = THREE.MathUtils.degToRad(degrees);
        }
    }
    
    updateIndicators(frontPivot, armGroup, bucket) {
        // Update Center Pivot indicator (-30 to 30)
        const centerPercent = ((frontPivot + 30) / 60) * 100;
        document.getElementById('centerIndicator').style.left = centerPercent + '%';
        document.getElementById('centerValue').textContent = Math.round(frontPivot) + '°';
        
        // Update Arm Pivot indicator (90 to 175)
        const armPercent = ((armGroup - 90) / 85) * 100;
        document.getElementById('armIndicator').style.left = armPercent + '%';
        document.getElementById('armValue').textContent = Math.round(armGroup) + '°';
        
        // Update Bucket Pivot indicator (140 to 300)
        const bucketPercent = ((bucket - 140) / 160) * 100;
        document.getElementById('bucketIndicator').style.left = bucketPercent + '%';
        document.getElementById('bucketValue').textContent = Math.round(bucket) + '°';
    }
    
    getInterpolatedPosition(currentTime) {
        // Find the current keyframe pair to interpolate between
        let currentFrame = this.keyframes[0];
        let nextFrame = this.keyframes[1];
        
        for (let i = 0; i < this.keyframes.length - 1; i++) {
            if (currentTime >= this.keyframes[i].time && currentTime < this.keyframes[i + 1].time) {
                currentFrame = this.keyframes[i];
                nextFrame = this.keyframes[i + 1];
                break;
            }
        }
        
        // Handle case where we're past the last keyframe
        if (currentTime >= this.keyframes[this.keyframes.length - 1].time) {
            const lastFrame = this.keyframes[this.keyframes.length - 1];
            return {
                center: lastFrame.center,
                arm: lastFrame.arm,
                bucket: lastFrame.bucket
            };
        }
        
        // Calculate interpolation factor
        const frameDuration = nextFrame.time - currentFrame.time;
        const frameProgress = (currentTime - currentFrame.time) / frameDuration;
        const easedProgress = this.easeInOutCubic(Math.max(0, Math.min(1, frameProgress)));
        
        // Interpolate values
        return {
            center: this.lerp(currentFrame.center, nextFrame.center, easedProgress),
            arm: this.lerp(currentFrame.arm, nextFrame.arm, easedProgress),
            bucket: this.lerp(currentFrame.bucket, nextFrame.bucket, easedProgress)
        };
    }
    
    updateSyncedAnimation() {
        if (!this.isVideoSynced) return;
        
        const currentTime = (performance.now() - this.animationStartTime) / 1000; // Convert to seconds
        this.currentAnimationTime = currentTime;
        
        // Get interpolated position
        const position = this.getInterpolatedPosition(currentTime);
        
        // Apply rotations
        this.setFrontPivotRotation(position.center);
        this.setArmGroupRotation(position.arm);
        this.setBucketRotation(position.bucket);
        
        // Update UI indicators
        this.updateIndicators(position.center, position.arm, position.bucket);
        
        // Check if we've reached the end of the animation
        const lastKeyframe = this.keyframes[this.keyframes.length - 1];
        if (currentTime >= lastKeyframe.time) {
            console.log('Animation cycle complete - waiting for video to loop');
            this.isVideoSynced = false;
        }
    }
    
    lerp(start, end, progress) {
        return start + (end - start) * progress;
    }
    
    easeInOutCubic(t) {
        return t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2;
    }
    
    onWindowResize() {
        this.camera.aspect = window.innerWidth / window.innerHeight;
        this.camera.updateProjectionMatrix();
        this.renderer.setSize(window.innerWidth, window.innerHeight);
    }
    
    animate() {
        requestAnimationFrame(() => this.animate());
        
        this.controls.update();
        this.updateSyncedAnimation();
        
        this.renderer.render(this.scene, this.camera);
    }
}

// Initialize the application when the page loads
document.addEventListener('DOMContentLoaded', () => {
    const viewer = new ConstructionEquipmentViewer();
    
    // Add window resize listener
    window.addEventListener('resize', () => {
        viewer.onWindowResize();
    });
}); 