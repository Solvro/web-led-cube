import * as THREE from "three";
export const createCubes = (numCubes) => {
    const color1 = new THREE.Color(0xff0000); // Red
    const color2 = new THREE.Color(0x00ff00); // Green
    const color3 = new THREE.Color(0x0000ff); // Blue

    const cubesInRow = numCubes;
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