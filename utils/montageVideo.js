const path = require("path");
const fs = require("fs");
const ffmpeg = require("fluent-ffmpeg");

const { getVideoDuration, videoDir, tempDir } = require("./index");

const merge = async (list, outname) => {
    // create temp file to store list of items for ffmpeg to merge
    fs.writeFileSync(tempDir + "/l", list.reduce((acc, prev) => acc + "file '" + prev + "'\n", "").slice(0, -1));

    await new Promise((resolve, reject) => {
        return ffmpeg(tempDir + "/l")
            .inputOptions(["-f concat", "-safe 0"])
            .videoCodec("copy").audioCodec("copy")
            .output(outname)
            .on("end", (stdout, stderr) => resolve(stderr))
            .on("error", (err, stdout, stderr) => reject({ stderr, err }))
            .exec();
    });

    // remove temp file
    fs.rmSync(tempDir + "/l");
};

const cut = (video, start, duration, i) => {
    const ext = path.extname(video);
    const purename = path.basename(video).slice(0, -ext.length);
    const outname = tempDir + "/" + purename + " clip" + i + ext;

    return new Promise((resolve, reject) => {
        return ffmpeg()
            .input(video)
            .seekInput(start)
            .output(outname)
            .audioCodec("copy").videoCodec("copy")
            .setDuration(duration)
            .on("end", (stdout, stderr) => resolve({ stderr, name: outname }))
            .on("error", (err, stdout, stderr) => reject({ stderr, err }))
            .exec();
    });
};

export const createMontageVideo = async (res, video, options) => {
    if (!video.endsWith(".mp4")) video += ".mp4"

    // default params
    let params = { clips: 15, clipDuration: 1.5 };

    // use default params for options the user did not pass
    params = { ...params, ...options };

    const { clips: c, clipDuration: cd } = params;
    const clips = Number(c);
    const clipDuration = Number(cd);

    if (clips < 1) return res.status(400).json({ msg: "Invalid number of clips: " + clips });
    if (clipDuration < .5) return res.status(400).json({ msg: "Invalid clip duration: " + clipDuration });

    const montageName = `montage-${path.basename(video, ".mp4")}-${clips}x${clipDuration}.mp4`;
    if (fs.existsSync(videoDir + "/" + montageName))
        return res.status(200).json({ msg: "Montage already created", montage: montageName});

    try {
        const duration = await getVideoDuration(videoDir + "/" + video);
        const step = duration / clips;
        const timestamps = Array.from(Array(clips).keys()).map(i => (i * step) + 1);

        console.log("Creating clips");
        let cuts = [];
        for (let i = 0; i < timestamps.length; i++)
            cuts.push((await cut(videoDir + "/" + video, timestamps[i], clipDuration, i)).name);

        // merge clips to create montage
        console.log("Compiling preview");

        await merge(cuts, videoDir + "/" + montageName);

        // remove temp clips
        console.log("Removing temp files");
        cuts.forEach(cut => fs.rmSync(cut));
        console.log("Finished");

        return res.status(201).json({ msg: "Successfully created video montage", montage: montageName });
    } catch (e) {
        console.log(e);
        return res.status(500).json({ msg: e.message });
    }
}