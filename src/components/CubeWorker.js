import * as THREE from 'three'

onmessage = e => {
  const { code, cube, leds } = e.data

  cube.position = new THREE.Vector3(...cube.position)
  cube.rotation = new THREE.Euler(...cube.rotation)

  leds.forEach(row =>
    row.forEach(col =>
      col.forEach(led => {
        led.color = new THREE.Color(...led.color)
      })
    )
  )

  // Expose a function for the custom code to post changes
  function postChanges () {
    postMessage({
      success: true,
      changes: {
        cube: {
          position: cube.position.toArray(),
          rotation: cube.rotation.toArray()
        },
        leds: leds.map(row =>
          row.map(col =>
            col.map(led => ({
              color: led.color.toArray()
            }))
          )
        )
      }
    })
  }

  const whitelist = {
    cube,
    leds,
    THREE: {
      Vector3: THREE.Vector3,
      Color: THREE.Color
    },
    postChanges
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
    // Do not call postMessage here—instead, user code calls postChanges when desired.
  } catch (error) {
    postMessage({ success: false, error: error.message })
  }
}
