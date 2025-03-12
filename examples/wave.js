let currentWavePosition = 0
let waveHeight = 2
let waveWidth = 3
let baseLayer = Math.floor(leds.length / 3)

const COLOR_DEFAULT = 0x202020
const COLOR_WATER = 0x0005d2
const COLOR_FOAM = 0xffffff
const interval = 300

function animateWave() {
  for (let x = 0; x < leds.length; x++) {
    for (let y = 0; y < leds.length; y++) {
      for (let z = 0; z < leds.length; z++) {
        setCubeColor(x, y, z)
      }
    }
  }

  currentWavePosition = (currentWavePosition + 1) % leds.length
  setTimeout(animateWave, interval)
}

function setCubeColor(x, y, z) {
  const cube = leds[z][y][x]

  cube.color.set(COLOR_DEFAULT)

  if (y < baseLayer) {
    if (
      y === baseLayer - 1 &&
      Math.random() > 0.5 &&
      Math.abs(x - currentWavePosition) >= waveWidth / 2
    ) {
      let color = Math.random() > 0.5 ? COLOR_FOAM : COLOR_DEFAULT
      cube.color.set(color)
      return
    }

    cube.color.set(COLOR_WATER)
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
    cube.color.set(color)
  }
}

animateWave()
