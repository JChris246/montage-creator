import { createMontageImage } from "../../../utils/montageImage";
import { createMontageVideo } from "../../../utils/montageVideo";

const createMontage = async (req, res) => {
    const { type, video, options } = JSON.parse(req.body);

    if (!type) return res.status(400).json({ msg: "Missing montage type" });
    if (!video) return res.status(400).json({ msg: "Missing the video to create a montage from" });

    if (type === "video")
        return createMontageVideo(res, video, options);
    if (type === "image")
        return await createMontageImage(res, video, options);
    return res.status(400).json({ msg: "Invalid montage type" });
};

export default async function handler(req, res) {
    if (req.method === "POST")
        return await createMontage(req, res);
    else return res.status(405).json({ msg: "Bad Method" });
}