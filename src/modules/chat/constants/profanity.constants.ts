/**
 * Từ/cụm luôn chặn, so trên chuỗi đã bỏ dấu. Ghi ở dạng gốc, không cần liệt kê
 * biến thể kéo dài ("dmmm", "fuckkk") hay chen dấu chấm ("đ.m"): bộ lọc tự bắt.
 * Không thêm từ/cụm mà bỏ dấu đi trùng với chữ thường (vd "dit" là cả "đít"
 * lẫn "địt", "cai lon" là cả "cái lon", "du ma" là cả "dù mà"): những từ đó
 * cho vào bannedTermsWithDiacritics.
 */
export const bannedTerms: string[] = [
  "dm",
  "dcm",
  "dkm",
  "dmcs",
  "dmcl",
  "vcl",
  "vkl",
  "vcc",
  "vlz",
  "clgt",
  "clm",
  "cmm",
  "cmn",
  "loz",
  "duma",
  "dume",
  "dit me",
  "dit con me",
  "ditme",
  "oc cho",
  "occho",
  "fuck",
  "fucking",
  "fucker",
  "motherfucker",
  "shit",
  "bitch",
  "dick",
  "pussy",
  "asshole",
];

/**
 * Từ chỉ chặn khi còn nguyên dấu, vì bỏ dấu đi thì trùng từ thường
 * ("lồn" / "lon", "đéo" / "đeo", "đĩ" / "đi").
 */
export const bannedTermsWithDiacritics: string[] = [
  "địt",
  "đụ",
  "lồn",
  "cặc",
  "buồi",
  "đéo",
  "đĩ",
  "phò",
  "đĩ điếm",
];
