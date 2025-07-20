chrome.runtime.onMessage.addListener(async (message, sender) => {
    if (message.playSound) {

        const hasOffscreen = await chrome.offscreen.hasDocument()
        
        if (!hasOffscreen) {
            await chrome.offscreen.createDocument({
                url: 'offscreen/offscreen.html',
                reasons: [chrome.offscreen.Reason.AUDIO_PLAYBACK],
                justification: 'play sound on 314 detection'
            })
        }

        chrome.runtime.sendMessage({ action: 'dingTheBell', holy: message.holy || false })

    }
})