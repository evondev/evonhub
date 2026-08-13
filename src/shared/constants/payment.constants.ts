export interface BankAccountInfo {
  accountNumber: string;
  accountName: string;
  bankName: string;
  /** Mã ngân hàng dùng cho ảnh QR của SePay, ví dụ: ACB, VCB, MB */
  bankCode: string;
}

export const bankAccountInfo: BankAccountInfo = {
  accountNumber: process.env.SEPAY_BANK_NUMBER || "33366668888",
  accountName: process.env.SEPAY_BANK_ACCOUNT || "TRAN ANH TUAN",
  bankName: process.env.SEPAY_BANK_NAME || "ACB",
  bankCode: process.env.SEPAY_BANK_CODE || "ACB",
};

/** Tiền tố mã đơn hàng, cũng là nội dung chuyển khoản để SePay đối soát. */
export const ORDER_CODE_PREFIX = "DH";

export const ORDER_CODE_PATTERN = new RegExp(`${ORDER_CODE_PREFIX}\\d{8}`, "i");
