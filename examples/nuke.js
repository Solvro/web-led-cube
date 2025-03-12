let centerX = Math.floor(leds.length / 2)
let centerZ = Math.floor(leds.length / 2)
let maxHeight = Math.floor(leds.length / 2)
let thickness = 1
let currentHeight = 0
let headRadius = 1
let headActive = false
const COLOR_DEFAULT = 0x202020

function getRandomColor(baseColor, variation) {
  let r =
    ((baseColor >> 16) & 0xff) + (Math.random() * variation - variation / 2)
  let g =
    ((baseColor >> 8) & 0xff) + (Math.random() * variation - variation / 2)
  let b = (baseColor & 0xff) + (Math.random() * variation - variation / 2)

  return (
    (Math.min(255, Math.max(0, r)) << 16) |
    (Math.min(255, Math.max(0, g)) << 8) |
    Math.min(255, Math.max(0, b))
  )
}

function clearLeds() {
  for (let x = 0; x < leds.length; x++)
    for (let y = 0; y < leds.length; y++)
      for (let z = 0; z < leds.length; z++)
        leds[z][y][x].color.set(COLOR_DEFAULT)
}

function drawTrunk() {
  for (let y = 0; y <= currentHeight; y++)
    for (
      let dx = -Math.floor(thickness / 2);
      dx <= Math.floor(thickness / 2);
      dx++
    )
      for (
        let dz = -Math.floor(thickness / 2);
        dz <= Math.floor(thickness / 2);
        dz++
      ) {
        let x = centerX + dx,
          z = centerZ + dz
        if (leds[z] && leds[z][y] && leds[z][y][x]) {
          let color = getRandomColor(0xffa500, 30)
          leds[z][y][x].color.set(color)
        }
      }
}

function drawMushroomHead() {
  let headHeight = maxHeight + 2
  for (let y = headHeight - 2; y <= headHeight + 2; y++)
    for (let dx = -headRadius; dx <= headRadius; dx++)
      for (let dz = -headRadius; dz <= headRadius; dz++)
        if (dx * dx + dz * dz <= headRadius * headRadius) {
          let x = centerX + dx,
            z = centerZ + dz
          if (leds[z] && leds[z][y] && leds[z][y][x]) {
            let color = getRandomColor(0xffd700, 40)
            leds[z][y][x].color.set(color)
          }
        }
}

function animateExplosion() {
  clearLeds()

  if (!headActive) {
    if (currentHeight < maxHeight) {
      currentHeight++
      if (currentHeight % 3 === 0) thickness++
    } else {
      headActive = true
      headRadius = 1
    }
    drawTrunk()
  } else {
    drawTrunk()
    drawMushroomHead()
    if (++headRadius > maxHeight) {
      currentHeight = 0
      thickness = 1
      headActive = false
    }
  }

  setTimeout(animateExplosion, 150)
}

animateExplosion()
