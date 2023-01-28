import * as THREE from "./three.js/build/three.module.js"
import {OrbitControls} from './three.js/examples/jsm/controls/OrbitControls.js'
import {FontLoader} from './three.js/examples/jsm/loaders/FontLoader.js'
import {TextGeometry} from './three.js/examples/jsm/geometries/TextGeometry.js'

let scene, camera, renderer, plane, traffic, camera2, currentCamera, control, road, carobj, title, skybox
let requestIDpos, requestIDrot
let red, yellow, green
let pointer
let objects = [];

//load textures
const newLoader = () => {
    const loader = new THREE.TextureLoader()

    return loader
}

////Create Objects
//load fonts
const createTitle =()=>{
    let loader = new FontLoader()
    loader.load('./three.js/examples/fonts/helvetiker_bold.typeface.json', function(fontpick){
        let tgeometry = new TextGeometry('Traffic Lights',{
            font: fontpick,
            size: 40,
            height: 3
        })

        let tmaterial = new THREE.MeshPhongMaterial({
            color: '#b0304e'
        })

        let tmaterial2 = new THREE.MeshPhongMaterial({
            color: '#571323'
        })
        let tmesh = new THREE.Mesh(tgeometry,[tmaterial,tmaterial2])
        tmesh.position.set(-100,50,180)
        tmesh.rotation.y = Math.PI/2
        scene.add(tmesh)
        return tmesh
    })
}

//create skybox
function createSkybox(){
    const right = newLoader().load('./assets/sky.jpg')
    const left = newLoader().load('./assets/sky.jpg')
    const top = newLoader().load('./assets/sky.jpg')
    const bottom = newLoader().load('./assets/gravel.jpg')
    const front = newLoader().load('./assets/sky.jpg')
    const back = newLoader().load('./assets/sky.jpg')
    
    let skygeo = new THREE.BoxGeometry(550,400,550)
    let skymaterial = [
        new THREE.MeshBasicMaterial({
            map: right,
            side: THREE.BackSide
        }),
        new THREE.MeshBasicMaterial({
            map: left,
            side: THREE.BackSide
        }),
        new THREE.MeshBasicMaterial({
            color: '#2888b5',
            side: THREE.BackSide
        }),
        new THREE.MeshBasicMaterial({
            map: bottom,
            side: THREE.BackSide
        }),
        new THREE.MeshBasicMaterial({
            map: front,
            side: THREE.BackSide
        }),
        new THREE.MeshBasicMaterial({
            map: back,
            side: THREE.BackSide
        })
    ] 

    let skymesh = new THREE.Mesh(skygeo,skymaterial)
    skymesh.position.set(0,195,0)
    scene.add(skymesh)

    return skymesh
}

//create car 
function createCar(){
    const car = new THREE.Group()

    //make wheel1
    let wheel1 = new THREE.CylinderGeometry(6,6,32,20)
    let w1material = new THREE.MeshPhongMaterial({
        color : '#383838'
    })
    let w1cylinder = new THREE.Mesh( wheel1, w1material );
    w1cylinder.rotation.x = Math.PI/2
    w1cylinder.position.set(15,5,0)
    car.add( w1cylinder );

    //make wheel1
    let wheel2 = new THREE.CylinderGeometry(6,6,32,20)
    let w2material = new THREE.MeshPhongMaterial({
        color : '#383838'
    })
    let w2cylinder = new THREE.Mesh( wheel2, w2material );
    w2cylinder.rotation.x = Math.PI/2
    w2cylinder.position.set(-15,5,0)
    car.add( w2cylinder );

    //make body
    let body = new THREE.BoxGeometry(60,28,12)
    let bmaterial = new THREE.MeshPhongMaterial({
        color : '#7a1219'
    })
    let bmesh = new THREE.Mesh(body,bmaterial)
    bmesh.position.set(0,6,0)
    bmesh.rotation.x = Math.PI/2
    car.add( bmesh );

    //make top
    let top = new THREE.BoxGeometry(25,27,10)
    let tmaterial = new THREE.MeshPhongMaterial({
        color : '#bfba9b'
    })
    let tmesh = new THREE.Mesh(top,tmaterial)
    tmesh.position.set(0,16,0)
    tmesh.rotation.x = Math.PI/2
    car.add( tmesh );

    //make window
    let window = new THREE.BoxGeometry(27,25,7)
    let wdmaterial = new THREE.MeshPhongMaterial({
        color : '#212121'
    })
    let wdmesh = new THREE.Mesh(window,wdmaterial)
    wdmesh.position.set(0,16,0)
    wdmesh.rotation.x = Math.PI/2
    car.add( wdmesh );

    //make window
    let swindow = new THREE.BoxGeometry(20,28,7)
    let swdmaterial = new THREE.MeshPhongMaterial({
        color : '#212121'
    })
    let swdmesh = new THREE.Mesh(swindow,swdmaterial)
    swdmesh.position.set(0,16,0)
    swdmesh.rotation.x = Math.PI/2
    car.add( swdmesh );

    car.position.set(120,0,120)
    //
    scene.add(car)
    return car
}

