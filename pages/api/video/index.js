export default async function handler(_, res) {
    return res.status(400).json({ msg: "No video id provided" });
}