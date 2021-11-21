// Input handling and basic player movement

// Start kaboom
kaboom()

// Load assets
loadSprite("bean", "/sprites/bean.png")
// loadSprite("ghost", "/sprites/ghosty.png")

// Define player movement speed (pixels per second)
const movementSpeed = 320;

scene("game", () => {

	const player = add([
		sprite("bean"),
		pos(center()),
		origin("center"),
		scale(1),
		area(),
		body(),
		"player"
	]);

	const ground = add([
	    rect(width(), 48),
	    pos(0, height() - 48),
	    outline(4),
	    area(),
	    solid(),
	    color(127, 200, 255),
		"ground"
	]);

	function Jump() {
		if(player.isGrounded()) {
			player.jump();
		}
	}

	onUpdate(() => {
		if(isKeyDown("right") || isKeyDown("d")) {
			player.move(movementSpeed, 0);
			player.flipX(false);
		}
		if(isKeyDown("left") || isKeyDown("a")) {
			player.move(-movementSpeed, 0);
			player.flipX(true);
		}
		if(isKeyDown("space") || isKeyDown("up")) {
			Jump();
		}
	})
	
});

const init = (() => {
	go("game");
})();
