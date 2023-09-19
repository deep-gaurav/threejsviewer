import * as THREE from 'three'
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls'
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader'
import { DRACOLoader } from 'three/examples/jsm/loaders/DRACOLoader'
import Stats from 'three/examples/jsm/libs/stats.module'

const scene = new THREE.Scene()

const ambient = new THREE.AmbientLight(0xFFFFFF,4);
scene.background = new THREE.Color('#888888')

scene.add(ambient)

const camera = new THREE.PerspectiveCamera(
    75,
    window.innerWidth / window.innerHeight,
    0.1,
    2000
)
camera.position.z = 2

const dirLight = new THREE.DirectionalLight()
dirLight.intensity=2
dirLight.position.z = -2
dirLight.position.y= 0
dirLight.position.x = -2 
scene.add(dirLight)

const renderer = new THREE.WebGLRenderer()

renderer.setSize(window.innerWidth, window.innerHeight)
document.body.appendChild(renderer.domElement)

camera.position.z = -5
camera.position.y += 5

const controls = new OrbitControls(camera, renderer.domElement)
controls.autoRotate =true
controls.target = new THREE.Vector3(
    -0.14624569960026113,
    2.992797293719448,
    0.6735987841063713,)

controls.maxPolarAngle = 0.6*Math.PI
controls.minPolarAngle = 0.4*Math.PI

controls.minAzimuthAngle = 0.7*Math.PI
controls.maxAzimuthAngle = -0.7*Math.PI
controls.enablePan = false


controls.enableDamping = true

// Note that since Three release 148, you will find the Draco libraries in the `.\node_modules\three\examples\jsm\libs\draco\` folder.
const dracoLoader = new DRACOLoader()
dracoLoader.setDecoderPath('/js/libs/draco/')

const loader = new GLTFLoader()
loader.setDRACOLoader(dracoLoader)
loader.load(
    'model.glb',
    function (gltf) {
        scene.add(gltf.scene)
        // controls.target = (gltf.scene.position)
        console.log(gltf.scene.position)
        document.getElementById('loader-div')?.remove()

        // light.add(gltf.scene.parent)
    },
    (xhr) => {
        console.log((xhr.loaded / xhr.total) * 100 + '% loaded')
        if(xhr.loaded>=xhr.total){
            console.log('loading done')
            document.getElementById('loading-progress').remove()
        }else{
            document.getElementById('loading-progress').innerText=Math.round(((xhr.loaded / xhr.total) * 100))
        }
    },
    (error) => {
        console.log(error)
    }
)

window.addEventListener('resize', onWindowResize, false)
function onWindowResize() {
    camera.aspect = window.innerWidth / window.innerHeight
    camera.updateProjectionMatrix()
    renderer.setSize(window.innerWidth, window.innerHeight)
    render()
}


function animate() {
    requestAnimationFrame(animate)
    const angle = controls.getAzimuthalAngle();
    const min = controls.minAzimuthAngle;
    const max = controls.maxAzimuthAngle;
    // console.log(`Angle ${angle} min ${min} max ${max}`)
    
    if(angle==min){
        controls.autoRotateSpeed=-1
    }

    if(angle==max){
        controls.autoRotateSpeed=1
    }
    controls.update()

    render()

}

function render() {
    renderer.render(scene, camera)
}

animate()