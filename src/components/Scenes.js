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
    if (workerRef.current) {
      workerRef.current.terminate()
      workerRef.current = null
    }
    initializeMainScene(mainRefs, numCubes)
    controlsRef.current.reset()
    setIsError(false)
  }

  const serializeToPlain = ({ cube, cubes }) => {
    return {
      cube: {
        position: cube.position.toArray(),
        rotation: cube.rotation.toArray()
      },
      cubes: cubes.map(row =>
        row.map(col =>
          col.map(mesh => ({
            color: mesh.material.color.toArray()
          }))
        )
      )
    }
  }

  const applyChanges = ({ cube, leds }) => {
    const { position, rotation } = cube
    cubeRef.current.position.fromArray(position)
    cubeRef.current.rotation.fromArray(rotation)

    leds.forEach((row, i) => {
      row.forEach((col, j) => {
        col.forEach((led, k) => {
          const color = new Color(...led.color)
          cubesRef.current[i][j][k].material.color.set(color)
          cubesRef.current[i][j][k].material.emissive.set(color)
        })
      })
    })
  }

  const handleWorkerMessage = (e, setIsError, applyChanges) => {
    const { success, error, changes } = e.data
    if (!success) {
      console.error('Error executing code: ', error)
      setIsError(true)
      return
    }
    if (changes) {
      applyChanges(changes)
    }
    setIsError(false)
  }

  const executeCode = () => {
    if (workerRef.current) {
      workerRef.current.terminate()
    }

    workerRef.current = new Worker(new URL('./CubeWorker.js', import.meta.url))
    workerRef.current.onmessage = e =>
      handleWorkerMessage(e, setIsError, applyChanges)

    const { cube, cubes } = serializeToPlain({
      cube: cubeRef.current,
      cubes: cubesRef.current
    })
    workerRef.current.postMessage({
      code,
      cube: cube,
      leds: cubes
    })
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
