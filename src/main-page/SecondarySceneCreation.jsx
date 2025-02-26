import * as THREE from "three";
import { FontLoader } from "three/examples/jsm/loaders/FontLoader";
import { TextGeometry } from "three/examples/jsm/geometries/TextGeometry.js";

export function createSecondaryScene() {
  const secondaryScene = new THREE.Scene();
  const secondaryCamera = new THREE.PerspectiveCamera(30, 1, 0.1, 100);
  secondaryCamera.position.z = 2;

  // Cube setup
  const coordCubeGeometry = new THREE.BoxGeometry(0.5, 0.5, 0.5);
  const coordCubeMaterial = new THREE.MeshBasicMaterial({
    color: 0xffff00,
    opacity: 0,
    transparent: true,
  });
  const coordCube = new THREE.Mesh(coordCubeGeometry, coordCubeMaterial);
  secondaryScene.add(coordCube);

  // Edges setup
  const edgesGeometry = new THREE.EdgesGeometry(coordCubeGeometry);
  const defaultLineMaterial = new THREE.LineBasicMaterial({ color: 0x000000 });
  const edges = new THREE.LineSegments(edgesGeometry, defaultLineMaterial);
  secondaryScene.add(edges);

  // Red Edge (X)
  const redLineMaterial = new THREE.LineBasicMaterial({ color: 0xff0000 });
  const redEdgeGeometry = new THREE.BufferGeometry();
  const redVertices = [
    new THREE.Vector3(0.25, 0.25, 0.25),
    new THREE.Vector3(0.25, 0.25, -0.25),
  ];
  redEdgeGeometry.setFromPoints(redVertices);
  const redEdge = new THREE.LineSegments(redEdgeGeometry, redLineMaterial);
  secondaryScene.add(redEdge);

  // Blue Edge (Y)
  const blueLineMaterial = new THREE.LineBasicMaterial({ color: 0x4c8df5 });
  const blueEdgeGeometry = new THREE.BufferGeometry();
  const blueVertices = [
    new THREE.Vector3(0.25, 0.25, 0.25),
    new THREE.Vector3(0.25, -0.25, 0.25),
  ];
  blueEdgeGeometry.setFromPoints(blueVertices);
  const blueEdge = new THREE.LineSegments(blueEdgeGeometry, blueLineMaterial);
  secondaryScene.add(blueEdge);

  // Green Edge (Z)
  const greenLineMaterial = new THREE.LineBasicMaterial({ color: 0x00ff00 });
  const greenEdgeGeometry = new THREE.BufferGeometry();
  const greenVertices = [
    new THREE.Vector3(0.25, 0.25, 0.25),
    new THREE.Vector3(-0.25, 0.25, 0.25),
  ];
  greenEdgeGeometry.setFromPoints(greenVertices);
  const greenEdge = new THREE.LineSegments(
    greenEdgeGeometry,
    greenLineMaterial
  );
  secondaryScene.add(greenEdge);

  // Text setup

  const textLoader = new FontLoader();
  textLoader.load(
    "https://threejs.org/examples/fonts/helvetiker_regular.typeface.json",
    function (font) {
      // Red text (X)
      const textGeometryRed = new TextGeometry("X", {
        font: font,
        size: 0.1,
        depth: 0.01,
        curveSegments: 12,
      });
      textGeometryRed.computeBoundingBox();
      const textWidthRed =
        textGeometryRed.boundingBox.max.x - textGeometryRed.boundingBox.min.x;
      textGeometryRed.translate(-textWidthRed / 2, 0, 0);
      const textMaterialRed = new THREE.MeshBasicMaterial({ color: 0xff0000 });
      const textRed = new THREE.Mesh(textGeometryRed, textMaterialRed);
      const midpointRed = new THREE.Vector3()
        .addVectors(redVertices[0], redVertices[1])
        .multiplyScalar(0.5);
      textRed.position.set(midpointRed.x, midpointRed.y + 0.08, midpointRed.z);
      secondaryScene.add(textRed);

      // Blue text (Y)
      const textGeometryBlue = new TextGeometry("Y", {
        font: font,
        size: 0.1,
        depth: 0.01,
        curveSegments: 12,
      });
      textGeometryBlue.computeBoundingBox();
      const textWidthBlue =
        textGeometryBlue.boundingBox.max.x - textGeometryBlue.boundingBox.min.x;
      textGeometryBlue.translate(-textWidthBlue / 2, 0, 0);
      const textMaterialBlue = new THREE.MeshBasicMaterial({ color: 0x4c8df5 });
      const textBlue = new THREE.Mesh(textGeometryBlue, textMaterialBlue);
      const midpointBlue = new THREE.Vector3()
        .addVectors(blueVertices[0], blueVertices[1])
        .multiplyScalar(0.5);
      textBlue.position.set(
        midpointBlue.x + 0.08,
        midpointBlue.y,
        midpointBlue.z
      );
      secondaryScene.add(textBlue);

      // Green text (Z)
      const textGeometryGreen = new TextGeometry("Z", {
        font: font,
        size: 0.1,
        depth: 0.01,
        curveSegments: 12,
      });
      textGeometryGreen.computeBoundingBox();
      const textWidthGreen =
        textGeometryGreen.boundingBox.max.x -
        textGeometryGreen.boundingBox.min.x;
      textGeometryGreen.translate(-textWidthGreen / 2, 0, 0);
      const textMaterialGreen = new THREE.MeshBasicMaterial({
        color: 0x00ff00,
      });
      const textGreen = new THREE.Mesh(textGeometryGreen, textMaterialGreen);
      const midpointGreen = new THREE.Vector3()
        .addVectors(greenVertices[0], greenVertices[1])
        .multiplyScalar(0.5);
      textGreen.position.set(
        midpointGreen.x,
        midpointGreen.y + 0.05,
        midpointGreen.z
      );
      secondaryScene.add(textGreen);

    }
  );

  return { secondaryScene, secondaryCamera, coordCube};
}
