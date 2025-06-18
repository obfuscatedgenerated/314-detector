chrome.runtime.onMessage.addListener((message, sender) => {
    if (message.action === 'dingTheBell') {
        const audio = new Audio(chrome.runtime.getURL('audio/bell_ding.mp3'))
        audio.volume = 0.4
        audio.play().catch(console.error)
    }
})
