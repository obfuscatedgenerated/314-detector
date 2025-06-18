(function detect314() {

    //pattern allows for non word characters between the digits (e.g. 3.14, 31-4 etc.)
    //might make a special highlight + sound for "true" 314s in the future
    const pattern = /3\W?1\W?4/g
    const unsafeTags = ["script", "style", "textarea", "input", "button", "select", "option"]

    const nodes = []
    let foundAny = false

    function isSafeToMutate(node) {
        const parent = node.parentNode
        if (!parent) {
            return false
        }
        const tag = parent.nodeName.toLowerCase()
        return !unsafeTags.includes(tag)
    }

    function highlight(textNode) {
        const text = textNode.nodeValue
        const matches = [...text.matchAll(pattern)]

        if (matches.length === 0) return
        foundAny = true;
        
        const frag = document.createDocumentFragment()
        let lastIndex = 0

        for (let match of matches) {

            if (match.index > lastIndex) {
                frag.appendChild(document.createTextNode(text.slice(lastIndex, match.index)))
            }

            const mark = document.createElement("mark")
            mark.textContent = match[0]
            mark.style.backgroundColor = "yellow"
            mark.style.color = "black"
            frag.appendChild(mark)

            lastIndex = match.index + match[0].length
        }

        if (lastIndex < text.length) {
            frag.appendChild(document.createTextNode(text.slice(lastIndex)))
        }

        textNode.parentNode.replaceChild(frag, textNode)
    }

    
    const walker = document.createTreeWalker(document.body, NodeFilter.SHOW_TEXT, {
        acceptNode: node => {
            return pattern.test(node.nodeValue) && isSafeToMutate(node) ? NodeFilter.FILTER_ACCEPT : NodeFilter.FILTER_SKIP
        }
    })

    while (walker.nextNode()) {
        nodes.push(walker.currentNode)
    }

    for (let node of nodes) {
        highlight(node)
    }

    //playing sound without user interaction is the most insane process (even though this is a browser extension the user chose to install)
    //sends a message to the background script which checks if the offscreen document is already created, if not it makes one
    //that sends a message to the offscreen document script to create an Audio element in the offscreen DOM, it plays that.
    //three extra files and a service worker. 
    if (foundAny) {
        chrome.storage.sync.get(["playSound"], (result) => {
            if (result.playSound ?? true) {
                chrome.runtime.sendMessage({ playSound: true })
            }
        })
    }

})()
