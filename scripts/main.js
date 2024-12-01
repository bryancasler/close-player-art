import constants from "../Constants.js";
import { showArtControlDialog } from "./artControls.js";

const socketName = `module.${constants.modName}`;
let keyPressListener = null;

const closeImagePopout = () => {
    try {
        const imagePopout = document.querySelector(".image-popout a.close");
        if (imagePopout) {
            imagePopout.click();
            return true;
        }

        const journalPopout = document.querySelector(".journal-sheet a.close");
        if (journalPopout) {
            journalPopout.click();
            return true;
        }

        return false;
    } catch (error) {
        console.error("Player Art Controls | Error closing popout:", error);
        return false;
    }
};

Hooks.once('init', () => {
    console.log('Player Art Controls | Initializing');
    
    game.settings.register(constants.modName, "hotkey", {
        name: `${constants.modName}.settings.hotkey.name`,
        hint: `${constants.modName}.settings.hotkey.hint`,
        scope: "world",
        config: true,
        default: "`",
        type: String,
    });

    game.settings.register(constants.modName, "maxRecentImages", {
        name: `${constants.modName}.settings.maxRecentImages.name`,
        hint: `${constants.modName}.settings.maxRecentImages.hint`,
        scope: "world",
        config: true,
        default: 9,
        type: Number,
        range: {
            min: 1,
            max: 20,
            step: 1
        }
    });

    game.settings.register(constants.modName, "enableHistory", {
        name: `${constants.modName}.settings.enableHistory.name`,
        hint: `${constants.modName}.settings.enableHistory.hint`,
        scope: "world",
        config: true,
        default: true,
        type: Boolean
    });
});

Hooks.on("ready", () => {
    try {
        if (game.user.isGM) {
            // Setup hotkey listener to open modal
            keyPressListener = (e) => {
                if (
                    e.key == game.settings.get(constants.modName, "hotkey") &&
                    e.target.tagName.toUpperCase() != "INPUT" &&
                    e.target.tagName.toUpperCase() != "TEXTAREA"
                ) {
                    showArtControlDialog();
                }
            };
            document.addEventListener("keypress", keyPressListener);

            // Add scene control button
            const artControls = {
                name: "artControls",
                title: "Player Art Controls",
                icon: "fas fa-images",
                visible: game.user.isGM,
                onClick: () => showArtControlDialog(),
                button: true
            };

            Hooks.on("getSceneControlButtons", (controls) => {
                controls.find(c => c.name === "token").tools.push(artControls);
            });
        }

        // Socket handling
        game.socket.on(socketName, async (data) => {
            if (game.users.get(data?.userId)?.isGM) {
                const success = closeImagePopout();
                // Confirm back to GM that images were closed
                if (!game.user.isGM) {
                    game.socket.emit(`${socketName}.response`, {
                        userId: game.user.id,
                        success
                    });
                }
            }
        });

        // Handle responses from players
        if (game.user.isGM) {
            game.socket.on(`${socketName}.response`, (data) => {
                const username = game.users.get(data.userId)?.name || "Unknown";
                if (data.success) {
                    console.log(`Player Art Controls | Successfully closed images for ${username}`);
                } else {
                    console.warn(`Player Art Controls | Failed to close images for ${username}`);
                }
            });
        }
    } catch (error) {
        console.error("Player Art Controls | Error during initialization:", error);
    }
});

// Clean up when module is disabled
Hooks.once("closePlayerArtControls", () => {
    try {
        if (keyPressListener) {
            document.removeEventListener("keypress", keyPressListener);
        }
    } catch (error) {
        console.error("Player Art Controls | Error during cleanup:", error);
    }
});

export { closeImagePopout, socketName };
