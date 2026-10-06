/**
 * Người nhận tiền của đơn chuyển khoản thủ công: chuyên gia tạo khóa. Lấy từ
 * khối "Tài khoản nhận tiền" và mạng xã hội trong hồ sơ của chuyên gia.
 */
export interface ManualPaymentPayee {
  name: string;
  email: string;
  facebook?: string;
  bankName: string;
  bankNumber: string;
  bankAccount: string;
  bankBranch?: string;
}
