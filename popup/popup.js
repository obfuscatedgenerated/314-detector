const checkbox = document.getElementById("soundToggle");

chrome.storage.sync.get(["playSound"], (result) => {
    checkbox.checked = result.playSound ?? true; //default on LMAO
});

checkbox.addEventListener("change", () => {
    chrome.storage.sync.set({ playSound: checkbox.checked });
});
