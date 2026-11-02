import { createApp } from "./app.factory.js";

const PORT = Number(process.env.PORT ?? 4000);

const app = await createApp();
await app.listen(PORT, "127.0.0.1");
console.log(`evonhub-api chạy ở http://127.0.0.1:${PORT}/api`);
