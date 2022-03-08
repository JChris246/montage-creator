import { useEffect, useState } from "react";
import { useRouter } from 'next/router'

import LoadingAnimation from "../../components/LoadingAnimation";
import { AlertDialog, useAlertDialog } from "../../components/AlertDialog";
import { VideoOptions, ImageOptions } from "../../components/MontageOptions";

const TabButton = ({ name, id, onClick, activeTab }) => {
    return <button tab={id} onClick={() => onClick(id)}
        className={"w-full p-4 text-xl text-left hover:bg-sky-600 "
            + (activeTab === id ? "bg-sky-500" : "bg-transparent")}>{name}</button>;
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
                    <aside className="w-1/5 bg-gray-900 flex flex-col p-1 space-y-1">
                        <ImageOptions create={createMontage}/>
                        <VideoOptions create={createMontage}/>
                    </aside>
                    <section className="w-3/5 bg-slate-700 p-1 lg:py-2 lg:px-10 ">
                        { loadingAnimation.show && <LoadingAnimation action={loadingAnimation.text}/> }
                        { activeTab === 0 ?
                            <video src={"/api/video/" + video} controls className="w-full h-full m-auto rounded-lg"></video>
                            : (activeTab === 2 ? <img src={"/api/montage/image/" + montage.image} alt=" "
                                className="w-full h-full m-auto rounded-xl"/> : <video src={"/api/montage/video/" + montage.video}
                                controls className="w-full h-full m-auto rounded-lg"></video>)
                        }
                    </section>
                    <aside className="w-1/5 bg-gray-900">
                        <TabButton name="Original Video" id={0} onClick={changeActiveTab} activeTab={activeTab}/>
                        <TabButton name="Video Output" id={1} onClick={changeActiveTab} activeTab={activeTab}/>
                        <TabButton name="Image Output" id={2} onClick={changeActiveTab} activeTab={activeTab}/>
                    </aside>
                </div>
                <footer className="w-full h-1/5 bg-slate-700">

                </footer>
            </main>
        </div>
    )
}