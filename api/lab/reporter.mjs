// Reporter cho evon-lab: in output của test như thường, cuối cùng in một dòng __RESULT__
// để app vẽ danh sách test xanh/đỏ. Chạy tay trong terminal thì dùng `npm test`, không cần file này.
const RESULT_PREFIX = "__RESULT__";
const VALUE_LIMIT = 160;

function formatValue(value) {
  const text = typeof value === "string" ? `"${value}"` : JSON.stringify(value);

  return text.length > VALUE_LIMIT ? `${text.slice(0, VALUE_LIMIT)}…` : text;
}

// assert tự sinh message nhiều dòng ("Expected values to be strictly equal: ..."), dòng đầu không nói gì.
// Khi đó in thẳng giá trị mong đợi và giá trị nhận được.
function readFailureMessage(error) {
  const cause = error?.cause ?? error;

  if (cause?.generatedMessage) {
    return `Mong đợi ${formatValue(cause.expected)}, nhận ${formatValue(cause.actual)}`;
  }

  return String(cause?.message ?? cause).split("\n")[0];
}

export default async function* labReporter(source) {
  const checks = [];

  for await (const event of source) {
    if (event.type === "test:stdout" || event.type === "test:stderr") {
      yield event.data.message;
    }

    const isTestResult = event.type === "test:pass" || event.type === "test:fail";
    if (!isTestResult || event.data.details?.type === "suite") continue;

    const isPassed = event.type === "test:pass";
    checks.push({
      label: event.data.name,
      isPassed,
      detail: isPassed ? undefined : readFailureMessage(event.data.details?.error),
    });
  }

  yield `${RESULT_PREFIX}${JSON.stringify({ checks })}\n`;
}
