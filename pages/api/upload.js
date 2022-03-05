const fs = require("fs");
const path = require("path");
const axios = require('axios');
const formidable = require("formidable");

export const config = {
    api: {
        bodyParser: false
    }
}

const videoDir = "/home/christopher/Documents/video_cache";

const getUniqueFilename = () => {
    // adpated from
    // https://github.com/JabbR/JabbR/blob/eb5b4e2f1e5bdbb1ea91230f1884716170a6976d/JabbR/Chat.utility.js#L50
    const guidGenerator = () => {
        const S4 = () => (((1 + Math.random()) * 0x10000) | 0).toString(16).substring(1);
        return (S4() + S4() + "-" + S4() + "-" + S4() + "-" + S4() + "-" + S4() + S4() + S4());
    }

    return guidGenerator() + ".mp4";
}

const uploadFile = async (req, res) => {
    try {
        const data = await new Promise((resolve, reject) => {
            const form = formidable({ multiples: true, uploadDir: videoDir, filename: getUniqueFilename });

            // form.on("fileBegin", (formname, file) => file.path = path.join(uploadDir, getUniqueFilename()));
            form.parse(req, (err, fields, files) => {
                if (err) return reject(err);
                resolve(files);
            });
        });

        return res.status(201).json({ id: path.basename(data.video.newFilename) });
    } catch (e) {
        console.log(e);
        return res.status(501).json({ msg: e });
    }
};

const fetchFile = async (req, res) => {
    try {
        const data = await new Promise((resolve, reject) => {
            const form = formidable();

            form.parse(req, (err, fields) => {
                if (err) return reject(err);
                resolve(fields);
            });
        });

        if (!data.link)
            return res.status(400).json({ msg: "Missing link" });
        else {
            const response = await axios({ method: "get", url: data.link, responseType: "stream" });
            const newFilename = getUniqueFilename();

            const writer = fs.createWriteStream(videoDir + "/" + newFilename);
            response.data.pipe(writer);

            let error = null;
            writer.on("error", err => {
                writer.close();
                error = err;
            });

            writer.on("close", () => {
                if (!error) {
                    return res.status(201).json({ msg: "Uploaded the video successfully", id: path.basename(newFilename) });
                } else {
                    console.log(e);
                    return res.status(501).json(e);
                }
            });
        }
    } catch (e) {
        console.log(e);
        return res.status(501).json(e);
    }
};

export default async function handler(req, res) {
    if (req.method === "POST")
        return await uploadFile(req, res);
    else if (req.method === "PUT")
        return await fetchFile(req, res);
    else return res.send(400).json("Bad Method");
}