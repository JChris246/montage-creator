import { useState } from "react";
import Router from "next/router";

import { AlertDialog, useAlertDialog } from "./AlertDialog";
import LoadingAnimation from "./LoadingAnimation";

const PasteInput = () => {
    const [pasted, setPasted] = useState("");
    const [uploading, setUploading] = useState(false);
    const dialog = useAlertDialog();

    const validateLink = (e) => {
        const { value } = e.target;

        if (value.match(/https?:\/\/.+/)?.length > 0) {
            setPasted(value);
            setUploading(true);

            const body = new FormData();
            body.append("link", value);
            fetch("/api/upload", { method: "PUT", body })
                .then(async (res) => ({ json: await res.json(), status: res.status }))
                .then(({ json, status }) => {
                    if (!json) throw new Error("Upload Failed");
                    if (status !== 201)
                        dialog.display({ title: "Error", message: json.msg });
                    else Router.replace({ pathname: "/studio/" + json.id });
                    setUploading(false);
                    setPasted("");
                }).catch(e => {
                    setUploading(false);
                    setPasted("");
                    dialog.display({ title: "Error", message: e.message });
                });
        } else {
            dialog.display({ title: "Error", message: "Invalid url" });
            setPasted("");
        }
    }

    return (
        <>
            {uploading && <LoadingAnimation action={"Uploading"}/>}
            { dialog.open ?
                <AlertDialog handleClose={dialog.close} title={dialog.title} message={dialog.message}/> : <></> }
            <input type="text" placeholder="Paste a link" value={pasted} onChange={validateLink}
                className="border-2 bg-zinc-800 p-2 lg:px-3 lg:py-4 rounded-lg text-xl lg:text-2xl h-fit
                focus:outline outline-offset-2 outline-sky-500"/>
        </>
    );
};

export default PasteInput;