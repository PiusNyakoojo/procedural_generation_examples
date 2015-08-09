var gridSize = 50;
var unitSize = 10;
var gridObjects = [];

var oldPlayerUnitX;
var oldPlayerUnitY;
var playerUnitX;
var playerUnitY;
var topLeft = { x: 0, y: 0 };
var i, j;
var row, col;

var geo = new THREE.BoxGeometry( 1, 1, 1 );
var color = "";
var scale;

function initGrid( x, y ) {

	oldPlayerUnitX = -Math.floor( y / unitSize );
	oldPlayerUnitY = -Math.floor( x / unitSize );

	playerUnitX = oldPlayerUnitX;
	playerUnitY = oldPlayerUnitY;

	topLeft.x = playerUnitX * unitSize - Math.floor( gridSize / 2 ) * unitSize;
	topLeft.y = playerUnitY * unitSize + Math.floor( gridSize / 2 ) * unitSize;

	initArray();

	generateGrid( x, y );

}

function generateGrid( x, y ) {

	updateGrid();

	for ( i = 0; i < gridSize * gridSize; i++ ) {

		row = Math.floor( i / gridSize );
		col = i % gridSize;

		tempX = topLeft.x + row * unitSize;
		tempY = topLeft.y - col * unitSize;

		if ( mathsLocationFunction( tempX, tempY ) && !gridObjects[row][col] ) {

			generatePlanet( row, col, tempX, tempY );

		}
	}
}

function mathsLocationFunction( x, y ) { // maths function to determine location of planet

	if ( ( x / unitSize ) % 5 == 0 || ( y / unitSize ) % 5 == 0 )
		return false;

	/*
	if ( Math.floor( Math.sin( x ) / unitSize ) == Math.floor( Math.cos( y ) / unitSize ) )
		return true;
	*/

	return true;
	
}

function mathsTextureFunction( x, y ) { // maths function to determine texture of planet

	color = "0x";
	
	color += "" + ( Math.floor( x / unitSize ) + 5 ) % 10 + "" + ( Math.floor( x / unitSize ) + 7 ) % 10; // r

	color += "" + ( Math.floor( y / unitSize ) + 4 ) % 10 + "" + ( Math.floor( y / unitSize ) + 2 ) % 10; // g

	color += "" + ( Math.floor( x / unitSize ) + 6 ) % 10 + "" + ( Math.floor( ( y * x ) / unitSize ) + 8 ) % 10; // b

	return color;
}

function mathsSizeFunction( x, y ) { // maths function to determine size of planet

	 return ( unitSize - 1 ) + 40 * Math.sin( x - y ) - 20 * Math.cos( y * x );
}

function generatePlanet( r, c, x, y ) {

	var mat = new THREE.MeshBasicMaterial( { color: parseInt( mathsTextureFunction( x, y ) ) } );
	gridObjects[r][c] = new THREE.Mesh( geo, mat );

	scale = mathsSizeFunction( x, y );

	gridObjects[r][c].scale.x = unitSize - 2;
	gridObjects[r][c].scale.z = unitSize - 2;
	gridObjects[r][c].scale.y = scale;

	gridObjects[r][c].position.x = x;
	gridObjects[r][c].position.z = y;
	gridObjects[r][c].position.y += Math.abs( scale / 2 );

	scene.add( gridObjects[r][c] );

}

function playerUnitChanged( x, y ) {

	playerUnitX = -Math.floor( y / unitSize );
	playerUnitY = -Math.floor( x / unitSize );

	if ( oldPlayerUnitX != playerUnitX || oldPlayerUnitY != playerUnitY )
		return true;

	return false;

}

function updateGrid() {
	

	if ( oldPlayerUnitX < playerUnitX ) { // moved right

		moveRight();
		topLeft.y -= unitSize;

	} else if ( oldPlayerUnitX > playerUnitX ) { // moved left

		moveLeft();
		topLeft.y += unitSize;

	}

	if ( oldPlayerUnitY < playerUnitY ) { // moved up

		moveUp();
		topLeft.x -= unitSize;

	} else if ( oldPlayerUnitY > playerUnitY ) { // moved down

		moveDown();
		topLeft.x += unitSize;

	}

	oldPlayerUnitX = playerUnitX;
	oldPlayerUnitY = playerUnitY;

}

function moveRight() {

	for ( i = 0; i < gridSize; i++ ) {
		if ( gridObjects[i][0] ) {
			scene.remove( gridObjects[i][0] );
			gridObjects[i][0] = null;
		}
	}
	
	for ( i = 0; i < gridSize; i++ ) {
		for ( j = 1; j < gridSize; j++ ) {
			gridObjects[i][j - 1] = gridObjects[i][j];
		}
	}
	
	for ( i = 0; i < gridSize; i++ ) {
		gridObjects[i][gridSize - 1] = null;
	}

}

function moveLeft() {

	for ( i = 0; i < gridSize; i++ ) { // remove old ( right most ) elements
		if ( gridObjects[i][gridSize - 1] ) {
			scene.remove( gridObjects[i][gridSize - 1] );
			gridObjects[i][gridSize - 1] = null;
		}
	}

	for ( i = gridSize * gridSize - 1; i >= 0; i-- ) { // shift elements to the right
		row = Math.floor( i / gridSize );
		col = i % gridSize;

		if ( col != gridSize - 1 )
			gridObjects[row][col + 1] = gridObjects[row][col];

	}

	for ( i = 0; i < gridSize; i++ ) { // nullify leading edge ( left edge )
		gridObjects[i][0] = null;
	}

}

function moveUp() {

	for ( i = 0; i < gridSize; i++ ) { // remove old ( bottom most ) elements
		if ( gridObjects[gridSize - 1][i] ) {
			scene.remove( gridObjects[gridSize - 1][i] );
			gridObjects[gridSize - 1][i] = null;
		}
	}

	for ( i = gridSize - 1; i > 0; i-- ) { // shift elements down
		for ( j = 0; j < gridSize; j++ ) {
			gridObjects[i][j] = gridObjects[i - 1][j];
		}
	}

	for ( i = 0; i < gridSize; i++ ) { // nullify leading edge ( upper edge )
		gridObjects[0][i] = null;
	}

}

function moveDown() {

	for ( i = 0; i < gridSize; i++ ) { // remove old ( top most ) elements
		if ( gridObjects[0][i] ) {
			scene.remove( gridObjects[0][i] );
			gridObjects[0][i] = null;
		}
	}

	for ( i = 1; i < gridSize; i++ ) { // shift elements up
		for ( j = 0; j < gridSize; j++ ) {
			gridObjects[i - 1][j] = gridObjects[i][j];
		}

	}

	for ( i = 0; i < gridSize; i++ ) { // nullify leading edge ( bottom edge )
		gridObjects[gridSize - 1][i] = null;
	}

}

function initArray() {

	for ( i = 0; i < gridSize; i++ ) {

		var array = [];

		for ( j = 0; j < gridSize; j++ ) {
			array.push( null );
		}

		gridObjects.push( array );
	}
}