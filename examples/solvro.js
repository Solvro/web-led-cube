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

// make sure to set cube size as 8x8x8

const interval = 500
let counter = 0
const offset = 4

function hexToRGB(hex) {
  return parseInt(hex.replace('#', '0x'), 16)
}

function updateLedCube() {
  let width = leds.length
  let mid = Math.floor(width / 2)
  let mode = counter % 4

  // Clear all LEDs
  for (let i = 0; i < leds.length; i++) {
    for (let j = 0; j < leds.length; j++) {
      for (let k = 0; k < leds.length; k++) {
        leds[i][j][k].color.set(0x202020)
      }
    }
  }

  for (let y = 0; y < 8; y++) {
    for (let x = 0; x < 8; x++) {
      if (colors[7 - y][x] === '#000000') continue

      let color = hexToRGB(colors[7 - y][x])

      if (mode === 0) {
        leds[mid][y][x + mid - offset].color.set(color)
      } else if (mode === 1) {
        leds[x + mid - offset][y][mid].color.set(color)
      } else if (mode === 2) {
        leds[mid][y][width - 1 - (x + mid - offset)].color.set(color)
      } else if (mode === 3) {
        leds[width - 1 - (x + mid - offset)][y][mid].color.set(color)
      }
    }
  }

  counter++
  setTimeout(updateLedCube, interval)
}

updateLedCube()
