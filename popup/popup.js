const soundToggle = document.getElementById("soundToggle");
const holyToggle = document.getElementById("holyToggle");

chrome.storage.sync.get(["playSound"], (result) => {
    soundToggle.checked = result.playSound ?? true; //default on LMAO
});

soundToggle.addEventListener("change", () => {
    chrome.storage.sync.set({ playSound: soundToggle.checked });
});

chrome.storage.sync.get(["holyDetect"], (result) => {
    holyToggle.checked = result.holyDetect ?? false; //default off LMAO (because its really annoying)
});

holyToggle.addEventListener("change", () => {
    chrome.storage.sync.set({ holyDetect: holyToggle.checked });
});
