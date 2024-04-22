import { Scene } from "phaser";

export class Game extends Scene {
  constructor() {
    super("Game");
  }

  create() {
    const { width, height } = this.scale;

    const background = this.add.image(width / 2, height / 2, "background");
    background.setDisplaySize(width, height);

    this.bun = this.physics.add.sprite(width / 2, height - 100, "bun");
    this.bun.setCollideWorldBounds(true);
    this.bun.setScale(0.5);
    this.bun.setCircle(this.bun.width / 2);

    this.cursors = this.input.keyboard.createCursorKeys();

    this.ground = this.physics.add.staticGroup();
    const groundHeight = height - 20;
    this.ground
      .create(width / 2, groundHeight, null)
      .setOrigin(0.5, 1)
      .refreshBody()
      .setSize(width, 20)
      .setVisible(false);

    this.coins = this.physics.add.group();
    this.spawnCoins();

    this.physics.add.collider(
      this.coins,
      this.ground,
      this.handleCoinGroundCollision,
      null,
      this,
    );

    this.physics.add.overlap(
      this.bun,
      this.coins,
      this.collectCoin,
      null,
      this,
    );

    this.bombs = this.physics.add.group();
    this.spawnBombs();

    this.physics.add.collider(
      this.bombs,
      this.ground,
      this.hitGround,
      null,
      this,
    );

    this.physics.add.collider(this.bun, this.bombs, this.hitBomb, null, this);

    this.score = 0;
    this.scoreText = this.add.text(16, 16, "Score: 0", {
      fontSize: "32px",
      fill: "#ffffff",
    });
  }

  update() {
    const onGround = this.physics.overlap(this.bun, this.ground);

    if (this.cursors.left.isDown) {
      this.bun.setVelocityX(-1000);
    } else if (this.cursors.right.isDown) {
      this.bun.setVelocityX(1000);
    } else {
      this.bun.setVelocityX(0);
    }

    if (this.cursors.up.isDown && onGround) {
      this.bun.setVelocityY(-1000);
    } else if (!onGround) {
      this.bun.setVelocityY(this.bun.body.velocity.y + 30);
    }

    if (this.cursors.down.isDown && !onGround) {
      this.bun.setVelocityY(this.bun.body.velocity.y + 100);
    }

    this.checkForCoinRespawn();

    const allBombsHitGround = this.bombs.countActive(true) === 0;
    if (allBombsHitGround) {
      this.spawnBombs();
    }

    this.bombs.children.iterate((bomb) => {
      if (bomb.y > this.scale.height && bomb.active) {
        bomb.disableBody(true, true);
        bomb.setActive(false).setVisible(false);
      }
    });
  }

  collectCoin(bun, coin) {
    coin.disableBody(true, true);
    this.score += 10;
    this.scoreText.setText("Score: " + this.score);

    if (this.coins.countActive(true) === 0) {
      this.spawnCoins();
    }
  }

  hitGround(bomb) {
    bomb.setActive(false).setVisible(false);
    bomb.disableBody(true, true);
    this.checkBombs();
  }

  checkBombs() {
    if (this.bombs.countActive(true) === 0) {
      this.spawnBombs();
    }
  }

  toggleGrayscale(on) {
    this.game.canvas.style.filter = on ? "grayscale(100%)" : "none";
  }

  hitBomb() {
    this.toggleGrayscale(true);
    this.physics.pause();

    let currentHighScore = this.game.registry.get("highScore") || 0;
    if (this.score > currentHighScore) {
      this.game.registry.set("highScore", this.score);
    }

    setTimeout(() => {
      this.toggleGrayscale(false);
      this.scene.start("GameOver", { score: this.score });
    }, 2000);
  }

  spawnBombs() {
    const width = this.scale.width;
    const numBombs = Phaser.Math.Between(1, 10);
    for (let i = 0; i < numBombs; i++) {
      let x = Phaser.Math.Between(50, width - 50);
      let y = Phaser.Math.Between(0, 100);
      let bomb = this.bombs.create(x, y, "bomb");
      bomb.setScale(0.5);
      bomb.setCircle(bomb.width / 2);
      bomb.setVelocity(
        Phaser.Math.Between(-400, 400),
        Phaser.Math.Between(100, 500),
      );
    }
  }

  spawnCoins() {
    const width = this.scale.width;
    for (let i = 0; i < Phaser.Math.Between(1, 10); i++) {
      let x = Phaser.Math.Between(50, width - 50);
      let y = 0;
      let coin = this.coins.create(x, y, "coin");
      coin.setScale(0.2);
      coin.setBounce(0.5);
      coin.setCollideWorldBounds(true);
      coin.setVelocity(
        Phaser.Math.Between(-400, 400),
        Phaser.Math.Between(100, 500),
      );
    }
  }

  handleCoinGroundCollision(coin) {
    if (!coin.getData("removing")) {
      coin.setData("removing", true);
      this.time.delayedCall(2000, () => {
        coin.disableBody(true, true);
        coin.setData("removing", false);
      });
    }
  }

  checkForCoinRespawn() {
    if (this.coins.countActive(true) === 0) {
      this.spawnCoins();
    }
  }
}
