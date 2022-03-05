import { React, useState } from "react";

import Modal from "./Modal";

const AlertDialog = ({ handleClose, title, message, closeMessage="Okay" }) => {
    return (
        <Modal onClose={handleClose} center>
            <div id="alert-dialog" className="w-1/3">
                <header className="py-4 px-2 flex justify-between bg-stone-800">
                    <span>{title}</span>
                    <span className="text-neutral-700 font-xl hover:text-red-400" onClick={handleClose}>&times;</span>
                </header>
                <main className="p-2 bg-stone-500">{message}</main>
                <footer className="p-2 flex justify-end bg-stone-700">
                    <button autoFocus onClick={handleClose}
                        className="bg-sky-500 px-2 py-1 rounded outline-none border-0">{closeMessage}</button>
                </footer>
            </div>
        </Modal>
    );
};

const useAlertDialog = () => {
    const [messageDialog, setMessageDialog] = useState({
        open: false,
        title: "",
        message: ""
    });

    return {
        display: args => setMessageDialog({ ...args, open: true }),
        ...messageDialog,
        close: () => {
            setMessageDialog({
                title: "",
                message: "",
                open: false
            });
        }
    };
};

export {
    AlertDialog,
    useAlertDialog
};