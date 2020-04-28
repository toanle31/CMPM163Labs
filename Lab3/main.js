// setup the scene
window.addEventListener('load', init);
var scene;
var camera;
var renderer;
var cubes = [];
var pos = -3;
var count = 0;
var loader = new THREE.FileLoader();

function init()
{
    THREE.Cache.enabled = true;
    scene = new THREE.Scene();
    camera = new THREE.PerspectiveCamera(75, window.innerWidth/window.innerHeight, 0.1, 1000);
    renderer = new THREE.WebGLRenderer();
    renderer.setSize(window.innerWidth, window.innerHeight);
    document.body.appendChild(renderer.domElement);
    camera.position.z = 5;

    addLights();
    addTextureCubes();
    addFancyCube();
    addFancyCube2();
    animate();
}

function addLights()
{
    var light = new THREE.PointLight(0xffffff, 1, 1000);
    light.position.set(10, 10, 10);
    scene.add(light);
}

function addTextureCubes()
{
    // setup the cube
    var geometries = [];
    var materials = [];
    var texture_loader = new THREE.TextureLoader();
    var texture = texture_loader.load("../images/brick-texture.jpg");
    materials.push(new THREE.MeshPhongMaterial( { color: 0xdddddd, specular: 0x00FF00, shininess: 30 }));
    materials.push(new THREE.MeshPhongMaterial( { shininess: 30, wireframe: false, map: texture}));

    for (var i = 0; i < 2; i++)
    {
        geometries.push(new THREE.BoxGeometry(1, 1, 1));
    }
    for (var i = 0; i < 2; i++)
    {
        cubes.push(new THREE.Mesh(geometries[i], materials[i]));
        cubes[i].position.x = pos;
        pos += 2;
        scene.add(cubes[i]);
    }
}
function addFancyCube()
{
    let uniforms = {
		colorB: {type: 'vec3', value: new THREE.Color(0xFF0000)},
		colorA: {type: 'vec3', value: new THREE.Color(0xFFFF00)}};
    let geometry = new THREE.BoxGeometry(1, 1, 1);
    let material = new THREE.ShaderMaterial({
        uniforms: uniforms,
        fragmentShader: fragmentShader(),
        vertexShader: vertexShader(),
        precision: "mediump" });
    let mesh = new THREE.Mesh(geometry, material);
    mesh.position.x = pos;
    pos += 2;
    scene.add(mesh)
    cubes.push(mesh);
}

function addFancyCube2()
{
    let geometry = new THREE.BoxGeometry(1, 1, 1);
    let uniforms = {
		colorB: {type: 'vec3', value: new THREE.Color(0xFFFF00)},
		colorA: {type: 'vec3', value: new THREE.Color(0xFF00FF)}};
    let material = new THREE.ShaderMaterial({
        uniforms: uniforms,
        fragmentShader: fragmentShader2(),
        vertexShader: vertexShader2(),
        precision: "mediump" });
    let mesh = new THREE.Mesh(geometry, material);
    mesh.position.x = pos;
    pos += 2;
    scene.add(mesh)
    cubes.push(mesh);
}

function vertexShader2()
{
    return `
        varying vec3 vUv;

        void main() {
            vUv = position;

            vec4 modelViewPosition = modelViewMatrix * tan(vec4(position, 1));
            gl_Position = projectionMatrix * modelViewPosition;
        }
    `
}
function fragmentShader2()
{
    return `
        varying vec3 vUv;
        uniform vec3 colorA;
        uniform vec3 colorB;
        
        void main() {
            gl_FragColor = vec4(mix(colorA, colorB, vUv.z), 1.0);
        }
`
}
function vertexShader()
{
    return `
        varying vec3 vUv;

        void main() {
            vUv = position;

            vec4 modelViewPosition = modelViewMatrix * vec4(position, 1.0);
            gl_Position = projectionMatrix * modelViewPosition;
        }
    `
}

function fragmentShader()
{
    return `
        varying vec3 vUv;
        uniform vec3 colorA;
        uniform vec3 colorB;
        
        void main() {
            gl_FragColor = vec4(mix(colorA, colorB, vUv.z), 1.0);
        }
    `
}

function animate() 
{
    requestAnimationFrame(animate);
    for (var i = 0; i < cubes.length; i++)
    {
        cubes[i].geometry.rotateX(0.01);
        cubes[i].geometry.rotateY(0.01);
    }
    renderer.render(scene, camera);
}