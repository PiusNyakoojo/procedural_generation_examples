var gridSize = 100;
var unitSize = 1;
var gridObjects = [];

var oldPlayerUnitX;
var oldPlayerUnitY;
var playerUnitX;
var playerUnitY;
var topLeft = { x: 0, y: 0 };
var i, j;
var row, col;

var geo = new THREE.SphereGeometry( 1 );

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

	 //return true;

	/*
	if ( Math.abs( x ) == Math.abs( y ) )
		return true;
	*/

	/*
	if ( Math.floor( Math.sin( y ) ) ==  x )
		return true;
	*/

	/*
	if ( Math.floor( Math.sin( Math.pow( x, 2 ) + Math.pow( y, 2 ) ) / unitSize ) == Math.floor( Math.cos( x * y ) / unitSize ) )
		return true;
	*/

	/*
	if ( Math.floor( Math.tan( y ) ) == x )
		return true;
	*/

	
	if ( Math.floor( Math.tan( y ) / unitSize ) == Math.floor( Math.tan( x ) / unitSize ) )
		return true;
	

	// planet distribution function (pdf)

	 return false;
	
}

function mathsTextureFunction( x, y ) { // maths function to determine texture of planet

	if ( Math.abs( x ) <= unitSize * 2 && Math.abs( y ) <= unitSize * 2 )
		return 0x00ff00; // green

	return 0xff0000; // red
}

function generatePlanet( r, c, x, y ) {

	var mat = new THREE.MeshBasicMaterial( { color: mathsTextureFunction( x, y ) } );
	gridObjects[r][c] = new THREE.Mesh( geo, mat );

	gridObjects[r][c].position.x = x;
	gridObjects[r][c].position.z = y;

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