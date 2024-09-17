import React, { useRef, useEffect } from "react";
import * as THREE from "three";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls";
import { createSecondaryScene } from "./SecondaryScene";
import "./../App.css";

const CubeScene = ({ code, setIsError, isEditorVisible }) => {
  const mountRef = useRef(null);

  // coordCube refs
  const coordCamRef = useRef(null);
  const coordSceneRef = useRef(null);
  const coordCubeRef = useRef(null);

  useEffect(() => {
    const { secondaryScene, secondaryCamera, coordCube } =
      createSecondaryScene();
    coordSceneRef.current = secondaryScene;
    coordCamRef.current = secondaryCamera;
    coordCubeRef.current = coordCube;
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
        }
      }
    }

    return cubes;
  };

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

    const ambientLight = new THREE.AmbientLight(0xffffff, 0.1);
    scene.add(ambientLight);

    const cube = new THREE.Object3D();
    const cubes = createCubes();
    cubes.map((x) => x.map((y) => y.map((z) => cube.add(z))));

    scene.add(cube);

    const controls = new OrbitControls(camera, renderer.domElement);

    // Coord cube
    const secondaryRenderer = new THREE.WebGLRenderer({
      antialias: true,
      alpha: true,
    });
    secondaryRenderer.setSize(
      currentMount.clientHeight / 6,
      currentMount.clientHeight / 6
    );
    secondaryRenderer.setClearColor(0x191b20, 0.8);

    // secondary renderer atatch to the main component
    // button CSS is in part in App.css!!!
    const secondaryCubeDiv = document.createElement("div");
    secondaryCubeDiv.style.position = "absolute";
    secondaryCubeDiv.style.top = "30px";
    secondaryCubeDiv.style.left = "10px";
    secondaryCubeDiv.style.pointerEvents = "none"; // ignore pointer events for this overlay
    currentMount.appendChild(secondaryCubeDiv);
    secondaryCubeDiv.appendChild(secondaryRenderer.domElement);

    let button = document.getElementById("coord-button");
    function createButton() {
      let button = document.getElementById("coord-button");
      if (!button) {
        button = document.createElement("button");
        button.id = "coord-button";
        button.style.width = `${currentMount.clientHeight / 6}px`;
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
    }
    createButton();

    const fixedDistance = 1.9; // distance between camera and cube

    const animate = () => {
      try {
        /* eslint-disable no-eval */
        eval(code); // This code modifies the main cube
        setIsError(false);
      } catch (error) {
        console.error("Error executing code: ", error);
        setIsError(true);
      }
    
    
      // Maintain the constant distance between coordCube and coordCam
      const direction = new THREE.Vector3();
      direction
        .subVectors(coordCamRef.current.position, coordCubeRef.current.position)
        .normalize();
      
      const mainCameraDirection = new THREE.Vector3();
      camera.getWorldDirection(mainCameraDirection);
    
      const newPosition = new THREE.Vector3();
      newPosition
        .copy(coordCubeRef.current.position)
        .add(mainCameraDirection.multiplyScalar(-fixedDistance));
    
      coordCamRef.current.position.copy(newPosition);
      coordCamRef.current.lookAt(coordCubeRef.current.position);
    
      // Render both scenes
      renderer.render(scene, camera);
      secondaryRenderer.render(coordSceneRef.current, coordCamRef.current);
    
      controls.update();
      requestAnimationFrame(animate);
    };

    const handleResize = () => {
      camera.aspect = currentMount.clientWidth / currentMount.clientHeight;
      camera.updateProjectionMatrix();
      renderer.setSize(currentMount.clientWidth, currentMount.clientHeight);

      // coord Cube
      coordCamRef.current.aspect =
        currentMount.clientHeight / currentMount.clientHeight;
      coordCamRef.current.updateProjectionMatrix();
      button.style.width = `${currentMount.clientHeight / 6}px`;
      secondaryRenderer.setSize(
        currentMount.clientHeight / 6,
        currentMount.clientHeight / 6
      );
    };

    animate();
    window.addEventListener("resize", handleResize);
    // Cleanup while unmount component
    return () => {
      window.removeEventListener("resize", handleResize);
      if (currentMount) {
        currentMount.removeChild(renderer.domElement);
        currentMount.removeChild(secondaryCubeDiv);
      }
    };
  }, [code, setIsError, isEditorVisible]);

  return <div className="cube-scene" ref={mountRef}></div>;
};

export default CubeScene;
