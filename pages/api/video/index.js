export default async function handler(_, res) {
    return res.send(400).json({ msg: "No video id provided" });
}