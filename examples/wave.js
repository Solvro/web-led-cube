let currentWavePosition = 0
let waveHeight = 2
let waveWidth = 3
let baseLayer = Math.floor(cubes.length / 3)

const COLOR_DEFAULT = 0x202020
const COLOR_WATER = 0x0005d2
const COLOR_FOAM = 0xffffff

function animateWave () {
  for (let x = 0; x < cubes.length; x++) {
    for (let y = 0; y < cubes.length; y++) {
      for (let z = 0; z < cubes.length; z++) {
        setCubeColor(x, y, z)
      }
    }
  }

  currentWavePosition = (currentWavePosition + 1) % cubes.length
  setTimeout(animateWave, 200)
}

function setCubeColor (x, y, z) {
  const cube = cubes[z][y][x]

  cube.material.color.set(COLOR_DEFAULT)
  cube.material.emissive.set(COLOR_DEFAULT)

  if (y < baseLayer) {
    if (
      y === baseLayer - 1 &&
      Math.random() > 0.5 &&
      Math.abs(x - currentWavePosition) >= waveWidth / 2
    ) {
      let color = Math.random() > 0.5 ? COLOR_FOAM : COLOR_DEFAULT
      cube.material.color.set(color)
      cube.material.emissive.set(color)
      return
    }

    cube.material.color.set(COLOR_WATER)
    cube.material.emissive.set(COLOR_WATER)
    return
  }

  if (
    y >= baseLayer &&
    y < baseLayer + waveHeight &&
    Math.abs(x - currentWavePosition) < waveWidth / 2
  ) {
    let rand = Math.random()
    let color =
      rand > 0.85 ? COLOR_FOAM : rand > 0.3 ? COLOR_WATER : COLOR_DEFAULT
    cube.material.color.set(color)
    cube.material.emissive.set(color)
    return
  }
}

animateWave()
