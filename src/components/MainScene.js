
import * as THREE from "three";
import { OrbitControls } from "three/examples/jsm/Addons.js";
import { createCubes } from "./CreateCubes";

  
  export const initializeMainScene = (mainRefs) => {
    const { mountRef, sceneRef, cameraRef, rendererRef, controlsRef, cubeRef, cubesRef, stopRenderRef } =
    mainRefs;
  if (!mountRef.current) return;

  cleanupMainScene(mainRefs);
    // cleanup existing scene for nice reset
    
    stopRenderRef.current = false;

    // new scene, camera and renderer initialization
    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(
      20,
      mountRef.current.clientWidth / mountRef.current.clientHeight,
      0.01,
      1000
    );
    camera.position.z = 3;

    const renderer = new THREE.WebGLRenderer({
      antialias: true,
      alpha: true,
    });

    renderer.setSize(mountRef.current.clientWidth, mountRef.current.clientHeight);
    mountRef.current.appendChild(renderer.domElement);

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
      if (!stopRenderRef.current) {
        // renderCoordScene(coordRefs, cameraRef);
        controlsRef.current.update();
        rendererRef.current.render(sceneRef.current, cameraRef.current);
        requestAnimationFrame(renderLoop);
      }
    };

    renderLoop();

    const handleResize = () => {
        if (!mountRef.current) return;
      camera.aspect = mountRef.current.clientWidth / mountRef.current.clientHeight;
      camera.updateProjectionMatrix();
      renderer.setSize(mountRef.current.clientWidth, mountRef.current.clientHeight);
    };

    window.addEventListener("resize", handleResize);

    // cleanup listener on unmount
    return () => {
      window.removeEventListener("resize", handleResize);
    };
  };
  
  export const cleanupMainScene = (mainRefs) => {
    const { mountRef, sceneRef, rendererRef, controlsRef} =
    mainRefs;
    if (rendererRef.current) {
      if (
        mountRef.current &&
        rendererRef.current.domElement.parentNode === mountRef.current
      ) {
        mountRef.current.removeChild(rendererRef.current.domElement);
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