import * as THREE from 'three'

onmessage = e => {
  const { code, cube, cubes } = e.data

  cube.position = new THREE.Vector3(...cube.position)
  cube.rotation = new THREE.Euler(...cube.rotation)

  const whitelist = {
    cube,
    cubes,
    THREE: {
      Vector3: THREE.Vector3
    }
  }

  try {
    const customEval = new Function(
      'whitelist',
      `
      with(whitelist) {
        ${code}
      }
    `
    )

    console.log(cube.rotation)

    customEval(whitelist)

    // Convert the position vector back to an array
    postMessage({
      success: true,
      changes: {
        cube: {
          position: whitelist.cube.position.toArray(),
          rotation: whitelist.cube.rotation.toArray()
        },
        cubes: whitelist.cubes
      }
    })
  } catch (error) {
    postMessage({ success: false, error: error.message })
  }
}
