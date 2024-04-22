import { Scene } from "phaser";

export class MainMenu extends Scene {
  constructor() {
    super("MainMenu");
  }

  create() {
    const { width, height } = this.sys.game.config;
    const showOverlay = this.game.registry.get("showOverlay");

    const background = this.add.image(width / 2, height / 2, "background");
    background.setDisplaySize(width, height);

    const highScore = this.game.registry.get("highScore") || 0;

    const highScoreText = this.add.text(16, 16, `High Score: ${highScore}`, {
      fontSize: 32,
      color: "#ffffff",
      align: "left",
    });

    const playText = this.add
      .text(width / 2, height / 2, "Play", {
        fontSize: 40,
        color: "#ffffff",
        stroke: "#000000",
        strokeThickness: 8,
        align: "center",
      })
      .setOrigin(0.5)
      .setInteractive();

    const modal = this.add.graphics();
    modal.fillStyle(0x000000, 0.8);
    modal.fillRect(0, 0, width, height);

    const infoText = this.add
      .text(
        width / 2,
        height / 2 - 100,
        "Welcome to Bun's Road to Riches!\n\nUse the arrow keys to move Bun around and collect coins.\n\nAvoid the bombs!\n\nGood luck!",
        {
          fontSize: 24,
          color: "#ffffff",
          align: "center",
          wordWrap: { width: width - 100 },
        },
      )
      .setOrigin(0.5);

    const closeButton = this.add
      .text(width / 2, height / 2 + 100, "Close", {
        fontSize: 32,
        color: "#000000",
        backgroundColor: "#ffffff",
        padding: {
          left: 10,
          right: 10,
          top: 5,
          bottom: 5,
        },
      })
      .setOrigin(0.5)
      .setInteractive();

    if (showOverlay === false) {
      modal.setVisible(false);
      infoText.setVisible(false);
      closeButton.setVisible(false);
    } else {
      modal.setVisible(true);
      infoText.setVisible(true);
      closeButton.setVisible(true);
    }

    closeButton.on("pointerdown", () => {
      modal.setVisible(false);
      infoText.setVisible(false);
      closeButton.setVisible(false);
      this.game.registry.set("showOverlay", false);
    });

    this.game.registry.set("showOverlay", true);

    playText.on("pointerdown", () => {
      if (!modal.visible) {
        this.scene.start("Game");
      }
    });
  }
}
