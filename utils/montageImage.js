const ffmpeg = require("fluent-ffmpeg");
const path = require("path")
const fs = require("fs");
const { getVideoDuration, videoDir, tempDir } = require("./index");

const screenshot = async ({ video, timestamp, name, width="854", height="480" }) => {
    const filename = path.basename(name);
    const folder = path.dirname(name);

    await new Promise((resolve, reject) => {
        return ffmpeg()
            .input(video)
            .screenshot({
                timestamps: [timestamp],
                filename,
                folder,
                size: `${width}x${height}`
            })
            .on("end", (stdout, stderr) => resolve({ stderr, msg: "success" }))
            .on("error", (err, stdout, stderr) => reject({ stderr, err, msg: err.message }));
    });
};

const tile = async (shots, rows, cols, finalName) => {
    // create the rows of the final image
    for (let i = 0; i < rows; i++) {
        await new Promise((resolve, reject) => {
            const f = ffmpeg();
            for (let j = 0; j < cols; j++) f.input(shots[j + i * cols]);
            let filterArg = "";
            for (let j = 0; j < cols; j++) filterArg += `[${j}]`;
            filterArg += "hstack=inputs=" + cols;
            f.outputOptions(["-filter_complex " + filterArg, "-frames:v 1"])
                .output(tempDir + `/row-${i}.png`)
                .on("end", (stdout, stderr) => resolve({ stderr }))
                .on("error", (err, stdout, stderr) => reject({ stderr, err }))
                .exec();
        });
    }

    // merge the rows into the final image
    await new Promise((resolve, reject) => {
        ffmpeg()
            .input(tempDir + "/row-%d.png")
            .outputOptions([`-filter_complex tile=1x${rows}:margin=1`])
            .output(videoDir + "/" + finalName)
            .on("end", (stdout, stderr) => resolve({ stderr }))
            .on("error", (err, stdout, stderr) => reject({ stderr, err }))
            .exec();
    });
};

const generatePreview = async (originalName, previewName) => {
    // generate a smaller version of the montage to display to the user before download
    await new Promise((resolve, reject) => {
        ffmpeg()
            .input(originalName)
            .size("?x480")
            .output(previewName)
            .on("end", (stdout, stderr) => resolve({ stderr }))
            .on("error", (err, stdout, stderr) => reject({ stderr, err }))
            .exec();
    });
};

export const createMontageImage = async (res, video, options) => {
    if (!video.endsWith(".mp4")) video += ".mp4"

    // default params
    let params = {
        frames: 16,
        rows: Math.sqrt(options?.frames || 16),
        cols: Math.sqrt(options?.frames || 16)
    };

    // use default params for options the user did not pass
    params = { ...params, ...options };

    const { frames: f, rows: r, cols: c } = params;
    const frames = Number(f);
    const rows = Number(r);
    const cols = Number(c);

    if (frames < 2) return res.status(400).json({ msg: "Invalid number of frames: " + frames });

    if (rows * cols !== frames)
        return res.status(400).json({
            msg: `rows and cols must be a factor pair with a product of 'frames';
              frames:${frames} rows:${rows} cols:${cols}` });

    const montageName = `montage-${path.basename(video, ".mp4")}-${rows}x${cols}.png`;
    const montagePreview = `montage-${path.basename(video, ".mp4")}-${rows}x${cols}-preview.png`;
    if (fs.existsSync(videoDir + "/" + montageName))
        return res.status(200).json({ msg: "Montage already created", montage: montagePreview});

    try {
        const duration = await getVideoDuration(videoDir + "/" + video);
        const step = duration / frames;
        const timestamps = Array.from(Array(frames).keys()).map(i => (i * step) + 1);
        let tempNames = [];

        for (let i = 0; i < timestamps.length; i++) {
            tempNames.push(`${tempDir}/scrshot-${Math.floor(timestamps[i])}.png`);
            await screenshot({
                video: videoDir + "/" + video,
                timestamp: timestamps[i],
                name: tempNames.slice(-1)[0]
            });
            console.log("Processed frame " + (i + 1));
        }

        console.log("Tiling");
        await tile(tempNames, rows, cols, montageName);
        await generatePreview(videoDir + "/" + montageName, videoDir + "/" + montagePreview);

        // cleanup
        console.log("Removing temp files");
        for (let i = 0; i < rows; i++) fs.rmSync(tempDir + "/" + `row-${i}.png`);
        tempNames.forEach(tempShot => fs.rmSync(tempShot));

        return res.status(201).json({ msg: "Successfully created image montage", montage: montagePreview });
    } catch (e) {
        console.log(e);
        return res.status(500).json({ msg: e.message });
    }
};
