// setup the scene
window.addEventListener('load', init);
var scene;
var camera;
var renderer;
var matShader;
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
    addTerrain();
    addPlane();
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
    var plane = new THREE.Mesh(new THREE.PlaneGeometry(40, 40, 200, 200), material);
    plane.position.z = -20;
    plane.position.y = -1;
    plane.rotation.x = -1.2;
    scene.add(plane);
}

function addPlane()
{
    const material = new THREE.MeshPhongMaterial({color:0x2288ff, shininess:100, side:THREE.DoubleSide});
    var geometry = new THREE.PlaneGeometry(25, 35, 100, 100);
    var plane = new THREE.Mesh(geometry, material);
    plane.position.z = -20;
    plane.rotation.x = -1.2;
    material.onBeforeCompile = (shader) => {
        shader.uniforms.time = { value:0 }
        shader.vertexShader = `
                uniform float time;
            ` + shader.vertexShader
        const token = '#include <begin_vertex>'
        const customTransform = `
                vec3 transformed = vec3(position);
                float freq = 2.0;
                float amp = 0.05;
                float angle = (time + position.x) * freq;
                transformed.z += sin(angle) * amp;
                objectNormal = normalize(vec3(-amp * freq * cos(angle), 0.0, 1.0));
                vNormal = normalMatrix * objectNormal;
        `
        shader.vertexShader = shader.vertexShader.replace(token, customTransform);
        matShader = shader;
    }
    scene.add(plane);
}

function addLights()
{
    var light = new THREE.AmbientLight(0xffffff, 1.0);
    //var light1 = new THREE.PointLight(0xfffff, 1.0);
    light.position.set(0, 15, 0);
    //light1.position.set(0, 5, -25);
    scene.add(light);
    //scene.add(light1);
}

function animate(time) 
{
    requestAnimationFrame(animate);
    if(matShader) matShader.uniforms.time.value = time/1000;
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
            vec3 newPosition = position + normal * 6.0 * heightColor.r;
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