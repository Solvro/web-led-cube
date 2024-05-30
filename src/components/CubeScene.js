// src/ThreeScene.js
import React, { useRef, useEffect } from 'react';
import * as THREE from 'three';

const CubeScene = () => {
    const mountRef = useRef(null);

    useEffect(() => {
        const currentMount = mountRef.current;
        if (!currentMount) return;

        const scene = new THREE.Scene();
        const camera = new THREE.PerspectiveCamera(
            20, window.innerWidth / window.innerHeight, 0.01, 1000
        );
        camera.position.z = 10;

        const renderer = new THREE.WebGLRenderer({
            antialias: true,
            // alpha: true
        });

        renderer.setSize(window.innerWidth, window.innerHeight);
        currentMount.appendChild(renderer.domElement);

        const colorYellow = new THREE.Color("hsl(40, 100%, 60%)");
        const colorLight = new THREE.Color("hsl(40, 100%, 90%)");

        const cubeGeometry = new THREE.BoxGeometry(1, 1, 1);
        const cubeMaterial = new THREE.MeshPhongMaterial({
            color: colorYellow,
        });
        const ambientLight = new THREE.AmbientLight(0xffffff, 0.1);
        scene.add(ambientLight);

        const cube = new THREE.Mesh(cubeGeometry, cubeMaterial);
        const light = new THREE.PointLight(colorLight, 300, 1000);
        const light2 = new THREE.PointLight(colorLight, 20, 1000);

        light.position.set(-10, -10, 20);
        light2.position.set(10, 20, 10)

        scene.add(light);
        scene.add(light2);
        scene.add(cube);

        const animate = () => {
            renderer.render(scene, camera);
            cube.rotation.x += 0.01;
            cube.rotation.z -= 0.01;
            requestAnimationFrame(animate);
        }

        const handleResize = () => {
            renderer.setSize(window.innerWidth, window.innerHeight);
            camera.aspect = window.innerWidth / window.innerHeight;
            camera.updateProjectionMatrix();
        };

        animate();
        window.addEventListener('resize', handleResize);

        // Cleanup przy odmontowaniu komponentu
        return () => {
            window.removeEventListener('resize', handleResize);
            if (currentMount) {
                currentMount.removeChild(renderer.domElement);
            }
        };
    }, []);

    return <div ref={mountRef}></div>;
};

export default CubeScene;
