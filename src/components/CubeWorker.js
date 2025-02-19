import * as THREE from 'three'

onmessage = e => {
  const { code, cube, cubes } = e.data

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
    customEval(whitelist)

    postMessage({ success: true, changes: { cube: whitelist.cube } })
  } catch (error) {
    postMessage({ success: false, error: error.message })
  }
}
