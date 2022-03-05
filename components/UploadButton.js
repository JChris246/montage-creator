import { useState, useRef } from "react";
import Router from "next/router";

import UploadAnimation from "./UploadAnimation";
import { AlertDialog, useAlertDialog } from "./AlertDialog";

const UploadButton = () => {
    const input = useRef();
    const [uploading, setUploading] = useState(false);
    const dialog = useAlertDialog();

    const selectFile = e => {
        const { target: { files } } = e

        const body = new FormData();
        body.append("video", files[0]);

        setUploading(true);
        fetch("/api/upload", { method: "POST", body }).then((res) => {
            setUploading(false);
            if (res.ok)
                return res.json();
        }).then(json => {
            if (!json) throw new Error("Upload Failed");
            console.log(json);
            Router.replace({ pathname: "/studio/" + json.id });
        }).catch(e => {
            console.log(e);
            dialog.display({ title: "Error", message: e })
        });
    }

    return (
        <>
            {uploading && <UploadAnimation/>}
            { dialog.open ?
                <AlertDialog handleClose={dialog.close} title={dialog.title} message={dialog.message}/> : <></> }
            <button onClick={() => input.current.click()} className="capitalize px-5 lg:px-10 py-3 lg:py-6 text-xl
                lg:text-2xl text-neutral-100 bg-sky-500 rounded-full hover:shadow-sm hover:shadow-sky-600
                hover:scale-[.98]">upload your video</button>
            <input type="file" accept="video/*" className="hidden" onChange={selectFile} ref={input} />
        </>
    )
};

export default UploadButton;