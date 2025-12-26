import { MetadataRoute } from "next";

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: "PENXCHAIN",
    short_name: "PENXCHAIN",
    start_url: "/",
    display: "standalone",
    background_color: "#0b0b0b",
    theme_color: "#000000",
    icons: [
      {
        src: "/img/penxchain.jpg",
        sizes: "512x512",
        type: "image/png",
      },
    ],
  };
}
