import React, { useRef, useEffect } from "react";
import * as THREE from "three";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls";
import "./../App.css";

const CubeScene = ({ code, setIsError, isEditorVisible }) => {
    const mountRef = useRef(null);
    
    useEffect(() => {
        const currentMount = mountRef.current;
        if (!currentMount) return;

        const scene = new THREE.Scene();
        const camera = new THREE.PerspectiveCamera(
          20,
          currentMount.clientWidth / currentMount.clientHeight,
          0.01,
          1000
        );
        camera.position.z = 10;

        const renderer = new THREE.WebGLRenderer({
          antialias: true,
          alpha: true,
        });

        renderer.setSize(currentMount.clientWidth, currentMount.clientHeight);
        currentMount.appendChild(renderer.domElement);

        const colorLight = new THREE.Color("hsl(40, 100%, 90%)");

        // const cubeGeometry = new THREE.BoxGeometry(1, 1, 1);
        // const cubeMaterial = new THREE.MeshPhongMaterial({
        //   color: colorYellow,
        // });
        // const cube = new THREE.Mesh(cubeGeometry, cubeMaterial);

        const ambientLight = new THREE.AmbientLight(0xffffff, 0.1);
        scene.add(ambientLight);
        const cube = new THREE.Object3D();

        const color1 = new THREE.Color(0xff0000); // Red
        const color2 = new THREE.Color(0x00ff00); // Green
        const color3 = new THREE.Color(0x0000ff); // Blue

        const cubesInRow = 7;
        const smallCubeSize = 0.01;
        const cubes = [];

        for (let x = 0; x < cubesInRow; x++) {
            cubes[x] = [];

            for (let y = 0; y < cubesInRow; y++) {
                cubes[x][y] = [];

                for (let z = 0; z < cubesInRow; z++) {

                    const geometry = new THREE.BoxGeometry(
                        smallCubeSize, smallCubeSize, smallCubeSize
                    );

                    const normalizedX = x / (cubesInRow - 1);
                    const normalizedY = y / (cubesInRow - 1);
                    const normalizedZ = z / (cubesInRow - 1);

                    const averageRatio = (normalizedX + normalizedY + normalizedZ) / 3;

                    let color;
                    if (averageRatio < 0.5) {
                        const ratio = averageRatio * 2; // Scale to [0, 1]
                        color = color1.clone().lerp(color2, ratio);
                    }
                    else {
                        const ratio = (averageRatio - 0.5) * 2; // Scale to [0, 1]
                        color = color2.clone().lerp(color3, ratio);
                    }

                    const material = new THREE.MeshPhongMaterial({
                        color: color,
                        emissive: color,
                        emissiveIntensity: 2,
                    });

                    cubes[x][y][z] = new THREE.Mesh(geometry, material);

                    cubes[x][y][z].position.set(
                        x * 0.1 - 1 / 2 + 0.1 / 2,
                        y * 0.1 - 1 / 2 + 0.1 / 2,
                        z * 0.1 - 1 / 2 + 0.1 / 2
                    );

                    cube.add(cubes[x][y][z]);
                }
            }
        }

        const light = new THREE.PointLight(colorLight, 300, 1000);
        const light2 = new THREE.PointLight(colorLight, 20, 1000);

        light.position.set(-10, -10, 20);
        light2.position.set(10, 20, 10);

        scene.add(light);
        scene.add(light2);
        scene.add(cube);

        const controls = new OrbitControls(camera, renderer.domElement);

        const animate = () => {
          try {
            /* eslint-disable no-eval */
            eval(code);
            setIsError(false);
          } catch (error) {
            console.error("Error executing code: ", error);
            setIsError(true);
          }
          // cube.rotation.y += 0.01;
          renderer.render(scene, camera);
          controls.update();
          requestAnimationFrame(animate);
        };

        const handleResize = () => {
          camera.aspect = currentMount.clientWidth / currentMount.clientHeight;
          camera.updateProjectionMatrix();
          renderer.setSize(currentMount.clientWidth, currentMount.clientHeight);
        };

        animate();
        window.addEventListener("resize", handleResize);

            // Cleanup while unmount component
            return () => {
                window.removeEventListener('resize', handleResize);
                if (currentMount) {
                    currentMount.removeChild(renderer.domElement);
                }
            };

    }, [code, setIsError, isEditorVisible]);

  return <div className="cube-scene" ref={mountRef}></div>;
};

export default CubeScene;
