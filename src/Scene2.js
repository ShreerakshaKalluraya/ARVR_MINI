import React, { useRef, useEffect } from 'react';
import { Canvas, useLoader, useFrame } from '@react-three/fiber';
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader';
import { OrbitControls, PerspectiveCamera } from '@react-three/drei';
import * as THREE from 'three';

const TreadmillModel = ({ positionZ }) => {
    const treadmill = useLoader(GLTFLoader, '/models/scene2.glb');
    const ref = useRef();

    useEffect(() => {
        if (treadmill && treadmill.scene) {
            treadmill.scene.traverse((node) => {
                if (node.isMesh && node.material) {
                    if ('roughness' in node.material) {
                        node.material.roughness = 0.5;
                    }
                    if ('metalness' in node.material) {
                        node.material.metalness = 0.5;
                    }
                    node.material.needsUpdate = true;
                }
            });
        }
    }, [treadmill]);

    useFrame(() => {
        if (ref.current) {
            ref.current.position.z += 0.005; // Move the treadmill forward
            if (ref.current.position.z >25) { // Reset position when out of view
                ref.current.position.z = positionZ; // Reset to initial position
            }
        }
    });

    return (
        <primitive
            ref={ref}
            object={treadmill.scene}
            scale={[0.2, 0.2, 0.2]}
            position={[5.5, -0.6, positionZ]}
        />
    );
};

const Lights = () => {
    return (
        <>
            <ambientLight intensity={0.5} />
            <hemisphereLight intensity={0.3} skyColor={new THREE.Color(0x87ceeb)} groundColor={new THREE.Color(0xaaaaaa)} />
            <directionalLight position={[5, 5, 5]} intensity={0.8} castShadow />
            <directionalLight position={[-5, 5, -5]} intensity={0.8} castShadow />
            <spotLight position={[0, 10, 0]} intensity={1} angle={Math.PI / 4} penumbra={0.5} castShadow />
        </>
    );
};

const Scene = () => {
    return (
        <Canvas style={{ height: '100vh', backgroundColor: '#f0f0f0' }} shadows>
            <PerspectiveCamera makeDefault position={[0, 0, 0.1]} fov={75} near={0.1} far={1000} />
            <Lights />
            {/* Render multiple TreadmillModel instances with different initial z positions */}
            <TreadmillModel positionZ={-9} />
            <TreadmillModel positionZ={-10} />
            <TreadmillModel positionZ={-9} />
            <OrbitControls maxPolarAngle={Math.PI / 2} enableDamping={true} dampingFactor={0.25} />
        </Canvas>
    );
};

export default Scene;
