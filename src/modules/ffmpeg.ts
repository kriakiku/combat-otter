import { paths, bins } from "ffmpeg-static-electron-forge";
import ffmpegWrapper, { ffprobe as ffprobeWrapper } from "fluent-ffmpeg";
import path from "path";

let ffmpegPath: string, ffprobePath: string;

if (process.env.NODE_ENV !== "development") {
  ffmpegPath = paths.ffmpegPath.replace("app.asar", "app.asar.unpacked");
  ffprobePath = paths.ffprobePath.replace("app.asar", "app.asar.unpacked");
} else {
  let ffmpegBinPaths = path.dirname(
    require.resolve("ffmpeg-static-electron-forge")
  );
  ffmpegBinPaths = path.resolve(process.cwd(), ffmpegBinPaths, "bin");
  ffmpegPath = path.join(ffmpegBinPaths, bins.ffmpegPath);
  ffprobePath = path.join(ffmpegBinPaths, bins.ffprobePath);
}

ffmpegWrapper.setFfmpegPath(ffmpegPath);
ffmpegWrapper.setFfprobePath(ffprobePath);

export const ffmpeg = ffmpegWrapper;
export const ffprobe = ffprobeWrapper;
