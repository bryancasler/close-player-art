# Player Art Controls

![GitHub release (latest by date and asset)](https://img.shields.io/github/downloads/gsimon2/player-art-controls/latest/module.zip)
![Foundry Version](https://img.shields.io/badge/dynamic/json?color=orange&label=Foundry%20Version&query=compatibility.verified&url=https%3A%2F%2Fraw.githubusercontent.com%2Fgsimon2%2Fplayer-art-controls%2Fmain%2Fmodule.json)
[![](https://img.shields.io/badge/Buy%20Me%20A%20Coffee-%243-blue)](https://www.buymeacoffee.com/gsimon2)

A comprehensive module for [FoundryVTT](https://foundryvtt.com/) that provides GMs with tools to manage player art displays and share images efficiently.

## Features

- **Quick Access**: Configurable hotkey (Default ` - backtick) to open the art control dialog
- **Image Management**: 
  - Close all open image popouts on player screens
  - Share new images via URL or file picker
  - Access recently shared images
- **Convenient Controls**: 
  - Scene controls button for quick access
  - Easy-to-use interface for all art management features
- **Recent Images History**: Keep track of recently shared images (configurable)

## Installation

1. In the Foundry VTT setup screen, go to the "Add-on Modules" tab
2. Click "Install Module"
3. Search for "Player Art Controls" or paste this manifest URL: 
   `https://github.com/gsimon2/player-art-controls/releases/latest/download/module.json`
4. Click "Install"

## Usage

### Opening the Art Control Dialog
There are two ways to access the art control dialog:
1. Press the configured hotkey (default: ` backtick)
2. Click the images icon in the scene controls

### Using the Dialog
The art control dialog provides several features:
1. **Close All Images**: Click the "Close All Player Images" button to close any open images on player screens
2. **Share New Images**:
   - Paste an image URL directly into the input field
   - Use the file picker to select images from your computer
3. **Recent Images**: Click on any thumbnail in the history to reshare that image

## Configuration

Module settings can be configured in the Module Settings menu:

- **Hotkey**: Change the dialog access hotkey (default: `)
- **Maximum Recent Images**: Set the number of images to keep in history (1-20)
- **Enable History**: Toggle the recent images feature

## Technical Details

### Error Handling
The module includes comprehensive error handling for:
- Image sharing
- Socket communications
- User interface interactions

### Performance
- Debounced URL input handling
- Lazy loading for image thumbnails
- Efficient socket communication with player confirmation

## Compatibility

- Minimum Foundry VTT version: 10
- Verified compatible with:
  - Foundry v10.x
  - Foundry v11.x
  - Foundry v12.x (early testing)

The module uses core Foundry features that have remained stable across these versions:
- Socket communications
- Image popouts
- Dialog system
- Scene controls

## Support

If you find this module helpful, consider buying me a coffee:

[![Buy Me A Coffee](https://img.shields.io/badge/Buy%20Me%20A%20Coffee-%243-blue)](https://www.buymeacoffee.com/gsimon2)

## Issues and Suggestions

If you encounter any issues or have suggestions for improvements, please [open an issue](https://github.com/gsimon2/player-art-controls/issues) on the GitHub repository.

## License

This project is licensed under the GNU General Public License v3.0 (GPLv3).

## Author

Created by Glen Simon (glen.a.simon@gmail.com)

## Changelog

See [CHANGELOG.md](./CHANGELOG.md) for version history.
