
import { SetCookie } from "puppeteer";

export interface Config {
  url: string;
  cookies?: SetCookie[];
  userAgent?: string;
  device?: string;
}
