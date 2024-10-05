import React, { useRef, useEffect} from "react";
import "./../App.css";
import {cleanupCoordScene, initializeCoordScene} from "./CoordScene";
import { cleanupMainScene, initializeMainScene} from "./MainScene";

const Scenes = ({ code, execute, setIsError}) => {
  const mountRef = useRef(null);

  const sceneRef = useRef(null);
  const cameraRef = useRef(null);
  const rendererRef = useRef(null);
  const controlsRef = useRef(null);
  const cubeRef = useRef(null);
  const cubesRef = useRef(null);

  const stopRenderRef = useRef(false);

  const mainRefs = {
    mountRef: mountRef,
    sceneRef: sceneRef,
    cameraRef: cameraRef,
    rendererRef: rendererRef,
    controlsRef: controlsRef,
    cubeRef: cubeRef,
    cubesRef: cubesRef,
    stopRenderRef: stopRenderRef
  }

  const coordRefs = {
    mountRef: mountRef,
    coordSceneRef: useRef(null),
    coordCamRef: useRef(null),
    coordRendererRef: useRef(null),
    coordCubeRef: useRef(null),
    mainCamera: cameraRef,
    secondaryCubeDiv: null, // To hold secondaryCubeDiv for cleanup
    stopRenderRef: stopRenderRef
  };

  useEffect(() => {
    initializeMainScene(mainRefs);
    initializeCoordScene(coordRefs);
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
    
    document.body.appendChild(resetButton);

    return () => {
      cleanupMainScene(mainRefs);
      cleanupCoordScene(coordRefs);
      stopRenderRef.current = true;
    };
    /* eslint-disable */
  }, []);

  const resetScene = () => {
    initializeMainScene(mainRefs);
        // no changes to coordScene, so no need to reset (just controls)
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

export default Scenes;
