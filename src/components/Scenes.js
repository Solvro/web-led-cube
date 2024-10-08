import React, { useRef, useEffect} from "react";
import "./../App.css";
import {cleanupCoordScene, initializeCoordScene} from "./CoordScene";
import { cleanupMainScene, initializeMainScene} from "./MainScene";

const Scenes = ({ code, execute, setIsError}) => {
  const mainMountRef = useRef(null);
  const coordMountRef = useRef(null);

  const sceneRef = useRef(null);
  const cameraRef = useRef(null);
  const rendererRef = useRef(null);
  const controlsRef = useRef(null);
  const cubeRef = useRef(null);
  const cubesRef = useRef(null);

  const stopRenderRef = useRef(false);

  const mainRefs = {
    mountRef: mainMountRef,
    sceneRef: sceneRef,
    cameraRef: cameraRef,
    rendererRef: rendererRef,
    controlsRef: controlsRef,
    cubeRef: cubeRef,
    cubesRef: cubesRef,
    stopRenderRef: stopRenderRef
  }

  const coordRefs = {
    mountRef: coordMountRef,
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

  return <><div className="main-scene" ref={mainMountRef}>
    <div className="coord-scene" ref={coordMountRef}></div>
    <button onClick={() => resetScene()} style={{position: "absolute"}}>Reset Scene</button>
  </div>
  </>
};

export default Scenes;
