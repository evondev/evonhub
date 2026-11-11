/** Chưa nhắn lần nào: gợi ý những chuyện nên hỏi */
export function SupportEmptyThread() {
  return (
    <div className="flex h-full flex-col items-center justify-center px-6 text-center">
      <p className="text-sm font-medium text-foreground">
        Chưa có tin nhắn nào
      </p>
      <p className="mt-1 max-w-xs text-pretty text-sm text-muted">
        Cần hỏi về khoá học, thanh toán hay tài khoản thì cứ nhắn ở dưới nhé.
      </p>
    </div>
  );
}
