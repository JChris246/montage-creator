import { useEffect, useState } from "react";
import { useRouter } from 'next/router'

import LoadingAnimation from "../../components/LoadingAnimation";
import { AlertDialog, useAlertDialog } from "../../components/AlertDialog";
import { VideoOptions, ImageOptions } from "../../components/MontageOptions";
import Download from "../../icons/download";
import Image from "../../icons/image";
import Video from "../../icons/video";
import VideoStrip from "../../icons/videoStrip";

const TabButton = ({ name, id, onClick, activeTab, icon }) => {
    return <button tab={id} onClick={() => onClick(id)}
        className={"w-full p-4 text-xl text-left hover:bg-sky-500 flex "
            + (activeTab === id ? "bg-sky-600" : "bg-transparent")}>
        {icon && icon({ className: "fill-gray-100 w-8 mr-4" })}
        <span>{name}</span>
    </button>;
}

export default function Studio() {
    const [video, setVideo] = useState("");
    const router = useRouter();

    const [activeTab, setActiveTab] = useState(0);
    const [loadingAnimation, setLoadingAnimation] = useState({ text: "", show: false });

    const [montage, setMontage] = useState({ image: "", video: "" });

    const dialog = useAlertDialog();

    useEffect(() => {
        const { query: { vid } } = router;
        if (vid)
            setVideo(vid);
    }, [router.query]);

    const createMontage = ({ type, options }) => {
        setLoadingAnimation({ show: true, text: "Creating Montage" });
        fetch("/api/montage", {
            method: "POST",
            body: JSON.stringify({ type, video, options })
        })
        .then(async (res) => ({ json: await res.json(), status: res.status }))
        .then(({ json, status }) => {
            if (!json) throw new Error("Montage creation failed");
            if (status !== 200 && status !== 201)
                dialog.display({ title: "Error", message: json.msg });
            else {
                type === "video" ? setActiveTab(1) : setActiveTab(2);
                setMontage({ ...montage, [type]: json.montage });
            }
            setLoadingAnimation({ ...loadingAnimation, show: false });
        }).catch(e => {
            dialog.display({ title: "Error", message: e.message });
            setLoadingAnimation({ ...loadingAnimation, show: false });
        });
    };

    const getLink = () => {
        const name = activeTab === 1 ? montage.video : montage.image.replace("-preview", "");
        return `/api/montage/${activeTab === 1 ? "video" : "image"}/${name}`;
    };

    const changeActiveTab = (id) => {
        if (id === 0)
            setActiveTab(id);
        if (id === 1 && montage.video.length > 0)
            setActiveTab(id);
        if (id === 2 && montage.image.length > 0)
            setActiveTab(id);
    };

    if (video.length < 1) return null;
    return (
        <div className="h-screen flex flex-col bg-slate-900 overflow-x-hidden">
            <header className="text-lg text-gray-200 p-2 shadow-lg w-full h-fit mb-1">
                Montage<span className="text-sky-500">Creator</span>
            </header>
            <main className="text-neutral-100 flex flex-col justify-between h-full">
                { dialog.open ?
                    <AlertDialog handleClose={dialog.close} title={dialog.title} message={dialog.message}/> : <></> }
                <div className="flex h-4/5">
                    <aside className="w-1/5 bg-gray-900 flex flex-col p-1 space-y-5">
                        <ImageOptions create={createMontage}/>
                        <VideoOptions create={createMontage}/>
                    </aside>
                    <section className="w-3/5 bg-slate-700 p-1 lg:py-2 lg:px-10 ">
                        { loadingAnimation.show && <LoadingAnimation action={loadingAnimation.text}/> }
                        { activeTab === 0 ?
                            <video key="original" controls className="w-full h-full m-auto rounded-lg">
                                <source src={"/api/video/" + video} type="video/mp4"/>
                            </video>
                            : (activeTab === 2 ? <img src={"/api/montage/image/" + montage.image} alt=" "
                                className="w-full h-full m-auto rounded-xl"/>
                            : <video key="output" controls className="w-full h-full m-auto rounded-lg">
                                <source src={"/api/montage/video/" + montage.video} type="video/mp4"/>
                            </video>)
                        }
                    </section>
                    <aside className="w-1/5 bg-gray-900 flex flex-col justify-between">
                        <div>
                            <TabButton name="Original Video" id={0} onClick={changeActiveTab}
                                activeTab={activeTab} icon={Video}/>
                            <TabButton name="Video Output" id={1} onClick={changeActiveTab}
                                activeTab={activeTab} icon={VideoStrip}/>
                            <TabButton name="Image Output" id={2} onClick={changeActiveTab}
                                activeTab={activeTab} icon={Image}/>
                        </div>
                        <div className="w-full">
                            { (activeTab === 1 || activeTab === 2) && <a
                                href={getLink()}
                                download="montage.png" className="px-4 py-2 w-fit bg-green-500 hover:bg-green-600
                                flex items-center">
                                <Download className="fill-gray-100 w-4 mr-2"/>
                                <span className="text-xl">Download</span>
                            </a>}
                        </div>
                    </aside>
                </div>
                <footer className="w-full h-1/5 bg-slate-700 flex justify-center items-center text-4xl capitalize">
                    Nothing here right now
                </footer>
            </main>
        </div>
    )
}