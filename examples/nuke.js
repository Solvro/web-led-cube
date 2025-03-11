let centerX = Math.floor(cubes.length / 2)
let centerZ = Math.floor(cubes.length / 2)
let maxHeight = Math.floor(cubes.length / 2)
let thickness = 1
let currentHeight = 0
let headRadius = 1
let headActive = false
const COLOR_DEFAULT = 0x202020

function getRandomColor (baseColor, variation) {
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

function clearCubes () {
  for (let x = 0; x < cubes.length; x++)
    for (let y = 0; y < cubes.length; y++)
      for (let z = 0; z < cubes.length; z++)
        cubes[z][y][x].material.color.set(COLOR_DEFAULT),
          cubes[z][y][x].material.emissive.set(COLOR_DEFAULT)
}

function drawTrunk () {
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
        if (x >= 0 && x < cubes.length && z >= 0 && z < cubes.length) {
          let color = getRandomColor(0xffa500, 30)
          cubes[z][y][x].material.color.set(color)
          cubes[z][y][x].material.emissive.set(getRandomColor(0xff4500, 30))
        }
      }
}

function drawMushroomHead () {
  let headHeight = maxHeight + 2
  for (let y = headHeight - 2; y <= headHeight + 2; y++)
    for (let dx = -headRadius; dx <= headRadius; dx++)
      for (let dz = -headRadius; dz <= headRadius; dz++)
        if (dx * dx + dz * dz <= headRadius * headRadius) {
          let x = centerX + dx,
            z = centerZ + dz
          if (x >= 0 && x < cubes.length && z >= 0 && z < cubes.length && y >= 0 && y < cubes.length) {
            let color = getRandomColor(0xffd700, 40)
            cubes[z][y][x].material.color.set(color)
            cubes[z][y][x].material.emissive.set(getRandomColor(0xffa500, 40))
          }
        }
}

function animateExplosion () {
  clearCubes()

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
