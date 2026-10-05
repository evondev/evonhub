export interface ProfileUsernameHintProps {
  publicPath: string;
  /** Đang gõ khác username đã lưu: link cũ sắp hỏng */
  isUsernameChanged: boolean;
}

export function ProfileUsernameHint({
  publicPath,
  isUsernameChanged,
}: ProfileUsernameHintProps) {
  const pathLabel = isUsernameChanged ? "Trang mới:" : "Trang của bạn:";

  return (
    <>
      {pathLabel}{" "}
      <span className="break-all font-medium text-foreground">
        {publicPath}
      </span>
      {isUsernameChanged && ". Link cũ sẽ không vào được nữa."}
    </>
  );
}
