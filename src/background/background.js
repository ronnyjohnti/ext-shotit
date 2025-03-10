chrome.commands.onCommand.addListener((command) => {
    if (command === "record_video") {
        chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
            if (tabs.length === 0) return;
            chrome.scripting.executeScript({
                target: { tabId: tabs[0].id },
                files: ["content.js"]
            });
        });
    }
});

chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
    if (request.action === "preview_video") {
        chrome.windows.create({
            url: "preview.html?video=" + encodeURIComponent(request.videoUrl),
            type: "popup",
            state: "fullscreen",
            focused: true,
            // width: 600,
            // height: 400
        }, wind => {
            console.log(JSON.stringify(wind));
        });
    }
})
