const fs = require("fs");

const videoDir = "/home/christopher/Documents/video_cache";

const streamMedia = async (name, type, req, res) => {
    if (!name) return res.status(400).json({ msg: "No montage id provided" });

    if (type === "image")
        name = !name.endsWith(".png") ? name + ".png" : name;
    else name = !name.endsWith(".mp4") ? name + ".mp4" : name;

    try {
        const filename = videoDir + "/" + name;
        if (!fs.existsSync(filename))
            return res.status(404).json({ msg: "Montage not found" });

        const CHUNK_SIZE = type === "video" ? (2 ** 20) * 3.5 : (2 ** 20) * 20;
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
            "Content-Type": type === "mp4" ? "video/mp4" : "image/png",
        };

        res.writeHead(206, headers);

        const reader = fs.createReadStream(filename, { start, end });
        console.log("stream");

        // Stream the video chunk to the client
        reader.pipe(res);
    } catch (e) {
        console.log(e);
        return res.status(500).json({ msg: e.message });
    }
};

export default async function handler(req, res) {
    if (req.method === "GET") {
        const { view } = req.query;
        if (!view) return res.status(400).json({ msg: "View type not specified" });
        if (view[0] === "image" || view[0] === "video")
            return await streamMedia(view[1], view[0], req, res);
        else return res.status(400).json({ msg: "Bad view type requested" });
    }
    else return res.status(405).json({ msg: "Bad Method" });
}