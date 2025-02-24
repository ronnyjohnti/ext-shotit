

(async function () {
    try {
        const stream = await navigator.mediaDevices.getDisplayMedia({ video: true });
        const recorder = new MediaRecorder(stream, { mimeType: "video/webm" });
        let chunks = [];

        recorder.ondataavailable = (event) => {
            if (event.data.size > 0) {
                chunks.push(event.data);
            }
        };

        console.log(chunks);

        recorder.onstop = () => {
            const videoBlob = new Blob(chunks, { type: "image/webp" });
            const videoUrl = URL.createObjectURL(videoBlob);

            chrome.runtime.sendMessage({videoUrl, action: "preview_video"});

            stream.getTracks().forEach(track => track.stop());
        };

        recorder.start();

        // Stop recording after 5 seconds
        setTimeout(() => recorder.stop(), 5000);
    } catch (error) {
        console.error("Error starting screen recording:", JSON.stringify(error));
    }
})();
