import * as THREE from  'three';
import {degreesToRadians} from "../libs/util/util.js";

export class Shoot {
    constructor(scene, player) {
        this.sphere = new THREE.Mesh(new THREE.SphereGeometry(0.25, 32, 16), new THREE.MeshLambertMaterial());
        this.sphere.position.set(player.cone.position.x, player.cone.position.y, player.cone.position.z -2);
        
        this.boundingSphere = new THREE.Sphere(this.sphere.position, this.sphere.geometry.parameters.radius);

        scene.add(this.sphere);

        this.speed = 0.6;
    }

    move() {
        this.sphere.translateZ(-this.speed);
    }
}

export class Enemy {
    constructor(scene) {
        this.box = new THREE.Mesh(new THREE.BoxGeometry(2, 2, 2), new THREE.MeshLambertMaterial({color:0xff0000}));
        this.box.position.set((Math.random()*30 -15), 1, 0);

        this.boundingBox = new THREE.Box3(new THREE.Vector3(), new THREE.Vector3());
        this.boundingBox.setFromObject(this.box);

        scene.add(this.box);

        //this.helper = new THREE.Box3Helper(this.boundingBox, 0x0fff00);
        //scene.add(this.helper);

        this.speed = Math.random()*0.9 + 0.3;
    }

    move() {
        this.box.translateZ(this.speed);
        this.boundingBox.copy(this.box.geometry.boundingBox).applyMatrix4(this.box.matrixWorld);
    }
}

export class Player {
    constructor(scene) {
        this.cone = new THREE.Mesh(new THREE.ConeGeometry(1.5, 3, 60), new THREE.MeshLambertMaterial({color:0xffff00}));
        this.cone.rotateX(degreesToRadians(-90));
        this.cone.position.set(0, 1.5, 83);

        this.boundingBox = new THREE.Box3(new THREE.Vector3(), new THREE.Vector3());
        this.boundingBox.setFromObject(this.cone);

        scene.add(this.cone);

        //this.helper = new THREE.Box3Helper(this.boundingBox, 0xffff00);
        //scene.add(this.helper);

        this.speed = 0.5;
    }
}
