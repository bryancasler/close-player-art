import { closeImagePopout, socketName } from "./main.js";

const COOKIE_KEY = `sharedImages_${game.user.id}`;
const MAX_IMAGES = game.settings.get("player-art-controls", "maxRecentImages") || 9;

// Core utility functions for image history
function getCookie(name) {
    const value = `; ${document.cookie}`;
    const parts = value.split(`; ${name}=`);
    if (parts.length === 2) return parts.pop().split(";").shift();
    return null;
}

function setCookie(name, value, days = 365 * 10) {
    const expires = new Date(Date.now() + days * 24 * 60 * 60 * 1000).toUTCString();
    document.cookie = `${name}=${value}; expires=${expires}; path=/`;
}

function getImageHistory() {
    const cookie = getCookie(COOKIE_KEY);
    return cookie ? JSON.parse(decodeURIComponent(cookie)) : [];
}

function updateImageHistory(url) {
    if (!game.settings.get("player-art-controls", "enableHistory")) return;
    
    let history = getImageHistory();
    history = history.filter(item => item !== url);
    history.unshift(url);
    history = history.slice(0, MAX_IMAGES);
    setCookie(COOKIE_KEY, encodeURIComponent(JSON.stringify(history)));
}

function createThumbnailGrid() {
    const history = getImageHistory();
    return history.map(url => 
        `<div class="thumbnail">
            <img src="${url}" class="history-thumb" data-url="${url}" 
                 loading="lazy" title="${url}" />
        </div>`
    ).join("");
}

function debounce(func, wait) {
    let timeout;
    return function executedFunction(...args) {
        const later = () => {
            clearTimeout(timeout);
            func(...args);
        };
        clearTimeout(timeout);
        timeout = setTimeout(later, wait);
    };
}

async function imageMessage(url, dialog) {
    try {
        if (!url) {
            ui.notifications.warn(game.i18n.localize("player-art-controls.notifications.invalidUrl"));
            return;
        }

        const popout = new ImagePopout(url).render(true);
        await popout.shareImage();

        updateImageHistory(url);
        dialog.close();
    } catch (error) {
        ui.notifications.error(`${game.i18n.localize("player-art-controls.notifications.shareError")}: ${error.message}`);
        console.error("Player Art Controls | Error sharing image:", error);
    }
}

export function showArtControlDialog() {
    const showHistory = game.settings.get("player-art-controls", "enableHistory");
    
    let dialogContent = `
        <style>
            .share-image-dialog {
                font-family: Arial, sans-serif;
                padding: 1rem;
            }
            .close-all-button {
                background: #dc3545;
                color: white;
                padding: 0.5rem 1rem;
                border-radius: 4px;
                margin-bottom: 1rem;
                text-align: center;
                cursor: pointer;
            }
            .close-all-button:hover {
                background: #c82333;
            }
            .share-image-dialog input[type="text"] {
                width: 100%;
                padding: 0.75rem;
                margin-bottom: 1rem;
                border: 2px solid black;
                border-radius: 4px;
                box-sizing: border-box;
            }
            .file-picker {
                text-align: center;
                font-weight: bold;
                cursor: pointer;
                margin-bottom: 1rem;
            }
            #history-grid {
                display: grid;
                grid-template-columns: repeat(3, 1fr);
                gap: 0.5rem;
                margin-top: 1rem;
            }
            .thumbnail {
                display: block;
                text-align: center;
                cursor: pointer;
                width: 100%;
                padding-top: 100%;
                position: relative;
            }
            .thumbnail img {
                position: absolute;
                top: 0;
                left: 0;
                width: 100%;
                height: 100%;
                object-fit: cover;
                border: 1px solid #ccc;
                border-radius: 4px;
                box-shadow: 0 2px 5px rgba(0, 0, 0, 0.1);
            }
            .thumbnail img:hover {
                box-shadow: 0 4px 10px rgba(0, 0, 0, 0.2);
            }
        </style>
        <div class="share-image-dialog">
            <div class="close-all-button" id="close-all-images">
                ${game.i18n.localize("player-art-controls.dialog.closeAll")}
            </div>
            <input name="url" type="text" placeholder="${game.i18n.localize("player-art-controls.dialog.urlPlaceholder")}"/>
            <div class="file-picker" id="filepicker-button">
                ${game.i18n.localize("player-art-controls.dialog.filePicker")}
                <span class="file-picker-icon">📁</span>
            </div>
            ${showHistory ? `
                <div id="history-grid">
                    ${createThumbnailGrid()}
                </div>
            ` : ''}
        </div>
    `;

    const d = new Dialog({
        title: game.i18n.localize("player-art-controls.dialog.title"),
        content: dialogContent,
        buttons: {},
        render: (html) => {
            // Close all images button
            html.find("#close-all-images").on("click", () => {
                try {
                    const success = closeImagePopout();
                    game.socket.emit(socketName, { userId: game.user.id });
                    if (success) {
                        ui.notifications.info(game.i18n.localize("player-art-controls.notifications.closeSuccess"));
                    }
                } catch (error) {
                    console.error("Player Art Controls | Error in close all:", error);
                }
            });

            // URL input handler with debounce
            html.find("[name=url]").on("input", debounce(async (event) => {
                try {
                    const url = event.target.value;
                    if (url) {
                        await imageMessage(url, d);
                    }
                } catch (error) {
                    console.error("Player Art Controls | Error in URL input:", error);
                }
            }, 300));

            // File picker handler
            html.find("#filepicker-button").on("click", () => {
                new FilePicker({
                    type: "image",
                    callback: async (path) => {
                        await imageMessage(path, d);
                    },
                }).render(true);
            });

            // History thumbnails handler
            if (showHistory) {
                html.find("#history-grid").on("click", ".history-thumb", async (event) => {
                    const url = event.target.dataset.url;
                    if (url) {
                        await imageMessage(url, d);
                    }
                });
            }
        }
    });
    d.render(true);
} 