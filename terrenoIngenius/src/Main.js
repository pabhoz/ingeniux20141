
	'use strict';
	
	Physijs.scripts.worker = 'libraries/physijs_worker.js';
	Physijs.scripts.ammo = '../js/ammo.js';
	
	var initScene, render, _boxes = [], spawnBox,
		renderer, render_stats, physics_stats, scene, ground_material, ground_materiales, ground, light, camera, mayor;
	
		var alturaPrueba = new Array();
		var w, h,skip;
		var file = "assets/processing/puntos/alturas.txt" ;

		var start = false;

var arregloPrueba= new Array();

var ultimoTiempo;
var teclaPulsada;
var teclaSoltada;


function webGLStart(){
	
/*
    //inicia leer.txt
    var rawFile = new XMLHttpRequest();
    var arregloPrueba= new Array();
    rawFile.open("GET", file, true);
    rawFile.onreadystatechange = function ()
    
    {
        if(rawFile.readyState === 4)
        {
            if(rawFile.status === 200 || rawFile.status == 0)
            {
                var allText = rawFile.responseText;
                var splitPrueba= allText.split(',');
                
                for (i=0; i < splitPrueba.length; i++){
                    alturaPrueba[i]= parseFloat(splitPrueba[i]);                        
                }
                
                var al= Math.round(Math.random()*7);


                alert(allText + " posición " + al + " es " + alturaPrueba[al]);
                arr = arregloPrueba;
            }
        }
    }
    rawFile.send(null);
    //termina leer.txt
*/

    //trae el archivo .txt
    //readTextFile(file);

    initScene();
	ultimoTiempo = Date.now();
	document.onkeydown = teclaPulsada;
	document.onkeyup = teclaSoltada;
	render();
    
    //alert(alturaPrueba[0]);
    //alert(" posición " + 0 + " es " + alturaPrueba[0]);

}


	initScene = function() {

		//cargar archivo txt
		//readTextFile("assets/alturas.txt");


	                alert("tamanio " + arregloPrueba.length +  " posición  2 es " + alturaPrueba[2]);

		var canvasWidth = window.innerWidth; //Asignamos 80% del ancho total
		var canvasHeight = window.innerHeight; // Asignamos 100% del ancho total
		//render.setSize(canvasWidth,canvasHeight); //Asignamos Ancho y Alto al renderer

		renderer = new THREE.WebGLRenderer({ antialias: true });
		renderer.setSize( canvasWidth, canvasHeight );
		renderer.shadowMapEnabled = true;
		renderer.shadowMapSoft = true;
		document.getElementById( 'viewport' ).appendChild( renderer.domElement );
		
		render_stats = new Stats();
		render_stats.domElement.style.position = 'absolute';
		render_stats.domElement.style.top = '0px';
		render_stats.domElement.style.zIndex = '100';
		document.getElementById( 'viewport' ).appendChild( render_stats.domElement );
		
		physics_stats = new Stats();
		physics_stats.domElement.style.position = 'absolute';
		physics_stats.domElement.style.top = '50px';
		physics_stats.domElement.style.zIndex = 100;
		document.getElementById( 'viewport' ).appendChild( physics_stats.domElement );

		scene = new Physijs.Scene;
		scene.setGravity(new THREE.Vector3( 0, -30, 0 ));
		scene.addEventListener(
			'update',
			function() {
				scene.simulate( undefined, 1 );
				physics_stats.update();
			}

			//alert("siza pos 0" + alturaPrueba[0]);
		);
		

		
		



		
		// Light
		light = new THREE.DirectionalLight( 0xFFFFFF );
		light.position.set( 20, 40, -15 );
		light.target.position.copy( scene.position );
		light.castShadow = true;
		light.shadowCameraLeft = -60;
		light.shadowCameraTop = -60;
		light.shadowCameraRight = 60;
		light.shadowCameraBottom = 60;
		light.shadowCameraNear = 20;
		light.shadowCameraFar = 200;
		light.shadowBias = -.0001
		light.shadowMapWidth = light.shadowMapHeight = 2048;
		light.shadowDarkness = .7;
		scene.add( light );
		
		// Ground
		ground_material = Physijs.createMaterial(
			new THREE.MeshLambertMaterial({ map: THREE.ImageUtils.loadTexture( 'assets/images/rocks.jpg' ) }),
			.8, // high friction
			.3 // low restitution
		);
		ground_material.map.wrapS = ground_material.map.wrapT = THREE.RepeatWrapping;
		ground_material.map.repeat.set( 3, 3 );

		
				//geometriaaaaaa
				var worldWidth = 256, worldDepth = 256;
				//data = generateHeight( worldWidth, worldDepth );
				var geometry = new THREE.PlaneGeometry( 640, 480,  95, 127 );
				geometry.applyMatrix( new THREE.Matrix4().makeRotationX( - Math.PI / 2 ) );

				mayor=0;
				var menor=2000;


				console.log("esta vuelta es esto" + geometry.vertices.length);
				

				for ( var i = 0, l = geometry.vertices.length; i < l; i ++ ) {

					var alturax=alturaPrueba[i];

					geometry.vertices[ i ].y = alturax;
					if(mayor<(alturax)){
						mayor=alturax;
 
					}
					if(menor>(alturax)){
						menor=alturax;
					}
									
				}

				var capas=16;
				var escal_color=0.50/capas;
				var escal = (mayor-menor)/capas;
				console.log(mayor);
				console.log(menor);
				console.log(escal);
							

				var faceIndices = [ 'a', 'b', 'c'];
				var vertexIndex;

 	
	    	for (i = 0; i < geometry.faces.length; i++) {
	    	
	        	for( var j = 0; j < 3; j++ ) {

        		vertexIndex = geometry.faces[ i ][ faceIndices[ j ] ];
        		var cont_color=0.0;

        		for(var t=0; t<capas; t++){

        			if(((geometry.vertices[vertexIndex].y)>=(menor+(escal*t)))&&((geometry.vertices[vertexIndex].y)<=(menor+escal*(t+1)))){
                    geometry.faces[i].vertexColors[j] = new THREE.Color().setHSL((cont_color), (1.0), (0.4));
        		}
        		cont_color+=escal_color;

        		}

       }
    }
                
                var materials = [

					new THREE.MeshBasicMaterial({vertexColors:THREE.VertexColors, side:THREE.DoubleSide }),
					new THREE.MeshBasicMaterial( { color: 0x000000, shading: THREE.FlatShading, wireframe: true, transparent: true } )

				];

				var group1 = THREE.SceneUtils.createMultiMaterialObject( geometry, materials );
				group1.rotation.z=-Math.PI;
				group1.rotation.y=-Math.PI;
				scene.add( group1 );
				

    ground_materiales = Physijs.createMaterial(
			new THREE.MeshLambertMaterial({vertexColors:THREE.VertexColors, side:THREE.DoubleSide, wireframe:true }),
			.8, // high friction
			.3 // low restitution
		);

		
		ground = new Physijs.ConvexMesh(
			geometry,
			ground_materiales,
			0
			
		);
		ground.receiveShadow = true;
		//ground.position.y = -40;
		//ground.rotation.x = -0.5*Math.PI;
		
		ground.rotation.z=-Math.PI;
		ground.rotation.y=-Math.PI;
		scene.add( ground );

		camera = new THREE.PerspectiveCamera(
			35,
			window.innerWidth / window.innerHeight,
			1,
			1000
		);
		camera.position.set( 600, (mayor+100), 100 );
		camera.lookAt( ground.position );
		scene.add( camera );
		
		spawnBox();
		
		requestAnimationFrame( render );
		scene.simulate();
	};

	/*
	function generateHeight( width, height ) {

				var size = width * height, data = new Float32Array( size ),
				perlin = new ImprovedNoise(), quality = 1, z = Math.random() * 100;

				for ( var i = 0; i < size; i ++ ) {

					data[ i ] = 0

				}

				for ( var j = 0; j < 4; j ++ ) {

					for ( var i = 0; i < size; i ++ ) {

						var x = i % width, y = ~~ ( i / width );
						data[ i ] += Math.abs( perlin.noise( x / quality, y / quality, z ) * quality * 1.75 );


					}

					quality *= 5;

				}

				return data;

			}
	*/
	spawnBox = (function() {
		var box_geometry = new THREE.SphereGeometry( 2, 10, 10 ),
			handleCollision = function( collided_with, linearVelocity, angularVelocity ) {
				switch ( ++this.collisions ) {
					
					case 1:
						this.material.color.setHex(0xcc8855);
						break;
					
					case 2:
						this.material.color.setHex(0xbb9955);
						break;
					
					case 3:
						this.material.color.setHex(0xaaaa55);
						break;
					
					case 4:
						this.material.color.setHex(0x99bb55);
						break;
					
					case 5:
						this.material.color.setHex(0x88cc55);
						break;
					
					case 6:
						this.material.color.setHex(0x77dd55);
						break;
				}
			},
			createBox = function() {
				var box, material;
				
				material = Physijs.createMaterial(
					new THREE.MeshLambertMaterial({ map: THREE.ImageUtils.loadTexture( 'assets/images/plywood.jpg' ) }),
					.6, // medium friction
					.3 // low restitution
				);
				material.map.wrapS = material.map.wrapT = THREE.RepeatWrapping;
				material.map.repeat.set( .5, .5 );
				
				//material = new THREE.MeshLambertMaterial({ map: THREE.ImageUtils.loadTexture( 'images/rocks.jpg' ) });
				
				box = new Physijs.BoxMesh(
					box_geometry,
					material
				);
				box.collisions = 0;
				
				box.position.set(
					Math.random() * 15 - 7.5,
					mayor+15,
					Math.random() * 15 - 7.5
				);
				
				box.rotation.set(
					Math.random() * Math.PI,
					Math.random() * Math.PI,
					Math.random() * Math.PI
				);
				
				box.castShadow = true;
				box.addEventListener( 'collision', handleCollision );
				box.addEventListener( 'ready', spawnBox );
				scene.add( box );
			};
		
		return function() {
			setTimeout( createBox, 1000 );
		};
	})();
	
	render = function() {
		requestAnimationFrame( render );
		renderer.render( scene, camera );
		controlcamera.update();
		render_stats.update();
		
	};


	function animarScene(){
		requestAnimationFrame(animarScene)
	}

	function reloadScene(){


	}





	//(FUNCION QUE CARGA EL TXT ESTADO: PRUEBA
	function readTextFile(file)
	{
	    var rawFile = new XMLHttpRequest();
	    
	    rawFile.open("GET", file, true);
	    rawFile.onreadystatechange = function ()
	    {
	    	//console.log("trin1");
	        if(rawFile.readyState === 4)
	        {
	        	//console.log("trin1");
	            if(rawFile.status === 200 || rawFile.status == 0)
	            {
	            	//console.log("trin1");
	                var allText = rawFile.responseText;
	                var splitPrueba= allText.split(',');
	                for (var i=0; i < splitPrueba.length-3; i++){
	                    alturaPrueba[i]= parseFloat(splitPrueba[i+3])* 50;
	                }
	                
	                var al= Math.round(Math.random()*splitPrueba.length-1);
	                alert("tamanio splitPrueba" + splitPrueba.length + "- tamanio alturaPrueba " + alturaPrueba.length+  " posición " + al + " es " + alturaPrueba[al]);


	                if ( !start )
	                	webGLStart();
	            	start = true;
	            }
	        }

	    }
	    rawFile.send(null);
	}
	//window.onload = initScene;

	window.onload = readTextFile(file);








