import * as THREE from "three";
import { createSecondaryScene } from "./SecondarySceneCreation";

export const initializeCoordScene = (coordRefs) => {
  const {
    mountRef,
    coordSceneRef,
    coordCamRef,
    coordRendererRef,
    coordCubeRef,
    mainCamera,
    stopRenderRef,
  } = coordRefs;
  if (!mountRef.current) return;

  cleanupCoordScene(coordRefs);

  stopRenderRef.current = false;

  const coordRenderer = new THREE.WebGLRenderer({
    antialias: true,
    alpha: true,
  });

  const { secondaryScene, secondaryCamera, coordCube } = createSecondaryScene();
  coordSceneRef.current = secondaryScene;
  coordCamRef.current = secondaryCamera;
  coordCubeRef.current = coordCube;
  coordRendererRef.current = coordRenderer;

  coordRendererRef.current.setSize(
    mountRef.current.clientHeight,
    mountRef.current.clientHeight
  );
  coordRendererRef.current.setClearColor(0x191b20, 0.8);

  // Attach secondary renderer to the main component
  const secondaryCubeDiv = document.createElement("div");
  secondaryCubeDiv.style.position = "absolute";
  secondaryCubeDiv.style.top = "0px";
  secondaryCubeDiv.style.left = "0px";
  secondaryCubeDiv.style.pointerEvents = "none"; // ignore pointer events for this overlay
  mountRef.current.appendChild(secondaryCubeDiv);
  secondaryCubeDiv.appendChild(coordRendererRef.current.domElement);

  coordRefs.secondaryCubeDiv = secondaryCubeDiv;

  // Add toggle button to show/hide coordCube
  let button = document.getElementById("coord-button");
  if (!button) {
    button = document.createElement("button");
    button.id = "coord-button";
    button.style.width = `${mountRef.current.clientHeight}px`;
    button.style.top =`${mountRef.current.clientHeight}px`;
    document.body.appendChild(button);
    button.innerHTML = "Hide Coordinates";
  }

  button.addEventListener("click", () => {
    if (secondaryCubeDiv.style.display === "none") {
      secondaryCubeDiv.style.display = "block";
      button.innerHTML = "Hide Coordinates";
      button.classList.remove("coord-button-closed");
    } else {
      secondaryCubeDiv.style.display = "none";
      button.innerHTML = "Show Coordinates";
      button.className = "coord-button-closed";
    }
  });

  const renderLoop = () => {
    if (!stopRenderRef.current) {
      const fixedDistance = 1.9;

      const direction = new THREE.Vector3();
      direction
        .subVectors(coordCamRef.current.position, coordCubeRef.current.position)
        .normalize();

      const mainCameraDirection = new THREE.Vector3();
      mainCamera.current.getWorldDirection(mainCameraDirection);

      const newPosition = new THREE.Vector3();
      newPosition
        .copy(coordCubeRef.current.position)
        .add(mainCameraDirection.multiplyScalar(-fixedDistance));
      coordCamRef.current.position.copy(newPosition);
      coordCamRef.current.lookAt(coordCubeRef.current.position);

      coordRendererRef.current.render(
        coordSceneRef.current,
        coordCamRef.current
      );

      requestAnimationFrame(renderLoop);
    }
  };

  renderLoop();

  const handleResize = () => {
    if (!mountRef.current) return;
    coordCamRef.current.aspect =
      mountRef.current.clientHeight / mountRef.current.clientHeight;
    coordCamRef.current.updateProjectionMatrix();
    button.style.width = `${mountRef.current.clientHeight}px`;
    coordRendererRef.current.setSize(
      mountRef.current.clientHeight,
      mountRef.current.clientHeight
    );
  };

  window.addEventListener("resize", handleResize);

  // cleanup listener on unmount
  return () => {
    window.removeEventListener("resize", handleResize);
  };
};

export const cleanupCoordScene = (coordRefs) => {
  const { coordSceneRef, coordRendererRef, secondaryCubeDiv } = coordRefs;

  if (coordRendererRef.current) {
    if (secondaryCubeDiv && secondaryCubeDiv.parentNode) {
      secondaryCubeDiv.parentNode.removeChild(secondaryCubeDiv);
    }
    coordRendererRef.current.dispose();
  }

  if (coordSceneRef.current) {
    coordSceneRef.current.traverse((object) => {
      if (object.geometry) object.geometry.dispose();
      if (object.material) {
        if (Array.isArray(object.material)) {
          object.material.forEach((mat) => mat.dispose());
        } else {
          object.material.dispose();
        }
      }
    });
    coordSceneRef.current.clear(); // explicitly remove objects
  }
};
