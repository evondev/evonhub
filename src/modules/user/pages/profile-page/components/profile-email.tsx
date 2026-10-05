import { splitEmailAtSign } from "../../../utils";

export interface ProfileEmailProps {
  email: string;
}

/** Email dài xuống dòng ngay trước "@", không cắt giữa tên miền */
export function ProfileEmail({ email }: ProfileEmailProps) {
  const [localPart, domainPart] = splitEmailAtSign(email);

  return (
    <span className="[overflow-wrap:anywhere]">
      {localPart}
      <wbr />
      {/* Tên miền giữ liền: không ngắt ở gạch nối như "evondev-" */}
      <span className="whitespace-nowrap">{domainPart}</span>
    </span>
  );
}
