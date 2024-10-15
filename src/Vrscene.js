import React, { useState, useEffect } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader';
import { useLoader } from '@react-three/fiber';
import { OrbitControls } from '@react-three/drei';
import * as THREE from 'three';

// Model for the Treadmill
const TreadmillModel = ({ lightIntensity }) => {
    const treadmill = useLoader(GLTFLoader, '/models/scene3.glb');

    useEffect(() => {
        if (treadmill && treadmill.scene) {
            treadmill.scene.traverse((node) => {
                if (node.isMesh && node.material) {
                    // Adjust material properties based on lightIntensity
                    if ('roughness' in node.material) {
                        node.material.roughness = THREE.MathUtils.lerp(0.4, 0.1, lightIntensity);
                    }
                    if ('metalness' in node.material) {
                        node.material.metalness = THREE.MathUtils.lerp(0.6, 1.0, lightIntensity);
                    }
                    if ('emissiveIntensity' in node.material) {
                        node.material.emissiveIntensity = THREE.MathUtils.lerp(0, 1, lightIntensity);
                    }
                }
            });
        }
    }, [treadmill, lightIntensity]);

    // Slow rotation of the model
    useFrame(() => {
        if (treadmill && treadmill.scene) {
            treadmill.scene.rotation.y += 0.001; // Adjust the speed of rotation here
        }
    });

    return (
        <primitive
            object={treadmill.scene}
            scale={[0.2, 0.2, 0.2]} // Adjust treadmill scale
            position={[0, 0, 0]} // Position treadmill in the scene
        />
    );
};

const Scene = () => {
    const [lightIntensity, setLightIntensity] = useState(0.5); // Control lighting intensity

    useEffect(() => {
        // Animation loop for changing light intensity
        const animateLightIntensity = () => {
            setLightIntensity((prevIntensity) => {
                const newIntensity = (Math.sin(Date.now() * 0.001) + 1) / 2; // Oscillates between 0 and 1
                return newIntensity;
            });

            // Request the next frame
            requestAnimationFrame(animateLightIntensity);
        };

        // Start the animation loop
        animateLightIntensity();

    }, []);

    return (
        <Canvas style={{ height: '100vh', backgroundColor: 'black' }} shadows>
            {/* Ambient light (soft light) */}
            <ambientLight intensity={0.2} /> {/* Low intensity for soft illumination */}
            {/* Spotlight (direct light) */}
            <spotLight
                position={[0, 5, 10]}
                intensity={1.5}
                angle={Math.PI / 4}
                penumbra={0.3}
                castShadow
                shadow-mapSize-width={2048}
                shadow-mapSize-height={2048}
                shadow-camera-near={0.5}
                shadow-camera-far={50}
                shadow-camera-left={-10}
                shadow-camera-right={10}
                shadow-camera-top={10}
                shadow-camera-bottom={-10}
            />
            {/* Treadmill Model with dynamic lighting */}
            <TreadmillModel lightIntensity={lightIntensity} />
            {/* OrbitControls for user interaction */}
            <OrbitControls />
        </Canvas>
    );
};

export default Scene;
