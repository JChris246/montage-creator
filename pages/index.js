import PasteInput from "../components/PasteInput";
import UploadButton from "../components/UploadButton";

export default function Home() {
    return (
        <div className="flex justify-center flex-col bg-stone-800 overflow-x-hidden">
            <header className="text-2xl text-gray-200 font-bold p-5 bg-zinc-800 shadow-lg w-full h-fit">
                Montage<span className="text-sky-500">Creator</span>
            </header>
            <main className="h-full text-neutral-100">
                <section className="flex flex-col-reverse items-center mt-32 w-full lg:w-fit mx-auto">
                    <img src="images/video_files.svg" alt=" " className="w-48 lg:w-72 my-20"/>
                    <article className="flex flex-col space-y-12">
                        <section className="text-4xl md:text-5xl lg:text-6xl">
                            <span className="font-bold">Montage </span>
                            <span className="font-light">creation made
                                <span className="text-sky-500"> simple</span>
                            </span>
                        </section>
                        <section className="font-thin text-xl md:text-2xl lg:text-3xl mx-2">
                            Create montage videos and images with a single click.</section>
                    </article>
                </section>

                <section className="w-full lg:w-4/5 lg:mx-auto flex flex-col sm:flex-row justify-center
                    items-center mb-16">
                    <UploadButton/>
                    <span className="text-lg text-neutral-200 block my-6 sm:my-0 sm:mx-10">or</span>
                    <PasteInput/>
                </section>
            </main>
        </div>
    )
}