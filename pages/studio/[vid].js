import { useEffect, useState } from "react";
import { useRouter } from 'next/router'

export default function Studio() {
    const [video, setVideo] = useState("");
    const router = useRouter();

    useEffect(() => {
        const { query: { vid } } = router;
        if (vid)
            setVideo(vid);
    }, [router.query]);

    if (video.length < 1) return null;
    return (
        <div className="h-screen flex flex-col bg-slate-900 overflow-x-hidden">
            <header className="text-lg text-gray-200 p-2 shadow-lg w-full h-fit mb-1">
                Montage<span className="text-sky-500">Creator</span>
            </header>
            <main className="text-neutral-100 flex flex-col justify-between h-full">
                <div className="flex h-4/5">
                    <aside className="w-1/5 bg-gray-900">

                    </aside>
                    <section className="w-3/5 bg-slate-700 p-1 lg:py-2 lg:px-10 ">
                        <video src={"/api/video/" + video} controls className="w-full h-full m-auto"></video>
                    </section>
                    <aside className="w-1/5 bg-gray-900">

                    </aside>
                </div>
                <footer className="w-full h-1/5 bg-slate-700">

                </footer>
            </main>
        </div>
    )
}