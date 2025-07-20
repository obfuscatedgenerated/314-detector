chrome.runtime.onMessage.addListener((message, sender) => {
    if (message.action === 'dingTheBell') {
        const path = message.holy ? 'audio/holy_314.mp3' : 'audio/bell_ding.mp3';
        const audio = new Audio(chrome.runtime.getURL(path))
        audio.volume = 0.4
        audio.play().catch(console.error)
    }
})
