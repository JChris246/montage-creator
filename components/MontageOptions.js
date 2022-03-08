import { useState } from "react";

export const VideoOptions = ({ create }) => {
    const [options, setOptions] = useState({ clips: 15, clipDuration: 1.5 });

    const updateOptions = e => {
        const { value, name } = e.target;

        setOptions({ ...options, [name]: value });
    };

    return (
        <div>
            <div className="border-2 border-violet-400 px-2 py-1 lg:py-4 rounded-t-sm">
                <div className="flex justify-between my-1">
                    <label className="text-xl">Clips</label>
                    <input type="number" step="1" value={options.clips} name="clips" onChange={updateOptions}
                        className="w-2/5 border-none focus:outline outline-offset-1 outline-2 outline-sky-500
                        bg-slate-800 px-1"/>
                </div>
                <div className="flex justify-between my-1">
                    <label className="text-xl">Clip duration</label>
                    <input type="number" step="0.5" value={options.clipDuration} name="clipDuration"
                        onChange={updateOptions} className="w-2/5 border-none focus:outline outline-offset-1 outline-2
                        outline-sky-500 bg-slate-800 px-1"/>
                </div>
            </div>
            <button onClick={() => create({ type: "video", options })} name="videoMontage"
                className="text-md bg-violet-400 p-2 hover:bg-violet-500 w-full">
                Create Video Montage</button>
        </div>
    );
};

export const ImageOptions = ({ create }) => {
    const [options, setOptions] = useState({ frames: 16, rows: 4, cols: 4 });

    const updateOptions = e => {
        const { value, name } = e.target;

        setOptions({ ...options, [name]: value });
    };

    return (
        <div>
            <div className="border-2 border-violet-400 px-2 py-1 lg:py-4 rounded-t-sm">
                <div className="flex justify-between my-1">
                    <label className="text-xl">Frames</label>
                    <input type="number" step="1" value={options.frames} onChange={updateOptions} name="frames"
                        className="w-1/5 border-none focus:outline outline-offset-1 outline-2 outline-sky-500
                        bg-slate-800 px-1"/>
                </div>
                <div className="flex justify-between my-1">
                    <label className="text-xl">Rows</label>
                    <input type="number" step="1" value={options.rows} onChange={updateOptions} name="rows"
                        className="w-1/5 border-none focus:outline outline-offset-1 outline-2 outline-sky-500
                        bg-slate-800 px-1"/>
                </div>
                <div className="flex justify-between my-1">
                    <label className="text-xl">Cols</label>
                    <input type="number" step="1" value={options.cols} onChange={updateOptions} name="cols"
                        className="w-1/5 border-none focus:outline outline-offset-1 outline-2 outline-sky-500
                        bg-slate-800 px-1"/>
                </div>
            </div>
            <button onClick={() => create({ type: "image", options })} name="imageMontage"
                className="text-md bg-violet-400 p-2 hover:bg-violet-500 w-full">
                Create Image Montage</button>
        </div>
    );
};