//create floor
function createPlane() {
    const texture = newLoader().load("./assets/grass.png")
    let geometry = new THREE.PlaneGeometry(350,350)

    let material = new THREE.MeshBasicMaterial({
        side : THREE.DoubleSide,
        map : texture
    })

    let mesh = new THREE.Mesh(geometry,material)
    mesh.position.set(0,0,0)
    mesh.rotation.x = Math.PI/2
    mesh.receiveShadow =true

    scene.add(mesh)
    return mesh
}

//create road group
function createRoad() {
    const road = new THREE.Group()
    const texture = newLoader().load("./assets/road5.png")

    //road 1 = vertical 1
    let r1 = new THREE.PlaneGeometry(300,55)
    let r1material = new THREE.MeshPhongMaterial({
        color : '#a8a8a8',
        side : THREE.DoubleSide,
        map: texture
    })

    let r1mesh = new THREE.Mesh(r1,r1material)
    r1mesh.position.set(0,2,125)
    r1mesh.rotation.x = Math.PI/2
    road.add(r1mesh)

    //road 2 = vertical 2
    let r2 = new THREE.PlaneGeometry(300,55)
    let r2mesh = new THREE.Mesh(r2,r1material)
    r2mesh.position.set(0,2,-125)
    r2mesh.rotation.x = Math.PI/2
    road.add(r2mesh)

    //road 3 = horizontal 1
    let r3 = new THREE.PlaneGeometry(305,55)
    let r3mesh = new THREE.Mesh(r3,r1material)
    r3mesh.position.set(125,1,0)
    r3mesh.rotation.x = Math.PI/2
    r3mesh.rotation.z = Math.PI/2
    road.add(r3mesh)

    //road 4 = horizontal 2
    let r4 = new THREE.PlaneGeometry(305,55)
    let r4mesh = new THREE.Mesh(r4,r1material)
    r4mesh.position.set(-125,1,0)
    r4mesh.rotation.x = Math.PI/2
    r4mesh.rotation.z = Math.PI/2
    road.add(r4mesh)

    scene.add(road)
    return road
}

//create control station box
function createControl() {
    let geometry = new THREE.BoxGeometry(
        90,180,10)


    let material = new THREE.MeshPhongMaterial({
        color : '#363636'
    })

    let boxmesh = new THREE.Mesh(geometry,material)
    boxmesh.position.set(0,0,0)
    boxmesh.rotation.x = Math.PI/2
    boxmesh.castShadow =true

    scene.add(boxmesh)
    
    return boxmesh
}

//create control buttons
function createButton(x,y,z,clr) {
    let geometry = new THREE.BoxGeometry(30,30,30)


    let material = new THREE.MeshPhongMaterial({
        color : clr
    })

    let boxmesh = new THREE.Mesh(geometry,material)
    boxmesh.position.set(x,y,z)
    boxmesh.rotation.x = Math.PI/2
    boxmesh.castShadow =true

    scene.add(boxmesh)
    
    return boxmesh
}

