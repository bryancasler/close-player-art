import constants from "../Constants.js";

export const registerSettings = () => {
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
};
