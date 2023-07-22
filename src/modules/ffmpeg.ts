import ffmpegWrapper from "fluent-ffmpeg";
import { paths } from "ffmpeg-static-electron-forge";

ffmpegWrapper.setFfmpegPath(paths.ffmpegPath.replace("app.asar", "app.asar.unpacked"));
ffmpegWrapper.setFfprobePath(paths.ffprobePath.replace("app.asar", "app.asar.unpacked"));

export const ffmpeg = ffmpegWrapper;
