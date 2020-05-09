// setup the scene
window.addEventListener('load', init);
var scene;
var camera;
var renderer;
var time;
var radius;
var spot_light;
var ambient_light;
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
    camera.position.set(0, 0, 60);
    camera.lookAt(0, 0, 0);

    halfX = window.innerWidth / 2;
    halfY = window.innerHeight / 2;
    mouseX = 0;
    mouseY = 0;
    time = 0;
    radius = 10;
    addLights();
    addPoints();
    addListeners();
    animate();
}

function onDocumentMouseMove(event)
{
    mouseX = event.clientX - halfX;
    mouseY = event.clientY - halfY;
}

function onDocumentTouchStart(event)
{
    if (event.touches.length == 1)
    {
        event.preventDefault();
        mouseX = event.touches[0].pageX - halfX;
        mouseY = event.touches[0].pageY - halfY;
    }
}

function onDocumentTouchMove(event)
{
    if (event.touches.length == 1)
    {
        event.preventDefault();
        mouseX = event.touches[0].pageX - halfX;
        mouseY = event.touches[0].pageY - halfY;
    }
}

function addListeners()
{
    document.addEventListener('mousemove', onDocumentMouseMove, false);
    document.addEventListener('touchstart', onDocumentTouchStart, false);
    document.addEventListener('touchmove', onDocumentTouchMove, false);
}

function animateMouse()
{
    camera.position.x += (mouseX - camera.position.x) * 0.0005;
    camera.position.y += (-mouseY - camera.position.y) * 0.0005;
}

function addPoints()
{
    for (var i = 0; i < 1000; i++)
    {
        var x = THREE.MathUtils.randFloatSpread(500);
        var y = THREE.MathUtils.randFloatSpread(500);
        var z = THREE.MathUtils.randFloatSpread(100);
        vertices.push(x,y,z);
    }

    var geometry = new THREE.BufferGeometry();
    geometry.setAttribute('position', new THREE.Float32BufferAttribute(vertices, 3));
    var sprite = new THREE.TextureLoader().load("../images/disc.png");
    var material = new THREE.PointsMaterial({map: sprite, size: 20, sizeAttenuation: false, alphaTest: 0.2, transparent: true});
    material.color.setHSL(1.0, 0.3, 0.7);
    var t = Date.now() * 0.00005;
    var h = (360 * (1.0 + t) % 360) / 360;
    material.color.setHSL(h, 0.5, 0.5);

    points = new THREE.Points(geometry, material);
    scene.add(points);
}

function addLights()
{
    ambient_light = new THREE.AmbientLight(0x404040);
    spot_light = new THREE.PointLight(0xffffff, 1, 1000);
    scene.add(spot_light);
    scene.add(ambient_light);
}

function animateSpotLight()
{
    time += 0.005;
    spot_light.position.setX(radius * Math.cos(time));
    spot_light.position.setZ(radius * Math.sin(time));
    spot_light.lookAt(0,0,0);
}

function animate() 
{
    requestAnimationFrame(animate);
    animateSpotLight();
    animateMouse();
    renderer.render(scene, camera);
}