//initialize scene, camera, renderer, lights and objects
function init() {
    //scene
    scene = new THREE.Scene()

    //camera
    const FOV = 60
    const ASPECT = window.innerWidth/window.innerHeight
    const NEAR = 0.1
    const FAR = 1000

    camera = new THREE.PerspectiveCamera(FOV, ASPECT,NEAR,FAR)
    camera.position.set(300,150,200)
    camera.lookAt(0,0,0)

    //renderer
    renderer = new THREE.WebGLRenderer({
        antialias: true
    })

    renderer.setSize(window.innerWidth,window.innerHeight)
    renderer.shadowMap.enabled = true
    document.body.appendChild(renderer.domElement)

    //lights
    createAmbientLight()
    createDirectionalLight()

    //objects
    plane = createPlane()
    traffic = createControl()
    road = createRoad()
    carobj= createCar()
    title = createTitle()
    skybox = createSkybox()

    //buttons
    red = createButton(0,0,50,'#bf0f32')
    yellow = createButton(0,0,0,'#ff9500')
    green = createButton(0,0,-50,'#00850f')
    
    objects.push(red,yellow,green)

    //orbit camera
    camera2 = new THREE.PerspectiveCamera(FOV, ASPECT,NEAR,FAR)
    camera2.position.set(100,550,0)
    camera2.lookAt(0,0,0)

    control = new OrbitControls(camera2,renderer.domElement)
    currentCamera = camera
}

//ambient light
function createAmbientLight(){
    const ambientlight = new THREE.AmbientLight(0xffffff,1)
    scene.add(ambientlight)
    
}

//lights for shadow
function createDirectionalLight() {
    const directlight = new THREE.DirectionalLight(0xffffff,1)
    directlight.position.set(100,200,-400)
    scene.add(directlight)

    // const helper = new THREE.DirectionalLightHelper(directlight);
    // scene.add(helper);

}

// switch camera and orbit camera with r key
function keyboardListener(e) {
    let keyCode = e.keyCode
    if(keyCode == 32){
        //space
        if(currentCamera==camera){
            currentCamera = camera2
        }else{
            currentCamera = camera
        }
    }
    
}

//make pointer for raycast
window.onmousedown = function(event){
    pointer = new THREE.Vector2()

    pointer.x = ( event.clientX / window.innerWidth ) * 2 - 1
	pointer.y = -(( event.clientY / window.innerHeight ) * 2 - 1)

}

//add mouse click raycast
function mouseclick(){
    const raycaster = new THREE.Raycaster()
    raycaster.setFromCamera(pointer,currentCamera)

    const intersects = raycaster.intersectObjects(objects)
    
    if(intersects.length >0){
        
        if ( intersects[0].object == red ) {
            stopAnimation()
        }
        if ( intersects[0].object == yellow ) {
            
            slowanimation()
        }
        if ( intersects[0].object == green ) {
            
            playanimation()
        }
    }
    
}

//add event listener
function addListener(e) {
    document.addEventListener("keydown",keyboardListener)
    document.addEventListener("click",mouseclick)
    
}

//render document
function render(){
    control.update()
    //box.rotation.x += 0.01
    
    requestAnimationFrame(render)
    renderer.render(scene,currentCamera)
}

//// first animation set
// play in normal speed 
function animate1() {
    requestIDpos = requestAnimationFrame(animate1)

    //straight then right
    if(carobj.position.x > -120 && carobj.position.z >= 120){    
        carobj.position.x-= 2  
    }
    if(carobj.position.x <= -120 && carobj.position.z == 120){
        carobj.position.x=-120
        carobj.position.z= 120
        rotate1()

    }
}

// play in slower speed 
function slow1() {
    requestIDpos = requestAnimationFrame(slow1)

    //straight then right
    if(carobj.position.x > -120 && carobj.position.z >60){    
        carobj.position.x-= 0.5 
        
    }
    if(carobj.position.x <= -120 && carobj.position.z == 120){
        carobj.position.x= -120
        carobj.position.z= 120
        rotate1()

    }
}

// rotate car 
function rotate1() {
    requestIDrot = requestAnimationFrame(rotate1)

    if(carobj.rotation.y > -Math.PI/2){
        carobj.rotation.y-= 0.1
        // console.log(carobj.position.y)
        
    }

    //render()
}

