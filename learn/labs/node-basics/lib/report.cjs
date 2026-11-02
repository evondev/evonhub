// Harness in kết quả chấm ra dòng cuối, app đọc dòng có tiền tố này.
const RESULT_PREFIX = "__RESULT__";

function report(checks) {
  console.log(RESULT_PREFIX + JSON.stringify({ checks }));
}

module.exports = { report };
