import React, { useRef, useEffect } from "react";
import "./../MainPage.css";
import * as THREE from "three";
import { cleanupCoordScene, initializeCoordScene } from "./CoordScene";
import { cleanupMainScene, initializeMainScene } from "./MainScene";

export const Scenes = ({ execute, code, reset, setIsError, numCubes }) => {
  const mainMountRef = useRef(null);
  const coordMountRef = useRef(null);

  const sceneRef = useRef(null);
  const cameraRef = useRef(null);
  const rendererRef = useRef(null);
  const controlsRef = useRef(null);
  const cubeRef = useRef(null);
  const cubesRef = useRef(null);

  const stopRenderRef = useRef(false);
  const workerRef = useRef(null);

  const mainRefs = {
    mountRef: mainMountRef,
    sceneRef: sceneRef,
    cameraRef: cameraRef,
    rendererRef: rendererRef,
    controlsRef: controlsRef,
    cubeRef: cubeRef,
    cubesRef: cubesRef,
    stopRenderRef: stopRenderRef,
  };

  const coordRefs = {
    mountRef: coordMountRef,
    coordSceneRef: useRef(null),
    coordCamRef: useRef(null),
    coordRendererRef: useRef(null),
    coordCubeRef: useRef(null),
    mainCamera: cameraRef,
    secondaryCubeDiv: null, // To hold secondaryCubeDiv for cleanup
    stopRenderRef: stopRenderRef,
  };

  useEffect(() => {
    initializeMainScene(mainRefs, numCubes);
    initializeCoordScene(coordRefs);

    return () => {
      cleanupMainScene(mainRefs);
      cleanupCoordScene(coordRefs);
      stopRenderRef.current = true;
      cleanupWorker();
    };
    /* eslint-disable */
  }, []);

  const resetScene = () => {
    cleanupWorker();
    // initializeMainScene(mainRefs, numCubes);
    // controlsRef.current.reset() old reset way - too expensive but i keep it just in case
    resetCubeColors(cubesRef.current);
    setIsError(false);
  };

  const resetCubeColors = (cubes) => {
    const color1 = new THREE.Color(0xff0000); // Red
    const color2 = new THREE.Color(0x00ff00); // Green
    const color3 = new THREE.Color(0x0000ff); // Blue
  
    const cubesInRow = cubes.length;
  
    for (let x = 0; x < cubesInRow; x++) {
      for (let y = 0; y < cubesInRow; y++) {
        for (let z = 0; z < cubesInRow; z++) {
          const mesh = cubes[x][y][z];
  
          const normalizedX = x / (cubesInRow - 1);
          const normalizedY = y / (cubesInRow - 1);
          const normalizedZ = z / (cubesInRow - 1);
  
          const averageRatio = (normalizedX + normalizedY + normalizedZ) / 3;
  
          let color;
          if (averageRatio < 0.5) {
            const ratio = averageRatio * 2; // scale to [0, 1]
            color = color1.clone().lerp(color2, ratio);
          } else {
            const ratio = (averageRatio - 0.5) * 2; // scale to [0, 1]
            color = color2.clone().lerp(color3, ratio);
          }
  
          mesh.material.color.copy(color);
          mesh.material.emissive.copy(color);
        }
      }
    }
  };

  const cleanupWorker = () => {
    if (workerRef.current) {
      workerRef.current.onmessage = null; 
      workerRef.current.terminate();
      workerRef.current = null; 
    }
  };

  const serializeToPlain = ({ cubes }) => {
    return {
      cubes: cubes.map((row) =>
        row.map((col) =>
          col.map((mesh) => ({
            color: mesh.material.color.toArray(),
          }))
        )
      ),
    };
  };

  const applyChanges = ({ leds }) => {
    if (!cubesRef.current) return;

    leds.forEach((row, i) => {
      row.forEach((col, j) => {
        col.forEach((led, k) => {
          const color = new THREE.Color(...led.color);
          cubesRef.current[i][j][k].material.color.set(color);
          cubesRef.current[i][j][k].material.emissive.set(color);
        });
      });
    });
  };

  const handleWorkerMessage = (e, setIsError, applyChanges) => {
    const { success, error, changes } = e.data;
    if (!success) {
      console.error("Error executing code: ", error);
      setIsError(true);
      return;
    }
    if (changes) {
      applyChanges(changes);
    }
    setIsError(false);
  };

  const executeCode = () => {
    cleanupWorker();

    if (!cubesRef.current) return;

    workerRef.current = new Worker(new URL("./CubeWorker.worker.jsx", import.meta.url), { type: "module" });
    workerRef.current.onmessage = (e) =>
      handleWorkerMessage(e, setIsError, applyChanges);

    const { cubes } = serializeToPlain({
      cubes: cubesRef.current,
    });
    workerRef.current.postMessage({
      code,
      leds: cubes,
    });
  };

  useEffect(() => {
    executeCode();
  }, [execute]);

  useEffect(() => {
    resetScene();
  }, [numCubes, reset]);

  return (
    <>
      <div className="main-scene" ref={mainMountRef}>
        <div className="coord-scene" ref={coordMountRef}>
          <button id="coord-button">Hide Coordinates</button>
        </div>
      </div>
    </>
  );
};
