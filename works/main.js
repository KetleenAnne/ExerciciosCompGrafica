import * as THREE from  'three';
import KeyboardState from '../libs/util/KeyboardState.js';
import {initRenderer, initDefaultBasicLight, createGroundPlaneWired} from "../libs/util/util.js";

import {Shoot, Enemy, Player} from './entities.js';

var scene = new THREE.Scene();    
var renderer = initRenderer();    

initDefaultBasicLight(scene);

var keyboard = new KeyboardState();

var camera = new THREE.PerspectiveCamera(45, window.innerWidth / window.innerHeight, 0.1, 1000);
camera.lookAt(0,-0.65,-1);
camera.position.set(0,20,100);

var maxTam = 200;
var timer = 40;

var planes = [];
initPlanes();

var player = new Player(scene);

var isPlayerDestroyed = false;

var shoots = [];
var enemies = [];
var destroyedEnemies = [];

render();

function render() {
    movePlanes();
    
    movePlayer();
    moveShoots();
    
    createEnemies();
    moveEnemies();

    checkCollisions();
    animations();

    requestAnimationFrame(render);
    renderer.render(scene, camera);
}

function initPlanes() {
    for(var i = 0; i <= maxTam; i = i + maxTam) {
        var plane = createGroundPlaneWired(maxTam, maxTam, 50, 50);
        plane.position.set(0, 0, i);
        
        planes.push(plane);
        scene.add(plane);
    }
}

function movePlanes() {
    for(var i = 0; i < planes.length; i++) {
        if(planes.at(i).position.z >= maxTam)
            planes.at(i).position.set(0, 0, -maxTam);
        
        planes.at(i).translateY(-0.1);
    }
}

function movePlayer() {
    keyboard.update();

    if(!isPlayerDestroyed) {
        if(player.cone.position.x > -15 && keyboard.pressed("left"))     
            player.cone.translateX(-player.speed);

        if(player.cone.position.x < 15 && keyboard.pressed("right"))    
            player.cone.translateX(player.speed);

        if(player.cone.position.z > 25.5 && keyboard.pressed("up"))   
            player.cone.translateY(player.speed);

        if(player.cone.position.z < 83.5 && keyboard.pressed("down")) 
            player.cone.translateY(-player.speed);
    }

    player.boundingBox.copy(player.cone.geometry.boundingBox).applyMatrix4(player.cone.matrixWorld);

    if(!isPlayerDestroyed && (keyboard.down("space") || keyboard.down("ctrl")))
        createShoot();
}

function createShoot() {
    var shoot = new Shoot(scene, player);
    shoots.push(shoot);
}

function moveShoots() {
    for(var i = 0; i < shoots.length; i++)
        shoots.at(i).move();
}

function createEnemies() {
    if(timer == 80) {
        var enemy = new Enemy(scene);
        enemies.push(enemy);

        timer = 0;
    } else {
        timer++;
    }
}

function moveEnemies() {
    for(var i = 0; i < enemies.length; i++)
        enemies.at(i).move();
}

function checkCollisionEnemy() {
    for(var i = 0; i < enemies.length; i++) {
        if(enemies.at(i).boundingBox.intersectsBox(player.boundingBox)) {
            destroyedEnemies.push(enemies.at(i));
            enemies.splice(i, 1);

            isPlayerDestroyed = true;
            break;
        }

        for(var j = 0; j < shoots.length; j++) {
            if(enemies.at(i).boundingBox.intersectsSphere(shoots.at(j).boundingSphere)) {
                destroyedEnemies.push(enemies.at(i));
                enemies.splice(i, 1);

                scene.remove(shoots.at(j).sphere);
                shoots.splice(j, 1);
                break;
            }
        }
    }
}

function checkCollisionPosition() {
    for(var i = 0; i < enemies.length; i++) {
        if(enemies.at(i).box.position.z > 90) {
            scene.remove(enemies.at(i).box);
            enemies.splice(i, 1);
        } 
    }
    
    for(var i = 0; i < shoots.length; i++) {
        if(shoots.at(i).sphere.position.z < 10) {
            scene.remove(shoots.at(i).sphere);
            shoots.splice(i, 1);
        }
    }

    for(var i = 0; i < destroyedEnemies.length; i++) {
        if(destroyedEnemies.at(i).box.position.y < -2) {
            scene.remove(destroyedEnemies.at(i).box);
            destroyedEnemies.splice(i, 1);
        }
    }
}

function checkCollisions() {
    checkCollisionEnemy();
    checkCollisionPosition();
}

function animations() {
    if(isPlayerDestroyed) {
        if(player.cone.position.y > -2.5) {
            player.cone.rotateZ(-0.25);
            player.cone.translateZ(-0.1);

            if(player.cone.position.y <= -2.5) {
                scene.remove(player.cone); 
                window.location.reload();  
            }
        }
    }
    
    for(var i = 0; i < destroyedEnemies.length; i++) {
        destroyedEnemies.at(i).box.rotateY(0.25);
        destroyedEnemies.at(i).box.translateY(-0.1);
    }
}