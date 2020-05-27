// setup the scene
window.addEventListener('load', init);
var scene;
var camera;
var renderer;
var light;
var planeSize;
var planeCenter;
function init()
{
    THREE.Cache.enabled = true;
    scene = new THREE.Scene();
    camera = new THREE.PerspectiveCamera(75, window.innerWidth/window.innerHeight, 0.1, 1000);
    renderer = new THREE.WebGLRenderer();
    renderer.setSize(window.innerWidth, window.innerHeight);
    document.body.appendChild(renderer.domElement);
    camera.position.y = 10;
    camera.position.y = 3;
    camera.lookAt(0,0,0);
    addPlane();
    addLights();
    addEvents();
    var context = initContext('canvas','2d');
	loadImage('../images/perlin-noise.jpg',context);
    renderer.setAnimationLoop(animate);
}

function addPlane()
{
    const mat = new THREE.MeshPhongMaterial({color:0x4f4f4f, shininess:100, side:THREE.DoubleSide});
    planeSize = 30;
    var p = new THREE.PlaneGeometry(planeSize, planeSize, 100, 100);
    var plane = new THREE.Mesh(p, mat);
    planeCenter = new THREE.Vector3(0,-parseInt(planeSize/4),-planeSize/2);
    plane.position.z = planeCenter.z;
    plane.position.y = planeCenter.y;
    plane.rotation.x = Math.PI/2;
    scene.add(plane);
}

function addBuildings(noiseArray)
{
    var i = 0;
    var scalar = 0;
    for(var r = -planeSize/2; r < planeSize/2; r++) 
    {
        if (r % 8 == 0) continue;
        for(var c = -planeSize/2; c < planeSize/2; c++) 
        {
            if (c % 8 == 0) continue;
            var scalar = Math.random() * 1000 / noiseArray[i++];
            if (r < -8 || r > 8)
            { 
                scalar = Math.random() * 2;
            }
            if (c < -8 || c > 8)
            { 
                scalar = Math.random() * 2;
            }
            var matColor = 0x00ff00;
            if (scalar > 3 && scalar < 6)
                matColor = 0xFFFF00;
            if (scalar > 6 && scalar < 9)
                matColor = 0xFFA500;
            if (scalar > 9)
                matColor = 0xFF0000;
			var geometry = new THREE.BoxGeometry();
            var material = new THREE.MeshPhongMaterial({color:matColor});
            var cube = new THREE.Mesh(geometry, material);
            //console.log(noiseArray[i]);
            cube.scale.y = scalar;
            cube.scale.x = .7;
            cube.scale.z = .7;

			cube.position.z = planeCenter.z + c + cube.scale.z/2;
	        cube.position.x = r + cube.scale.x / 2;
            cube.position.y = planeCenter.y + cube.scale.y / 2;
            scene.add(cube);
        }
    }
}
function sleep(milliseconds) 
{
    const date = Date.now();
    let currentDate = null;
    do 
    {
        currentDate = Date.now();
    } while (currentDate - date < milliseconds);
}

function addEvents()
{
    var angle = THREE.MathUtils.degToRad(270);
    camera.position.x = planeSize * 1.2 * Math.cos(angle);
    camera.position.z = planeCenter.z + planeSize * 1.2 * Math.sin(angle);
    camera.position.y = 4;
    camera.lookAt(0,0,planeCenter.z);
    document.onkeypress =  function(event) 
    {
        var x = event.key;
        if(x == 'a') 
        {
            angle += 0.1;
        } 
        else if (x == 'd') 
        {
            angle -= 0.1;
        }
    camera.position.x = planeSize * 1.2 * Math.cos(angle);
    camera.position.z = planeCenter.z + planeSize * 1.2 * Math.sin(angle);
    camera.lookAt(0,0,planeCenter.z);
    };
}

function addLights()
{
    light = new THREE.AmbientLight(0x353535);
    scene.add(light);
    for (var a = 270; a < 270 * 2; a+=100) 
    {
        light = new THREE.PointLight(0xffffff, 1, planeSize * 1.5);
        light.position.set(planeSize * Math.cos(THREE.MathUtils.degToRad(a)),
        planeCenter.y + planeSize/2,
        planeCenter.z + planeSize * Math.sin(THREE.MathUtils.degToRad(a)));
        scene.add(light);
    }
}

function initContext(canvasID, contextType) 
{
    var canvas = document.createElement('canvas');
    var context = canvas.getContext(contextType);
    return context;
}

function loadImage(imageSource, context) 
{
    var imageObj = new Image();
    imageObj.onload = function() 
    {
        context.drawImage(imageObj, 0, 0);
        var imageData = context.getImageData(0,0,planeSize,planeSize);
        readImage(imageData);
    };
    imageObj.src = imageSource;
}

function readImage(imageData) 
{
    var noiseData = [];
    for(var i = 0; i < imageData.data.length; i+=4) 
    {
        noiseData.push(imageData.data[i]);
    }
    addBuildings(noiseData);
}


function animate(time) 
{
    requestAnimationFrame(animate);
    renderer.render(scene, camera);
}
