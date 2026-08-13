export interface BankAccountInfo {
  /** Số tài khoản nhận tiền, cũng là tài khoản kết nối với SePay */
  accountNumber: string;
  accountName: string;
  /** Mã ngân hàng dùng cho ảnh QR của SePay, ví dụ: ACB, VCB, MB */
  bankCode: string;
}

export const bankAccountInfo: BankAccountInfo = {
  accountNumber: process.env.NEXT_PUBLIC_SEPAY_BANK_ACCOUNT || "",
  accountName: process.env.NEXT_PUBLIC_SEPAY_BANK_ACCOUNT_NAME || "TRAN ANH TUAN",
  bankCode: process.env.NEXT_PUBLIC_SEPAY_BANK_NAME || "ACB",
};

/** Tiền tố mã đơn hàng, cũng là nội dung chuyển khoản để SePay đối soát. */
export const ORDER_CODE_PREFIX = "DH";

export const ORDER_CODE_PATTERN = new RegExp(`${ORDER_CODE_PREFIX}\\d{8}`, "i");
