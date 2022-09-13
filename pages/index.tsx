import type { NextPage } from "next";
import { getSession, GetSessionParams } from "next-auth/react";
import Head from "next/head";
import Image from "next/image";
import Center from "../components/Center";
import Sidebar from "../components/Sidebar";

const Home: NextPage = () => {
  return (
    <div className="bg-black h-screen overflow-hidden">
      <main className="flex">
        <Sidebar />
        <Center />
        {/* Center */}
      </main>

      <div> {/* Player */}</div>
    </div>
  );
};

export default Home;

// Server-side rendering that helps pre-load assets from the Spotify API

export async function getServerSideProps(
  context: GetSessionParams | undefined
) {
  const session = await getSession(context);

  return {
    props: { session },
  };
}
