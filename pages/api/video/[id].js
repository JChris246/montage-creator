const fs = require("fs");

const { videoDir } = require("../../../utils");

const streamVideo = (req, res) => {
    let { id } = req.query;
    if (!id.endsWith(".mp4"))
        id += ".mp4"

    try {
        const filename = videoDir + "/" + id;
        if (!fs.existsSync(filename))
            return res.status(404).json({ msg: "Video not found" });

        const CHUNK_SIZE = (2 ** 20) * 3.5;
        const fileSize = fs.statSync(filename).size;

        // Parse Range
        // Example: "bytes=32794-"
        const range = req.headers.range || 0;
        const start = range instanceof String || typeof range === "string" ? Number(range.replace(/\D/g, "")) : range;
        const end = Math.min(start + CHUNK_SIZE, fileSize - 1);
        const contentLength = end - start + 1;

        // Create headers
        const headers = {
            "Content-Range": `bytes ${start}-${end}/${fileSize}`,
            "Accept-Ranges": "bytes",
            "Content-Length": contentLength,
            "Content-Type": "video/mp4",
        };

        res.writeHead(206, headers);

        const reader = fs.createReadStream(filename, { start, end });

        // Stream the video chunk to the client
        reader.pipe(res);
    } catch (e) {
        console.log(e);
        return res.status(500).json({ msg: e.message });
    }
};

export default async function handler(req, res) {
    if (req.method === "GET")
        return await streamVideo(req, res);
    else return res.status(405).json({ msg: "Bad Method" });
}