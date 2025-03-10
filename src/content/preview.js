import { convertToGIF } from "./gif";

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
        // const gifBlob =
        // convertToGIF(video);
        const gif = await convertToGIF(video);

        gif.on('finish', async function (blob) {
            imgElement.src = gif.url ?? URL.createObjectURL(blob);
        });

        gif.render();

        console.log(imgElement.src);
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
