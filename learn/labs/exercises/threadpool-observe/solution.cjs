const crypto = require("node:crypto");

// Bỏ dấu // ở dòng dưới rồi chạy lại, so số đo hai lần:
// process.env.UV_THREADPOOL_SIZE = "8";

const startedAt = Date.now();

for (let userNumber = 1; userNumber <= 8; userNumber++) {
  crypto.pbkdf2("matkhau123", "evon-salt", 400_000, 64, "sha512", () => {
    console.log(`Người ${userNumber} băm xong sau ${Date.now() - startedAt}ms`);
  });
}
