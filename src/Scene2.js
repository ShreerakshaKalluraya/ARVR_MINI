import React, { useState, useEffect, useRef } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader';
import { useLoader } from '@react-three/fiber';
import { OrbitControls, PerspectiveCamera } from '@react-three/drei';
import * as THREE from 'three';

// Model for the Treadmill
const TreadmillModel = ({ lightIntensity }) => {
    const treadmill = useLoader(GLTFLoader, '/models/scene2.glb');

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

const Lights = () => {
    const lightRef1 = useRef();
    const lightRef2 = useRef();
    const spotLightRef = useRef();

    // Rotate the lights along with the scene
    useFrame(() => {
        const rotationSpeed = 0.0001; // Adjust the rotation speed of lights
        if (lightRef1.current) {
            lightRef1.current.position.x = 5 * Math.cos(Date.now() * rotationSpeed);
            lightRef1.current.position.z = 5 * Math.sin(Date.now() * rotationSpeed);
            lightRef1.current.lookAt(0, 0, 0); // Ensure the light points to the scene center
        }
        if (lightRef2.current) {
            lightRef2.current.position.x = -5 * Math.cos(Date.now() * rotationSpeed);
            lightRef2.current.position.z = -5 * Math.sin(Date.now() * rotationSpeed);
            lightRef2.current.lookAt(0, 0, 0); // Ensure the light points to the scene center
        }
        if (spotLightRef.current) {
            spotLightRef.current.position.x = 3 * Math.cos(Date.now() * rotationSpeed);
            spotLightRef.current.position.z = 3 * Math.sin(Date.now() * rotationSpeed);
            spotLightRef.current.lookAt(0, 0, 0); // Ensure the spotlight points to the scene center
        }
    });

    return (
        <>
            <directionalLight
                ref={lightRef1}
                position={[5, 5, 5]}
                intensity={0.6}
                castShadow
                shadow-mapSize-width={2048}
                shadow-mapSize-height={2048}
            />
            <directionalLight
                ref={lightRef2}
                position={[-5, 5, -5]}
                intensity={0.6}
                castShadow
                shadow-mapSize-width={2048}
                shadow-mapSize-height={2048}
            />
            <spotLight
                ref={spotLightRef}
                position={[0, 3, 0]}
                intensity={1.2}
                angle={Math.PI / 4}
                penumbra={0.5}
                castShadow
                shadow-mapSize-width={2048}
                shadow-mapSize-height={2048}
            />
        </>
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
            {/* Set camera position */}
            <PerspectiveCamera makeDefault position={[0, 2, 5]} fov={75} near={0.1} far={1000} />

            {/* Ambient light for overall illumination */}
            <ambientLight intensity={0.5} /> {/* Set the overall brightness of the scene */}

            {/* Hemisphere light to illuminate the scene evenly */}
            <hemisphereLight intensity={0.5} skyColor={new THREE.Color(0x87ceeb)} groundColor={new THREE.Color(0xaaaaaa)} />

            {/* Directional and spotlight */}
            <Lights />

            {/* Treadmill Model with dynamic lighting */}
            <TreadmillModel lightIntensity={lightIntensity} />

            {/* OrbitControls for user interaction */}
            <OrbitControls maxPolarAngle={Math.PI / 2} enableDamping={true} dampingFactor={0.25} />
        </Canvas>
    );
};

export default Scene;
