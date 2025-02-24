document.addEventListener("DOMContentLoaded", function () {
    const params = new URLSearchParams(window.location.search);
    const videoSrc = params.get("video");

    const imgElement = document.getElementById("previewImage");
    const videoElement = document.getElementById("previewVideo");
    const convertBtn = document.getElementById("convertGif");

    if (videoSrc) {
        videoElement.src = videoSrc;
    }

    convertBtn.addEventListener("click", async () => {
        await convertVideoToGif(videoElement);
    });

    async function convertVideoToGif(video) {
        const canvas = document.createElement("canvas");
        const ctx = canvas.getContext("2d", { willReadFrequently: true });
        canvas.width = video.videoWidth;
        canvas.height = video.videoHeight;

        const gif = new GIF({
            workers: 2,
            quality: 10,
            workerScript: "external/gif.worker.js"
        });

        video.play();
        let frameCount = 0;
        const interval = setInterval(() => {
            if (frameCount >= video.duration * 10) {
                clearInterval(interval);
                gif.render();
                return;
            }

            ctx.drawImage(video, 0, 0);
            gif.addFrame(canvas, { copy: true, delay: 100 });

            frameCount++;
        }, 100);

        gif.on("finished", blob => {
            imgElement.src = URL.createObjectURL(blob);
        });
    }

    function downloadGif(blob) {
        const url = URL.createObjectURL(blob);
        const a = document.createElement("a");
        a.href = url;
        a.download = "output.gif";
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
    }
});
