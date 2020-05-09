// setup the scene
window.addEventListener('load', init);
var scene;
var camera;
var renderer;
var time;
var radius;
var spot_light;
var ambient_light;
var particles = [];
var points;
var mesh;
var controls;
var t;
function init()
{
    THREE.Cache.enabled = true;
    scene = new THREE.Scene();
    camera = new THREE.PerspectiveCamera(75, window.innerWidth/window.innerHeight, 0.1, 1000);
    renderer = new THREE.WebGLRenderer();
    renderer.setSize(window.innerWidth, window.innerHeight);
    document.body.appendChild(renderer.domElement);
    controls = new THREE.OrbitControls(camera, renderer.domElement);
    camera.position.set(0, 0, 5);
    camera.lookAt(0, 0, 0);
    time = 0;
    t = 0;
    radius = 10;
    addLights();
    addPoints();
    animate();
}


function addPoints()
{
    const geo = new THREE.Geometry();
    var n = 250;
    var gRatio = (1 + Math.sqrt(5)) / 2;
    var step = Math.PI * 2 * gRatio;
    var acc = 0.008;
    for (var i = 0; i < n; i++)
    {
        var t = i / n;
        var inc = Math.acos(1 - 2 * t);
        var azimuth = step * i;
        var x = Math.sin(inc) * Math.cos(azimuth);
        var y = Math.sin(inc) * Math.sin(azimuth);
        var z = Math.cos(inc);
        const particle = {
            position: new THREE.Vector3(x, y, z),
            direction: new THREE.Vector3(x, y, z),
            velocity: new THREE.Vector3(0, 0, 0),
            acceleration: new THREE.Vector3(acc, acc, acc)
        }
        particles.push(particle);
        geo.vertices.push(particle.position);
    }
    var sprite = new THREE.TextureLoader().load("../images/disc.png");
    const mat = new THREE.PointsMaterial({map: sprite, size: 5, sizeAttenuation: false, alphaTest: 0.5, transparent: true});
    mesh = new THREE.Points(geo, mat);
    mesh.position.z = -4;
    scene.add(mesh);
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

function animatePoints()
{
    particles.forEach(p =>
        {
            p.acceleration.x * time;
            p.acceleration.y * time;
            p.acceleration.z * time;
            p.velocity.add(p.direction.multiply(p.acceleration));
            p.position.add(p.velocity);
        })
    mesh.position.setX(radius * Math.cos(time));
    mesh.geometry.rotateZ(0.01);
    mesh.geometry.verticesNeedUpdate = true;
}

function animate() 
{
    requestAnimationFrame(animate);
    animateSpotLight();

    animatePoints();
    controls.update();
    renderer.render(scene, camera);
}