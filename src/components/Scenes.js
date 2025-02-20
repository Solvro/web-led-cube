import React, { useRef, useEffect } from 'react'
import './../App.css'
import { cleanupCoordScene, initializeCoordScene } from './CoordScene'
import { cleanupMainScene, initializeMainScene } from './MainScene'
import { Color } from 'three'

function Scenes ({ code, execute, reset, setIsError, numCubes }) {
  const mainMountRef = useRef(null)
  const coordMountRef = useRef(null)

  const sceneRef = useRef(null)
  const cameraRef = useRef(null)
  const rendererRef = useRef(null)
  const controlsRef = useRef(null)
  const cubeRef = useRef(null)
  const cubesRef = useRef(null)

  const stopRenderRef = useRef(false)
  const workerRef = useRef(null)

  const mainRefs = {
    mountRef: mainMountRef,
    sceneRef: sceneRef,
    cameraRef: cameraRef,
    rendererRef: rendererRef,
    controlsRef: controlsRef,
    cubeRef: cubeRef,
    cubesRef: cubesRef,
    stopRenderRef: stopRenderRef
  }

  const coordRefs = {
    mountRef: coordMountRef,
    coordSceneRef: useRef(null),
    coordCamRef: useRef(null),
    coordRendererRef: useRef(null),
    coordCubeRef: useRef(null),
    mainCamera: cameraRef,
    secondaryCubeDiv: null, // To hold secondaryCubeDiv for cleanup
    stopRenderRef: stopRenderRef
  }

  useEffect(() => {
    initializeMainScene(mainRefs, numCubes)
    initializeCoordScene(coordRefs)

    return () => {
      cleanupMainScene(mainRefs)
      cleanupCoordScene(coordRefs)
      stopRenderRef.current = true
      if (workerRef.current) {
        workerRef.current.terminate()
      }
    }
    /* eslint-disable */
  }, [])

  const resetScene = () => {
    initializeMainScene(mainRefs, numCubes)
    controlsRef.current.reset()
    setIsError(false)
  }

  const convertCubesToSafe = cubes => {
    return cubes.map(row =>
      row.map(col =>
        col.map(mesh => ({
          color: mesh.material.color.toArray()
        }))
      )
    )
  }

  const executeCode = () => {
    if (workerRef.current) {
      workerRef.current.terminate()
    }

    workerRef.current = new Worker(new URL('./CubeWorker.js', import.meta.url))

    workerRef.current.onmessage = e => {
      const { success, error, changes } = e.data
      if (success) {
        // Update the cube (and other objects) with the changes computed in the worker.
        if (changes && changes.cube) {
          const { position, rotation } = changes.cube
          cubeRef.current.position.fromArray(position)
          cubeRef.current.rotation.fromArray(rotation)

          const leds = changes.leds
          console.log(leds)
          leds.forEach((row, x) => {
            row.forEach((col, y) => {
              col.forEach((led, z) => {
                //console.log(led)
                //console.log(new Color(...led.color))

                cubesRef.current[x][y][z].material.color.set(
                  new Color(...led.color)
                )
                cubesRef.current[x][y][z].material.emissive.set(
                  new Color(...led.color)
                )
              })
            })
          })
        }
        setIsError(false)
      } else {
        console.error('Error executing code: ', error)
        setIsError(true)
      }
    }

    // Send only plain data to the worker.
    workerRef.current.postMessage({
      code,
      cube: createSafeCube(cubeRef.current),
      leds: convertCubesToSafe(cubesRef.current)
    })
  }

  const createSafeCube = cube => {
    return {
      position: cube.position.toArray(),
      rotation: cube.rotation.toArray()
    }
  }

  useEffect(() => {
    executeCode()
  }, [execute])

  useEffect(() => {
    resetScene()
  }, [numCubes, reset])

  return (
    <>
      <div className='main-scene' ref={mainMountRef}>
        <div className='coord-scene' ref={coordMountRef}>
          <button id='coord-button'>Hide Coordinates</button>
        </div>
      </div>
    </>
  )
}

export default Scenes
