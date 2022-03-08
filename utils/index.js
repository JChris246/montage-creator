const ffmpeg = require("fluent-ffmpeg");

// adpated from
// https://github.com/JabbR/JabbR/blob/eb5b4e2f1e5bdbb1ea91230f1884716170a6976d/JabbR/Chat.utility.js#L50
export const guidGenerator = () => {
    const S4 = () => (((1 + Math.random()) * 0x10000) | 0).toString(16).substring(1);
    return (S4() + S4() + "-" + S4() + "-" + S4() + "-" + S4() + "-" + S4() + S4() + S4());
}

export const getVideoDuration = (a) => {
    return new Promise((resolve, reject) => {
        return ffmpeg.ffprobe(a, (err, metadata) => {
            if (err) return reject(err);

            const { duration } = metadata.streams[0];
            return resolve(duration);
        });
    });
};
