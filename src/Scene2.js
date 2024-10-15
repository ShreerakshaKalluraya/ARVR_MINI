import React, { useState, useEffect } from 'react';
import { Canvas, useLoader } from '@react-three/fiber';
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader';
import { OrbitControls, PerspectiveCamera } from '@react-three/drei';
import * as THREE from 'three';

const TreadmillModel = () => {
    const treadmill = useLoader(GLTFLoader, '/models/scene2.glb');

    useEffect(() => {
        if (treadmill && treadmill.scene) {
            treadmill.scene.traverse((node) => {
                if (node.isMesh && node.material) {
                    // Adjust material properties for better visibility
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

    return (
        <primitive
            object={treadmill.scene}
            scale={[0.2, 0.2, 0.2]}
            position={[0, -1, 0]}
        />
    );
};

const Lights = () => {
    return (
        <>
            <ambientLight intensity={0.5} />
            <hemisphereLight intensity={0.3} skyColor={new THREE.Color(0x87ceeb)} groundColor={new THREE.Color(0xaaaaaa)} />
            <directionalLight
                position={[5, 5, 5]}
                intensity={0.8}
                castShadow
            />
            <directionalLight
                position={[-5, 5, -5]}
                intensity={0.8}
                castShadow
            />
            <spotLight
                position={[0, 10, 0]}
                intensity={1}
                angle={Math.PI / 4}
                penumbra={0.5}
                castShadow
            />
        </>
    );
};

const Scene = () => {
    return (
        <Canvas style={{ height: '100vh', backgroundColor: '#f0f0f0' }} shadows>
            <PerspectiveCamera makeDefault position={[0, 2, 5]} fov={75} near={0.1} far={1000} />
            <Lights />
            <TreadmillModel />
            <OrbitControls maxPolarAngle={Math.PI / 2} enableDamping={true} dampingFactor={0.25} />
        </Canvas>
    );
};

export default Scene;