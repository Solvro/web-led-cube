import React, { useRef, useEffect} from "react";
import * as THREE from "three";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls";
import "./../App.css";
import { createCubes } from "./CreateCubes";
import { cleanupCoordScene, initializeCoordScene} from "./CoordScene";

const CubeScene = ({ code, execute, setIsError}) => {
  const mountRef = useRef(null);

  const sceneRef = useRef(null);
  const cameraRef = useRef(null);
  const rendererRef = useRef(null);
  const controlsRef = useRef(null);
  const cubeRef = useRef(null);
  const cubesRef = useRef(null);

  const coordRefs = {
    mountRef,
    coordSceneRef: useRef(null),
    coordCamRef: useRef(null),
    coordRendererRef: useRef(null),
    coordCubeRef: useRef(null),
    mainCamera: cameraRef,
    secondaryCubeDiv: null, // To hold secondaryCubeDiv for cleanup
  };

  let stopRender = false;

  useEffect(() => {
    initializeScene();
    initializeCoordScene(coordRefs, cameraRef);
    // buttons are temporary
    const resetButton = document.createElement('button');
    resetButton.innerHTML = 'Reset Scene';
    resetButton.style.position = 'absolute';
    resetButton.style.top = '200px';
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
    cleanupButton.style.top = '250px';
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
    
    document.body.appendChild(resetButton);
    document.body.appendChild(cleanupButton);

    return () => {
      cleanupScene();
      stopRender = true;
    };
  }, []);

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
    cubesRef.current = cubes;

    const renderLoop = () => {
      if (!stopRender) {
        // renderCoordScene(coordRefs, cameraRef);
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

  const resetScene = () => {
    initializeScene();
    controlsRef.current.reset();
    setIsError(false);
  };

  const executeCode = () => {
    try {
      /* eslint-disable */
      const customEval = new Function("scene", "camera", "renderer", "controls", "cube", "cubes", code);
  
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
