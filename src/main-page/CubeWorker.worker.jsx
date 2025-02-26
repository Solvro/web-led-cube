import * as THREE from "three";

function plainToThree({ leds }) {
  leds.forEach((row) =>
    row.forEach((col) =>
      col.forEach((led) => {
        led.color = new THREE.Color(...led.color);
      })
    )
  );
}

function serializeToPlain({ leds }) {
  return {
    leds: leds.map((row) =>
      row.map((col) =>
        col.map((led) => ({
          color: led.color.toArray(),
        }))
      )
    ),
  };
}

onmessage = (e) => {
  const { code, leds } = e.data;
  const interval = 200;

  plainToThree({ leds });

  function postChanges() {
    postMessage({
      success: true,
      changes: serializeToPlain({ leds }),
    });
  }

  const intervalId = setInterval(postChanges, interval);

  const whitelist = {
    leds,
    THREE: {
      Vector3: THREE.Vector3,
      Color: THREE.Color,
    },
    postChanges,
    interval,
    stopInterval: () => clearInterval(intervalId),
  };

  try {
    Object.freeze(whitelist);
    const customEval = new Function(
      "{ leds, THREE, postChanges, interval, stopInterval }",
      `
      (function() {
        ${code}
      })();
    `
    );
    customEval(whitelist);
  } catch (error) {
    postMessage({ success: false, error: error.message });
    clearInterval(intervalId);
    return;
  }
};
