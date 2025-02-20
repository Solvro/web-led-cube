import * as THREE from 'three'

function plainToThree ({ cube, leds }) {
  cube.position = new THREE.Vector3(...cube.position)
  cube.rotation = new THREE.Euler(...cube.rotation)

  leds.forEach(row =>
    row.forEach(col =>
      col.forEach(led => {
        led.color = new THREE.Color(...led.color)
      })
    )
  )
}

function serializeToPlain ({ cube, leds }) {
  return {
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
}

onmessage = e => {
  const { code, cube, leds } = e.data
  const interval = 200

  plainToThree({ cube, leds })

  function postChanges () {
    postMessage({
      success: true,
      changes: serializeToPlain({ cube, leds })
    })
  }

  const whitelist = {
    cube,
    leds,
    THREE: {
      Vector3: THREE.Vector3,
      Color: THREE.Color
    },
    postChanges,
    interval
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
    setInterval(postChanges, interval)
  } catch (error) {
    postMessage({ success: false, error: error.message })
    return
  }
}
