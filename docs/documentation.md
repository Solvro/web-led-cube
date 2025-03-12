# Documentation

In editor, you can animate each led's color over time.

## Example code

```js
// Set the update interval (in milliseconds)
const interval = 200;

let currentWall = 0;

function animateWalls() {
  // Iterate over each LED in the three-dimensional array
  for (let i = 0; i < leds.length; i++) {
    for (let j = 0; j < leds.length; j++) {
      for (let k = 0; k < leds.length; k++) {
        const led = leds[i][j][k];

        // Set the color: if the current index matches the selected wall, use white; otherwise, use a dark gray.
        const color = (k === currentWall) ? 0xFFFFFF : 0x202020;        
        led.color.set(color);
      }
    }
  }

  // Cycle to the next wall (and loop)
  currentWall = (currentWall + 1) % leds.length;

  // Schedule the next frame update after 'interval' ms.
  setTimeout(animateWalls, interval);
}

// Start the animation
animateWalls();
```

## Provided data format

leds is a 3D array of [three.js Color](https://threejs.org/docs/index.html#api/en/math/Color)

on this object, you can only set a new color

```js
for (let i = 0; i < leds.length; i++) {
    for (let j = 0; j < leds.length; j++) {
        for (let k = 0; k < leds.length; k++) {
            const led = leds[i][j][k];

            // Set the color using a hexadecimal value:
            led.color.set(0xff0000); // Red

            // Set the color using a CSS-style string:
            led.color.set('blue');

            // Or using RGB components (between 0 and 1):
            led.color.setRGB(1, 0, 0); // Red
        }
    }
}
```

For animating changes over time, always use the variable **interval** (in milliseconds) as setTimeout **ms** parameter. This is the only way to ensure this function will be called again after the specified time.

```js
// you can set your own interval, by default it's 200 miliseconds
// interval = 400;

function updateCube()
{
    leds[0][0][0].color.set(0xff0000); // Red
}
setTimeout(updateCube, interval);
```
