# Documentation

In editor, you can interact with a cube position, rotation, and each led's color.

## Example code

```js
// Set the update interval (in milliseconds)
const interval = 200;

let currentWall = 0;

function animateWalls() {
  // Move the cube slightly on the x-axis
  cube.position.x += 0.01;

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

  // Cycle to the next wall
  currentWall = (currentWall + 1) % leds.length;

  // Schedule the next frame update after 'interval' ms.
  setTimeout(animateWalls, interval);
}

// Start the animation
animateWalls();
```

## Cube communication

cube.position is [three.js Vector3](https://threejs.org/docs/index.html#api/en/math/Vector3)

```js
cube.position
// Set position using the set method:
cube.position.set(1, 2, 3);

// Or set individual components:
cube.position.x = 1;
cube.position.y = 2;
cube.position.z = 3;
```

cube.rotation is [three.js Euler](https://threejs.org/docs/index.html#api/en/math/Euler)

```js
cube.rotation.set(Math.PI / 4, Math.PI / 4, Math.PI / 4);

// Or update individual components:
cube.rotation.x = Math.PI / 4;
cube.rotation.y = Math.PI / 4;
cube.rotation.z = Math.PI / 4;
```

leds is a 3D array of [three.js Color](https://threejs.org/docs/index.html#api/en/math/Color)

```js
for (let i = 0; i < leds.length; i++) {
    for (let j = 0; j < leds.length; j++) {
        for (let k = 0; k < leds.length; k++) {
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

for loops, always use the variable interval (miliseconds)

```js
function x()
{
    cube.position.x += 0.01
}
setTimeout(animateWalls, interval);

// you can set your own framerate, by default it's 200 miliseconds
```
