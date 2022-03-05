import { useState, useEffect } from "react";

import Modal from "./Modal";

const UploadAnimation = () => {
    const [dots, setDots] = useState("");

    useEffect(() => {
        const i = setInterval(() => {
            setDots(prev => prev.length > 2 ? "" : prev + ".");
        }, 550);

        return () => clearInterval(i);
    }, []);

    return (
        <Modal center>
            <div className="w-1/6 text-4xl font-bold bg-transparent">
                Uploading {dots}
            </div>
        </Modal>
    )
};

export default UploadAnimation;