'use strict';

angular.module('NovaApp').directive('ngWebgl', function () {
    return {
      restrict: 'A',
      scope: { 
        'width': '=',
        'height': '=',
        'fillcontainer': '=',
        'scale': '=',
        'materialType': '='
      },
      link: function postLink(scope, element, attrs) {

        var camera, scene, renderer,
          shadowMesh, icosahedron, light,
          mouseX = 0, mouseY = 0,
          contW = (scope.fillcontainer) ? 
            element[0].clientWidth : scope.width,
          contH = scope.height, 
          windowHalfX = contW / 2,
          windowHalfY = contH / 2,
          materials = {};


        scope.init = function () {

          // Camera
          camera = new THREE.PerspectiveCamera( 20, contW / contH, 1, 10000 );
          camera.position.z = 1800;

          // Scene
          scene = new THREE.Scene();

          // Ligthing
          light = new THREE.DirectionalLight( 0xffffff );
          light.position.set( 0, 0, 1 );
          scene.add( light );

          var canvas = document.createElement( 'canvas' );
          canvas.width = 900;
          canvas.height = 900;

          var context = canvas.getContext( '2d' );
          var gradient = context.createRadialGradient( canvas.width / 2, canvas.height / 2, 0, canvas.width / 2, canvas.height / 2, canvas.width / 2 );

          gradient.addColorStop( 0.1, 'rgba(200,200,200,1)' );
          gradient.addColorStop( 1, 'rgba(255,255,255,1)' );

          context.fillStyle = gradient;
          context.fillRect( 0, 0, canvas.width, canvas.height );

          var shadowTexture = new THREE.Texture( canvas );
          shadowTexture.needsUpdate = true;

          var shadowMaterial = new THREE.MeshBasicMaterial( { 
            map: shadowTexture 
          } );
          var shadowGeo = new THREE.PlaneGeometry( 300, 300, 1, 1 );

          // Apply the shadow texture to a plane
          shadowMesh = new THREE.Mesh( shadowGeo, shadowMaterial );
          shadowMesh.position.y = - 250;
          shadowMesh.rotation.x = - Math.PI / 2;
          scene.add( shadowMesh );
          
          var faceIndices = [ 'a', 'b', 'c', 'd' ];

          var color, f, p, n, vertexIndex,
            radius = 200,
            geometry  = new THREE.IcosahedronGeometry( radius, 1 );


THREE.ImageUtils.crossOrigin = '';
/*var texture = ;
var nmobile = THREE.ImageUtils.loadTexture('http://novavision-soft.com/novafile/2014/10/articles.jpg');*/
var nsoft =   THREE.ImageUtils.loadTexture('clients.jpg');
    

          materials.novait = new THREE.MeshLambertMaterial({ 
                ambient: 0x808080,
   map: THREE.ImageUtils.loadTexture('http://i.imgur.com/AD25lq3.jpg'),
    specular: 0xFFFFFF,
    shininess: 30,
    shading: THREE.FlatShading,
          });

          materials.novamobile = new THREE.MeshLambertMaterial({ 
       ambient: 0x808080,
    map: THREE.ImageUtils.loadTexture('http://i.imgur.com/VsYeaD1.jpg'),
    specular: 0xFFFFFF,
    shininess: 30,
    shading: THREE.FlatShading,
          });

materials.novasoft = new THREE.MeshLambertMaterial({ 
       ambient: 0x808080,
    map: THREE.ImageUtils.loadTexture('http://i.imgur.com/Jba6UxA.jpg'),
    specular: 0xFFFFFF,
    shininess: 30,
    shading: THREE.FlatShading,
          });

    

          // Build and add the icosahedron to the scene
          icosahedron = new THREE.Mesh( geometry, materials[scope.materialType] );
          icosahedron.position.x = 0;
          icosahedron.rotation.x = 0;
          scene.add( icosahedron );

          renderer = new THREE.WebGLRenderer( { antialias: true } );
          renderer.setClearColor( 0xffffff );
          renderer.setSize( contW, contH );

          // element is provided by the angular directive
          element[0].appendChild( renderer.domElement );

          document.addEventListener( 'mousemove', scope.onDocumentMouseMove, false );

          window.addEventListener( 'resize', scope.onWindowResize, false );

        };

        // -----------------------------------
        // Event listeners
        // -----------------------------------

        scope.onDocumentMouseMove = function ( event ) {

          mouseX = ( event.clientX - windowHalfX );
          mouseY = ( event.clientY - windowHalfY );

        };

  
        scope.resizeObject = function () {

          icosahedron.scale.set(scope.scale, scope.scale, scope.scale);
          shadowMesh.scale.set(scope.scale, scope.scale, scope.scale);

        };

        scope.changeMaterial = function () {

          icosahedron.material = materials[scope.materialType];

        };


        // -----------------------------------
        // Draw and Animate
        // -----------------------------------
        scope.animate = function () {

          requestAnimationFrame( scope.animate );

          scope.render();

        };

        scope.render = function () {

          camera.position.x += ( mouseX - camera.position.x ) * 0.9;
          camera.position.y += ( - mouseY - camera.position.y ) * 0.9;

          camera.lookAt( scene.position );

          renderer.render( scene, camera );

        };

        // -----------------------------------
        // Watches
        // -----------------------------------
        scope.$watch('fillcontainer + width + height', function () {

          scope.resizeCanvas();
        
        });

        scope.$watch('scale', function () {
        
          scope.resizeObject();
        
        });

        scope.$watch('materialType', function () {
        
          scope.changeMaterial();
        
        });

        // Begin
        scope.init();
        scope.animate();

      }
    };
  });
