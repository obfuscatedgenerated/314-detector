(function detect314() {

    //pattern allows for non word characters between the digits (e.g. 3.14, 31-4 etc.)
    const pattern = /3\W?1\W?4/g
    const true_314 = "314"
    const unsafeTags = ["script", "style", "textarea", "input", "button", "select", "option"]

    const nodes = []
    let foundAny = false
    let foundHoly = false

    function isSafeToMutate(node) {
        const parent = node.parentNode
        if (!parent) {
            return false
        }
        const tag = parent.nodeName.toLowerCase()
        return !unsafeTags.includes(tag)
    }

    function highlight(textNode) {
        // walking the dom gonna find a 314

        //skips if parent already has a data-314 marker
        if (textNode.parentNode?.dataset?.["314"] !== undefined) {
            return
        }

        const text = textNode.nodeValue
        const matches = [...text.matchAll(pattern)]

        if (matches.length === 0) return
        foundAny = true;

        // i found one 😈😈

        const frag = document.createDocumentFragment()
        let lastIndex = 0

        for (let match of matches) {

            if (match.index > lastIndex) {
                frag.appendChild(document.createTextNode(text.slice(lastIndex, match.index)))
            }

            let thisIsHoly = false
            if (match[0] === true_314) {
                thisIsHoly = true

                if (!foundHoly) {
                    // inject keyframes
                    const style = document.createElement("style")
                    style.textContent = `
                        @keyframes holy314 {
                            0% { background-color: yellow; color: black; }
                            100% { background-color: inherit; color: inherit; }
                        }
                        mark[data-314-holy] {
                            animation: holy314 1.5s infinite alternate;
                        }
                    `;
                    document.head.appendChild(style);
                }

                foundHoly = true
            }

            // CAN I GET A HIGH-LIGHT IN AN OPEN WINDOW
            const mark = document.createElement("mark")
            mark.textContent = match[0]
            mark.style.backgroundColor = "yellow"
            mark.style.color = "black"
            mark.dataset["314"] = "" //mark it so we skip this later
            if (thisIsHoly) {
                mark.dataset["314Holy"] = ""
            }
            frag.appendChild(mark)

            lastIndex = match.index + match[0].length
        }

        if (lastIndex < text.length) {
            frag.appendChild(document.createTextNode(text.slice(lastIndex)))
        }

        textNode.parentNode.replaceChild(frag, textNode)
    }

    function update() {
        nodes.length = 0
        foundAny = false
        foundHoly = false

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
                    chrome.runtime.sendMessage({ playSound: true, holy: foundHoly })
                }
            })
        }
    }

    //initial run for page load
    //this is all that's needed for static pages (e.g. wikipedia)
    update()

    //mutation observer to detect changes in the DOM
    //debounced to 500ms so it's not killing their pc
    //its not diff based so the whole dom gets scanned every time (skipping the existing 314s)
    let debounceTimer = null
    const observer = new MutationObserver(() => {
        if (debounceTimer) clearTimeout(debounceTimer)
        debounceTimer = setTimeout(() => {
            update()
        }, 500)
    })

    observer.observe(document.body, {
        childList: true,
        subtree: true,
        characterData: true
    })

})()
