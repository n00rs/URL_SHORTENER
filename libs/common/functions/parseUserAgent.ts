export function parseUserAgent(strUserAgent) {
  let strOs = "Unknown OS";
  let strDevice = "Unknown Device";

  // Detect OS
  if (/windows/i.test(strUserAgent)) {
    strOs = "Windows";
  } else if (/macintosh|mac os x/i.test(strUserAgent)) {
    strOs = "macOS";
  } else if (/linux/i.test(strUserAgent)) {
    strOs = "Linux";
  } else if (/android/i.test(strUserAgent)) {
    strOs = "Android";
  } else if (/iphone|ipad|ipod/i.test(strUserAgent)) {
    strOs = "iOS";
  }

  // Detect Device Type
  if (/mobile/i.test(strUserAgent)) {
    strDevice = "Mobile";
  } else if (/tablet/i.test(strUserAgent)) {
    strDevice = "Tablet";
  } else if (
    /desktop/i.test(strUserAgent) ||
    /windows|macintosh|linux/i.test(strUserAgent)
  ) {
    strDevice = "Desktop";
  }

  return { strOs, strDevice };
}
export type TparseUserAgent = (strUserAgent:string)=>{
    strOs: string;
    strDevice:string;
  }