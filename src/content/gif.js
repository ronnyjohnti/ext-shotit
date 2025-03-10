import GIF from 'gif.js/dist/gif';

const canvas = document.createElement('canvas');
document.body.appendChild(canvas);
const ctx = canvas.getContext('2d', { willReadFrequently: true });

export async function convertToGIF(video) {
  if (!video) {
    throw Error('You must provide a video element, video blob or videoUrl');
  }

  const videoElement = video instanceof HTMLVideoElement ? video : document.createElement("video");
  if (!(video instanceof HTMLVideoElement)) {
    videoElement.src = typeof video === 'string' ? video : URL.createObjectURL(video);
  }

  await new Promise(resolve => {
    videoElement.onloadeddata = resolve;
  });

  canvas.width = videoElement.videoWidth;
  canvas.height = videoElement.videoHeight;

  const gif = new GIF({
    workers: 2,
    quality: 10,
    width: canvas.width,
    height: canvas.height,
  });

  return captureFrames(videoElement, gif);
}

function captureFrames(videoElement, gif) {
  const frameRate = 10; // frame rate para o GIF
  const interval = 1000 / frameRate; // intervalo de captura por frame
  let framesCaptured = 0;

  videoElement.currentTime = 0;

  const captureFrame = () => {
    if (videoElement.currentTime >= videoElement.duration) {
      gif.finish();
      return;
    }

    ctx.drawImage(videoElement, 0, 0, canvas.width, canvas.height);
    gif.addFrame(ctx, { copy: true, delay: interval });

    framesCaptured++;
    videoElement.currentTime += interval / 1000;

    if (framesCaptured * interval / 1000 < videoElement.duration) {
      setTimeout(captureFrame, interval);
    }
  };

  videoElement.onseeked = () => {
    if (framesCaptured === 0) {
      captureFrame();
    }
  };

  captureFrame();

  return gif;
}
