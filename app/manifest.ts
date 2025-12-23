import { MetadataRoute } from "next";

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: "PENXCHAIN",
    short_name: "PENXCHAIN",
    start_url: "/",
    display: "standalone",
    background_color: "#000000",
    theme_color: "#ffffff",
    icons: [
      {
        src: "/img/penxchain.jpg",
        sizes: "512x512",
        type: "image/png",
      },
    ],
  };
}
