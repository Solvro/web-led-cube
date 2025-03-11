let colors = [
  [
    '#000000',
    '#000000',
    '#000000',
    '#87b7ff',
    '#87b7ff',
    '#000000',
    '#000000',
    '#000000'
  ],
  [
    '#000000',
    '#000000',
    '#87b7ff',
    '#000000',
    '#000000',
    '#87b7ff',
    '#000000',
    '#000000'
  ],
  [
    '#000000',
    '#000000',
    '#87b7ff',
    '#000000',
    '#000000',
    '#87b7ff',
    '#000000',
    '#000000'
  ],
  [
    '#000000',
    '#000000',
    '#000000',
    '#87b7ff',
    '#000000',
    '#000000',
    '#000000',
    '#000000'
  ],
  [
    '#000000',
    '#000000',
    '#000000',
    '#000000',
    '#87b7ff',
    '#000000',
    '#000000',
    '#000000'
  ],
  [
    '#000000',
    '#000000',
    '#87b7ff',
    '#000000',
    '#000000',
    '#87b7ff',
    '#000000',
    '#000000'
  ],
  [
    '#304473',
    '#000000',
    '#000000',
    '#87b7ff',
    '#87b7ff',
    '#000000',
    '#000000',
    '#304473'
  ],
  [
    '#000000',
    '#304473',
    '#000000',
    '#000000',
    '#000000',
    '#000000',
    '#304473',
    '#000000'
  ]
]

let counter = 0

function clearCube () {
  for (let z = 0; z < cubes.length; z++)
    for (let y = 0; y < cubes.length; y++)
      for (let x = 0; x < cubes.length; x++) {
        cubes[z][y][x].material.color.set(0x202020)
        cubes[z][y][x].material.emissive.set(0x202020)
      }
}

function hexToRGB (hex) {
  return parseInt(hex.replace('#', '0x'), 16)
}

function updateLedCube () {
  clearCube()
  let width = cubes.length
  let mid = Math.floor(width / 2)
  let mode = counter % 4

  for (let y = 0; y < 8; y++) {
    for (let x = 0; x < 8; x++) {
      if (colors[7 - y][x] === '#000000') continue

      let color = hexToRGB(colors[7 - y][x])

      if (mode === 0) {
        cubes[mid][y][x + mid - 4].material.color.set(color)
        cubes[mid][y][x + mid - 4].material.emissive.set(color)
      } else if (mode === 1) {
        cubes[x + mid - 4][y][mid].material.color.set(color)
        cubes[x + mid - 4][y][mid].material.emissive.set(color)
      } else if (mode === 2) {
        cubes[mid][y][width - 1 - (x + mid - 4)].material.color.set(color)
        cubes[mid][y][width - 1 - (x + mid - 4)].material.emissive.set(color)
      } else if (mode === 3) {
        cubes[width - 1 - (x + mid - 4)][y][mid].material.color.set(color)
        cubes[width - 1 - (x + mid - 4)][y][mid].material.emissive.set(color)
      }
    }
  }

  counter++
  setTimeout(updateLedCube, 500)
}

updateLedCube()
