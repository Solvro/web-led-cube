import React, { useRef, useEffect, useState } from "react";
import * as THREE from "three";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls";
import "./../App.css";

const CubeScene = ({ code, execute, setIsError, isEditorVisible }) => {
  const mountRef = useRef(null);

  const sceneRef = useRef(null);
  const cameraRef = useRef(null);
  const rendererRef = useRef(null);
  const controlsRef = useRef(null);
  const cubeRef = useRef(null);
  const cubesRef = useRef(null);

  let stopRender = false;

  useEffect(() => {
    initializeScene();
    // buttons are temporary
    const resetButton = document.createElement('button');
    resetButton.innerHTML = 'Reset Scene';
    resetButton.style.position = 'absolute';
    resetButton.style.top = '10px';
    resetButton.style.left = '10px';
    resetButton.style.padding = '10px 20px';
    resetButton.style.backgroundColor = '#007BFF';
    resetButton.style.color = 'white';
    resetButton.style.border = 'none';
    resetButton.style.borderRadius = '5px';
    resetButton.style.cursor = 'pointer';
    resetButton.addEventListener('mouseover', () => resetButton.style.backgroundColor = '#0056b3');
    resetButton.addEventListener('mouseout', () => resetButton.style.backgroundColor = '#007BFF');
    resetButton.addEventListener('click', resetScene);
    
    const cleanupButton = document.createElement('button');
    cleanupButton.innerHTML = 'Cleanup Scene';
    cleanupButton.style.position = 'absolute';
    cleanupButton.style.top = '50px';
    cleanupButton.style.left = '10px';
    cleanupButton.style.padding = '10px 20px';
    cleanupButton.style.backgroundColor = '#28a745';
    cleanupButton.style.color = 'white';
    cleanupButton.style.border = 'none';
    cleanupButton.style.borderRadius = '5px';
    cleanupButton.style.cursor = 'pointer';
    cleanupButton.addEventListener('mouseover', () => cleanupButton.style.backgroundColor = '#218838');
    cleanupButton.addEventListener('mouseout', () => cleanupButton.style.backgroundColor = '#28a745');
    cleanupButton.addEventListener('click', cleanupScene);
    
    const clearButton = document.createElement('button');
    clearButton.innerHTML = 'Clear Scene';
    clearButton.style.position = 'absolute';
    clearButton.style.top = '90px';
    clearButton.style.left = '10px';
    clearButton.style.padding = '10px 20px';
    clearButton.style.backgroundColor = '#dc3545';
    clearButton.style.color = 'white';
    clearButton.style.border = 'none';
    clearButton.style.borderRadius = '5px';
    clearButton.style.cursor = 'pointer';
    clearButton.addEventListener('mouseover', () => clearButton.style.backgroundColor = '#c82333');
    clearButton.addEventListener('mouseout', () => clearButton.style.backgroundColor = '#dc3545');
    clearButton.addEventListener('click', clearScene);
    
    document.body.appendChild(resetButton);
    document.body.appendChild(cleanupButton);
    document.body.appendChild(clearButton);

    return () => {
      cleanupScene();
      stopRender = true;
    };
  }, []);

  const createCubes = () => {
    const color1 = new THREE.Color(0xff0000); // Red
    const color2 = new THREE.Color(0x00ff00); // Green
    const color3 = new THREE.Color(0x0000ff); // Blue

    const cubesInRow = 5;
    const smallCubeSize = 0.01;
    const cubes = [];

    // calculate the total size of the grid
    const gridSize = cubesInRow * 0.1; // 0.1 is the spacing between each cube
    const gridOffset = gridSize / 2 - 0.1 / 2; // center offset

    for (let x = 0; x < cubesInRow; x++) {
      cubes[x] = [];

      for (let y = 0; y < cubesInRow; y++) {
        cubes[x][y] = [];

        for (let z = 0; z < cubesInRow; z++) {
          const geometry = new THREE.BoxGeometry(
            smallCubeSize,
            smallCubeSize,
            smallCubeSize
          );

          const normalizedX = x / (cubesInRow - 1);
          const normalizedY = y / (cubesInRow - 1);
          const normalizedZ = z / (cubesInRow - 1);

          const averageRatio = (normalizedX + normalizedY + normalizedZ) / 3;

          let color;
          if (averageRatio < 0.5) {
            const ratio = averageRatio * 2; // Scale to [0, 1]
            color = color1.clone().lerp(color2, ratio);
          } else {
            const ratio = (averageRatio - 0.5) * 2; // Scale to [0, 1]
            color = color2.clone().lerp(color3, ratio);
          }

          const material = new THREE.MeshPhongMaterial({
            color: color,
            emissive: color,
            emissiveIntensity: 2,
          });

          const mesh = new THREE.Mesh(geometry, material);

          // set the position with offset to ensure the grid is centered
          mesh.position.set(
            x * 0.1 - gridOffset,
            y * 0.1 - gridOffset,
            z * 0.1 - gridOffset
          );

          cubes[x][y][z] = mesh;
          cubesRef.current = cubes;
        }
      }
    }

    return cubes;
  };

  const initializeScene = () => {
    const currentMount = mountRef.current;
    if (!currentMount) return;

    // cleanup existing scene for nice reset
    cleanupScene();
    stopRender = false;

    // new scene, camera and renderer initialization
    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(
      20,
      currentMount.clientWidth / currentMount.clientHeight,
      0.01,
      1000
    );
    camera.position.z = 3;

    const renderer = new THREE.WebGLRenderer({
      antialias: true,
      alpha: true,
    });

    renderer.setSize(currentMount.clientWidth, currentMount.clientHeight);
    currentMount.appendChild(renderer.domElement);

    const ambientLight = new THREE.AmbientLight(0xffffff, 0.1);
    scene.add(ambientLight);

    // create and add cubes
    const cube = new THREE.Object3D();
    const cubes = createCubes();
    cubes.map((x) => x.map((y) => y.map((z) => cube.add(z))));

    scene.add(cube);

    const controls = new OrbitControls(camera, renderer.domElement);

    sceneRef.current = scene;
    cameraRef.current = camera;
    rendererRef.current = renderer;
    controlsRef.current = controls;
    cubeRef.current = cube;

    const renderLoop = () => {
      if (!stopRender) {
        controlsRef.current.update();
        rendererRef.current.render(sceneRef.current, cameraRef.current);
        requestAnimationFrame(renderLoop);
      }
    };

    renderLoop();

    const handleResize = () => {
      camera.aspect = currentMount.clientWidth / currentMount.clientHeight;
      camera.updateProjectionMatrix();
      renderer.setSize(currentMount.clientWidth, currentMount.clientHeight);
    };

    window.addEventListener("resize", handleResize);

    // cleanup listener on unmount
    return () => {
      window.removeEventListener("resize", handleResize);
    };
  };

  const cleanupScene = () => {
    if (rendererRef.current) {
      const currentMount = mountRef.current;
      if (
        currentMount &&
        rendererRef.current.domElement.parentNode === currentMount
      ) {
        currentMount.removeChild(rendererRef.current.domElement);
      }
      rendererRef.current.dispose();
    }

    if (controlsRef.current) {
      controlsRef.current.dispose();
    }

    if (sceneRef.current) {
      sceneRef.current.traverse((object) => {
        if (object.geometry) object.geometry.dispose();
        if (object.material) {
          if (Array.isArray(object.material)) {
            object.material.forEach((mat) => mat.dispose());
          } else {
            object.material.dispose();
          }
        }
      });
      sceneRef.current.clear(); // explicitly remove objects
    }
  };

  const clearScene = () => {
    // remove objects from the scene
    while (sceneRef.current.children.length > 0) {
      sceneRef.current.remove(sceneRef.current.children[0]);
    }

    rendererRef.current.clear();
  };

  const resetScene = () => {
    initializeScene();
    controlsRef.current.reset();
    setIsError(false);
  };

  const executeCode = () => {
    try {
      const customEval = new Function("scene", "camera", "renderer", "controls", "cube", "cubes",code);

      customEval(sceneRef.current, cameraRef.current, rendererRef.current, controlsRef.current, cubeRef.current, cubesRef.current);
  
      setIsError(false);
    } catch (error) {
      console.error("Error executing code: ", error);
      setIsError(true);
    }
  };

  useEffect(() => {
    executeCode();
  }, [execute]);

  return <div className="cube-scene" ref={mountRef}></div>;
};

export default CubeScene;