////second animation set
function animate2() {
    requestIDpos = requestAnimationFrame(animate2)
  
    if(carobj.position.x <= -120 && carobj.position.z > -120){
        carobj.position.z-= 2
        
    }
    if(carobj.position.z <= -120 && carobj.position.x <= -120 ){
        carobj.position.x= -120
        carobj.position.z= -120
        rotate2()

    }

}

function slow2() {
    requestIDpos = requestAnimationFrame(slow2)
  
    if(carobj.position.x <= -120 && carobj.position.z > -120){
        carobj.position.z-= 0.5
        
    }
    if(carobj.position.z <= -120 && carobj.position.x <= -120 ){
        carobj.position.x= -120
        carobj.position.z= -120
        rotate2()

    }

}

function rotate2() {
    requestIDrot = requestAnimationFrame(rotate2)

    if(carobj.rotation.y > -Math.PI){
        carobj.rotation.y-= 0.1
    } 
}

////third animation set
function animate3() {
    requestIDpos = requestAnimationFrame(animate3)
  
    if(carobj.position.x < 120 && carobj.position.z <= -120){
        
        carobj.position.x+= 2
    }
    if(carobj.position.z <= -120 && carobj.position.x >= 120 ){
        carobj.position.x= 120
        carobj.position.z= -120
        rotate3()

    }
}

function slow3() {
    requestIDpos = requestAnimationFrame(slow3)
  
    if(carobj.position.x < 120 && carobj.position.z <= -120){
        
        carobj.position.x+= 0.5
        
    }
    if(carobj.position.z <= -120 && carobj.position.x >= 120 ){
        carobj.position.x= 120
        carobj.position.z= -120
        rotate3()

    }
}

function rotate3() {
    requestIDrot = requestAnimationFrame(rotate3)

    if(carobj.rotation.y< -(Math.PI/2)){
        carobj.rotation.y+= 0.1
    } 
}

////fourth animation set
function animate4() {
    requestIDpos = requestAnimationFrame(animate4)
  
    if(carobj.position.x >= 120 && carobj.position.z < 120){
        carobj.position.z+= 2
    }
    if(carobj.position.z >= 120 && carobj.position.x >= 120 ){
        carobj.position.x= 120
        carobj.position.z= 120
        rotate4()
    }
}

function slow4() {
    requestIDpos = requestAnimationFrame(slow4)
  
    if(carobj.position.x >= 120 && carobj.position.z < 120){
        carobj.position.z+= 0.5
    }
    if(carobj.position.z >= 120 && carobj.position.x >= 120 ){
        carobj.position.x= 120
        carobj.position.z= 120
        rotate4()
    }
}

function rotate4() {
    requestIDrot = requestAnimationFrame(rotate4)

    if(carobj.rotation.y< 0){
        carobj.rotation.y+= 0.1
    } 

}

////animation controls
//play animation in normal speed
function playanimation(){
    stopAnimation()
        
    if(carobj.position.x <= 120 && carobj.position.z >= 120){
        stopAnimation()
        animate1()
    }
    if(carobj.position.x <= -120 && carobj.position.z <= 120){
        stopAnimation()
        animate2()
    }
    if(carobj.position.x >= -120 && carobj.position.z <= -120){
        stopAnimation()
        animate3()
    }
    if(carobj.position.x >= 120 && carobj.position.z >= -120){
        stopAnimation()
        animate4()
    }
}
//play animation in slower speed
function slowanimation(){
    stopAnimation()
        
    if(carobj.position.x <= 120 && carobj.position.z >= 120){
        stopAnimation()
        slow1()
    }
    if(carobj.position.x <= -120 && carobj.position.z <= 120){
        stopAnimation()
        slow2()
    }
    if(carobj.position.x >= -120 && carobj.position.z <= -120){
        stopAnimation()
        slow3()
    }
    if(carobj.position.x >= 120 && carobj.position.z >= -120){
        stopAnimation()
        slow4()
    }
}
//stop all animation
function stopAnimation() {

    cancelAnimationFrame( requestIDpos )

}

//run functions on load
window.onload = function(){
    init()
    addListener()
    render()
}

