import Head from "next/head"
import Image from "next/image"
// import styles from "../styles/Home.module.css'

export default function Home() {
    return (
        <div className="flex justify-center items-center h-screen bg-[#2a2b39]">
            <h1 className="text-6xl text-gray-200 font-bold">
               Montage<span className="text-blue-600">Creator</span></h1>
        </div>
    )
}