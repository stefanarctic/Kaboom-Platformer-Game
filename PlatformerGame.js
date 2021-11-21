
// Start kaboom
kaboom()

// Load assets
loadSprite("bean", "/sprites/bean.png")
loadSprite("ghost", "/sprites/ghosty.png")

// Define player movement speed (pixels per second)
const movementSpeed = 320;
const bulletSpeed = 640;

let playerDirection = RIGHT;

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
		"ground",
		"obstacle"
	]);

	const enemy = add([
		sprite("ghost"),
		pos(width() - 150, player.pos.y),
		scale(1),
		area(),
		body(),
		EnemyHealth(),
		"enemy"
	]);

	function Jump() {
		if(player.isGrounded()) {
			player.jump();
		}
	}

	onUpdate(() => {
		// Player Movement
		if(isKeyDown("right") || isKeyDown("d")) {
			player.move(movementSpeed, 0);
			player.flipX(false);
			playerDirection = RIGHT;
		}
		if(isKeyDown("left") || isKeyDown("a")) {
			player.move(-movementSpeed, 0);
			player.flipX(true);
			playerDirection = LEFT;
		}
		if(isKeyDown("space") || isKeyDown("up")) {
			Jump();
		}

		// // Shooting mechanic
		// for(let i = 0; i < bullets.length; i++) {
		// 	bullets[i].pos.x += playerDirection * bulletSpeed;
		// }
	});

	function EnemyHealth() {
		let enabled = true;
		return {
			id: "EnemyHealth",
			health: 100,
			maxhealth: 100,
			resetHealth() {
				this.health = this.maxhealth;
			},
			Die() {
				destroy(this);
			},
			add() {
				this.resetHealth();
			},
			GainHealth(amount) {
				this.health += amount;
				if(this.health > this.maxhealth) {
					this.resetHealth();
				}
			},
			TakeDamage(amount) {
				this.health -= amount;
				if(this.health < 0) {
					this.health = 0;
					this.Die();
				}
			}
		}
	}

	let bullets = []

	function Shoot() {
		const bullet = add([
			sprite("bean"),
			pos(player.pos),
			scale(0.5),
			area(),
			move(playerDirection, bulletSpeed),
			"bullet"
		]);
		bullet.onCollide("enemy", (enemy) => {
			enemy.TakeDamage(20);
			destroy(bullet);
		})
		bullets.push(bullet);
	}

	onClick(() => {
		Shoot();
	});
	
});

const init = (() => {
	go("game");
})();
