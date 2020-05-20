// setup the scene
window.addEventListener('load', init);
var scene;
var camera;
var renderer;
var time;
var radius;
var light;
var vertices = [];
var points;
var halfX;
var halfY;
var mouseX;
var mouseY;
function init()
{
    THREE.Cache.enabled = true;
    scene = new THREE.Scene();
    camera = new THREE.PerspectiveCamera(75, window.innerWidth/window.innerHeight, 0.1, 1000);
    renderer = new THREE.WebGLRenderer();
    renderer.setSize(window.innerWidth, window.innerHeight);
    document.body.appendChild(renderer.domElement);
    camera.position.y = 5;
    camera.position.z = 0;
    camera.rotation.x = -0.5;
    halfX = window.innerWidth / 2;
    halfY = window.innerHeight / 2;
    mouseX = 0;
    mouseY = 0;
    time = 0;
    radius = 10;
    addLights();
    addTerrain();
    renderer.setAnimationLoop(animate);
}

function addTerrain()
{
    var texture = THREE.ImageUtils.loadTexture("../images/grass-texture.jpg");
    var heightmap = THREE.ImageUtils.loadTexture("../images/height-map.png");
    var uniforms = {
        texture: { type: "t", value: texture },
        heightmap: { type: "t", value: heightmap }
    };
    var material = new THREE.ShaderMaterial({ 
        uniforms: uniforms,
        vertexShader: vertexShader(),
        fragmentShader: fragmentShader()});
    var plane = new THREE.Mesh(new THREE.PlaneGeometry(10, 10, 200, 200), material);
    plane.position.z = -10;
    plane.position.y = -1;
    plane.rotation.x = -Math.PI / 2;
    scene.add(plane);
}

function addLights()
{
    light = new THREE.DirectionalLight(0xffffff, 1.0);
    light.position.set(1, 1, 1).normalize();
    scene.add(light);
    scene.add(new THREE.AmbientLight(0xffffff, 0.3));
    //a
}

function animate(time) 
{
    renderer.render(scene, camera);
}

function vertexShader()
{
    return `
        uniform sampler2D heightmap;
        varying vec2 vUv;
        void main() 
        {
            vUv = uv;
            vec4 heightColor = texture2D(heightmap, uv);
            vec3 newPosition = position + normal * 2.0 * heightColor.r;
            vec4 modelViewPosition = modelViewMatrix * vec4(newPosition, 1.0);
            gl_Position = projectionMatrix * modelViewPosition;
        }
    
    `
}

function fragmentShader()
{
    return `
        uniform sampler2D texture;
        varying vec2 vUv;
        void main() 
        {
            gl_FragColor = texture2D(texture, vUv);
        }
    `
}