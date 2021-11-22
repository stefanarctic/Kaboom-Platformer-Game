
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
		PlayerHealth(),
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
		// if(isKeyReleased("f")) {
		// 	Shoot();
		// }
		// for(let i = 0; i < bullets.length; i++) {
		// 	bullets[i].pos.x += playerDirection * bulletSpeed;
		// }
	});

	function PlayerHealth() {
		let enabled = true;
		return {
			id: "PlayerHealth",
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
			UpdateUI() {
				playerHealthUI.text = `Health: ${this.health}`;
			},
			GainHealth(amount) {
				this.health += amount;
				if(this.health > this.maxhealth) {
					this.resetHealth();
				}
				this.UpdateUI();
			},
			TakeDamage(amount) {
				this.health -= amount;
				if(this.health < 0) {
					this.health = 0;
					this.Die();
				}
				this.UpdateUI();
			}
		}
	}

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
			UpdateUI() {
				this.healthUI.text = `Health: ${this.health}`;
				if(this.health === 0) destroy(this.healthUI);
			},
			GainHealth(amount) {
				this.health += amount;
				if(this.health > this.maxhealth) {
					this.resetHealth();
				}
				this.UpdateUI();
			},
			TakeDamage(amount) {
				this.health -= amount;
				if(this.health < 0) {
					this.health = 0;
					this.Die();
				}
				this.UpdateUI();
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

	let enemies = [];

	function SpawnEnemy() {
		const enemy = add([
			sprite("ghost"),
			pos(width() - 200, player.pos.y),
			scale(1),
			area(),
			body(),
			EnemyHealth(),
			"enemy"
		]);
		const followOffset = vec2(-50, -40);
		const enemyHealthUI = add([
			pos(),
			// origin("center"),
			follow(enemy, followOffset),
			text("Health"),
			scale(0.3)
		]);
		enemy.healthUI = enemyHealthUI;
		enemy.UpdateUI();
		enemy.onUpdate(() => {
			enemyHealthUI.follow.offset = followOffset;
		})
		enemies.push(enemy);
	}

	SpawnEnemy();

	// onKeyDown("f", () => {
	// 	Shoot();
	// });

	// UI
	const playerHealthUI = add([
		pos(12, 12),
		scale(0.5),
		text("Health: ")
	]);

	player.UpdateUI();
});

const init = (() => {
	go("game");
})();
