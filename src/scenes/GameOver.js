import { Scene } from "phaser";

export class GameOver extends Scene {
  constructor() {
    super("GameOver");
  }

  init(data) {
    this.finalScore = data.score;
  }

  create() {
    const { width, height } = this.sys.game.config;

    const background = this.add.image(width / 2, height / 2, "background");
    background.setDisplaySize(width, height);

    const highScore = this.game.registry.get("highScore") || 0;

    const highScoreText = this.add
      .text(width / 2, height / 2 - 175, `High Score: ${highScore}`, {
        fontSize: 40,
        color: "#ffffff",
        stroke: "#000000",
        strokeThickness: 8,
        align: "center",
      })
      .setOrigin(0.5);

    const scoreText = this.add
      .text(width / 2, height / 2 - 100, `Score: ${this.finalScore}`, {
        fontSize: 40,
        color: "#ffffff",
        stroke: "#000000",
        strokeThickness: 8,
        align: "center",
      })
      .setOrigin(0.5);

    const gameOverText = this.add
      .text(width / 2, height / 2, "Game Over!", {
        fontSize: 40,
        color: "#ffffff",
        stroke: "#000000",
        strokeThickness: 8,
        align: "center",
      })
      .setOrigin(0.5);

    const playAgainText = this.add
      .text(width / 2, height / 2 + 100, "Play Again", {
        fontSize: 35,
        color: "#ffffff",
        stroke: "#000000",
        strokeThickness: 8,
        align: "center",
      })
      .setOrigin(0.5)
      .setInteractive();

    const mainMenuText = this.add
      .text(width / 2, height / 2 + 175, "Main Menu", {
        fontSize: 35,
        color: "#ffffff",
        stroke: "#000000",
        strokeThickness: 8,
        align: "center",
      })
      .setOrigin(0.5)
      .setInteractive();

    mainMenuText.on("pointerdown", () => {
      this.game.registry.set("showOverlay", false);
      this.scene.start("MainMenu");
    });

    playAgainText.on("pointerdown", () => {
      this.scene.start("Game");
    });
  }
}
