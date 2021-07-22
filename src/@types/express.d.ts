declare namespace Express {
  // eslint-disable-next-line @typescript-eslint/interface-name-prefix
  export interface Request {
    hostUrl: string;
    currentUrl: string;
  }
}
