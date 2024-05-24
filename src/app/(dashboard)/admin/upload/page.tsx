import Mux from "@mux/mux-node";
import MuxUploader from "@mux/mux-uploader-react";

const mux = new Mux({
  tokenId: process.env.MUX_TOKEN_ID,
  tokenSecret: process.env.MUX_TOKEN_SECRET,
});

export default async function Page() {
  const directUpload = await mux.video.uploads.create({
    new_asset_settings: { playback_policy: ["public"] },
    cors_origin: "*",
  });

  return <MuxUploader endpoint={directUpload.url} />;
}
