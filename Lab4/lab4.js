// setup the scene
window.addEventListener('load', init);
var scene;
var camera;
var renderer;
var pos;
var time;
var radius;
var fake_lamp;
var cubes = [];
var spot_light;
var ambient_light;
var textures = [];
var normMaps = [];
var array = ["154.jpg" ,"154_norm.jpg", "157.jpg", "157_norm.jpg", "161.jpg","161_norm.jpg", "176.jpg","176_norm.jpg"];
var vec;
var controls;
function init()
{
    THREE.Cache.enabled = true;
    scene = new THREE.Scene();
    camera = new THREE.PerspectiveCamera(75, window.innerWidth/window.innerHeight, 0.1, 1000);
    renderer = new THREE.WebGLRenderer();
    renderer.setSize(window.innerWidth, window.innerHeight);
    document.body.appendChild(renderer.domElement);

    vec = new THREE.Vector3(0, 10, 0);
    controls = new THREE.OrbitControls(camera, renderer.domElement);
    camera.position.set(vec.x, vec.y, vec.z);
    camera.lookAt(0, 0, 0);
    controls.update();

    pos = -4;
    time = 0;
    radius = 10;
    for (var i = 0; i < array.length; i+=2)
    {
        loadTexture(array[i], array[i+1]);
    }
    addTextureCube();
    addNormalCube(0, 0);
    addNormalCube(1, 2);
    addTextureShaderCube();
    addTextureShaderCube2()
    addLights();
    animate();
}

function addLights()
{
    var material = new THREE.MeshBasicMaterial({color: 0x404040})
    //adding a sphere here to show position of spot_light
    var geometry = new THREE.SphereGeometry(0.1, 0.1, 0.1);
    fake_lamp = new THREE.Mesh(geometry, material);
    ambient_light = new THREE.AmbientLight(0x404040);
    spot_light = new THREE.PointLight(0xffffff, 1, 1000);
    scene.add(spot_light);
    scene.add(ambient_light);
    scene.add(fake_lamp);
}

function addTextureCube()
{  
    var material = new THREE.MeshPhongMaterial({map:textures[0]});
    var geometry = new THREE.BoxGeometry();
    var cube = new THREE.Mesh(geometry, material);
    cube.position.x = pos;
    pos+=2;
    cubes.push(cube);
    scene.add(cube);
}

function addNormalCube(ti, mi)
{
    var material = new THREE.MeshPhongMaterial({map: textures[ti], normalMap: normMaps[mi]});
    var geometry = new THREE.BoxGeometry();
    var cube = new THREE.Mesh(geometry, material);
    cube.position.x = pos;
    pos+=2;
    cubes.push(cube);
    scene.add(cube);
}

function addTextureShaderCube()
{
    var uniforms = {
        texture: { type: "t", value: textures[2]}
    };
    var geometry = new THREE.BoxGeometry(1, 1, 1);
    var material =  new THREE.ShaderMaterial({
            		uniforms: uniforms,
      			    fragmentShader: fragmentShader(),
              		vertexShader: vertexShader(),
      			    precision: "mediump"});
    cube = new THREE.Mesh(geometry, material);
    cube.position.x = pos;
    pos+=2;
    cubes.push(cube);
    scene.add(cube);
}

function addTextureShaderCube2()
{
    var uniforms = {
        texture: { type: "t", value: textures[3]}
    };
    uniforms.texture.value.wrapS = uniforms.texture.value.wrapT = THREE.RepeatWrapping;
    var geometry = new THREE.BoxGeometry(1, 1, 1);
    var material =  new THREE.ShaderMaterial({
            		uniforms: uniforms,
      			    fragmentShader: fragmentShader2(),
              		vertexShader: vertexShader(),
      			    precision: "mediump"});
    cube = new THREE.Mesh(geometry, material);
    cube.position.x = pos;
    pos+=2;
    cubes.push(cube);
    scene.add(cube);
}

function animateSpotLight()
{
    var tmp = cubes[Math.floor(cubes.length/2)].position;
    //Orbiting the spot_light around the cube
    // always orbit the middle cube depending on how many cubes there are
    time += 0.005;
    spot_light.position.setX(tmp.x + radius * Math.cos(time));
    spot_light.position.setZ(tmp.z + radius * Math.sin(time));
    fake_lamp.position.set(spot_light.position.x, spot_light.position.y, spot_light.position.z);
    spot_light.lookAt(cubes[Math.floor(cubes.length/2)].position);
}

function loadTexture(t, m)
{
    path = "../images/";
    var texture = THREE.ImageUtils.loadTexture(path + t);
    var normMap = THREE.ImageUtils.loadTexture(path + m);
    textures.push(texture);
    normMaps.push(normMap);
}

function animate() 
{
    requestAnimationFrame(animate);
    animateSpotLight();
    controls.update();
    renderer.render(scene, camera);
}

function vertexShader()
{
    return `
        varying vec2 vUv;

        void main() {
            vUv = uv;
            vec4 modelViewPosition = modelViewMatrix * vec4(position, 
                1.0);
            gl_Position = projectionMatrix * modelViewPosition;
        }
    
    `
}

function fragmentShader()
{
    return `
        uniform sampler2D texture;
        varying vec2 vUv;
        void main() {
            gl_FragColor = texture2D(texture, vUv);
        }
    `
}

function fragmentShader2()
{
    return `
        uniform sampler2D texture;
        varying vec2 vUv;
        void main() {
            gl_FragColor = texture2D(texture, 2.0 * vUv);
        }
    `
}