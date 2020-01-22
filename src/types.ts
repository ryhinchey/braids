import { HttpMethod, Headers, ResourceType, SetCookie } from "puppeteer";

export interface Config {
  url: string;
  cookies?: SetCookie[];
  userAgent?: string;
  device?: string;
}

export interface Coverages {
  [url: string]: {
    usedBytes: number;
    totalBytes: number;
  };
}

export interface Request {
  url: string;
  method: HttpMethod;
  headers: Headers;
  resourceType: ResourceType;
  response?: {
    status: number;
    headers: Headers;
  };
}

export interface SiteData {
  url: string;
  title: string;
  performance: {
    entries: PerformanceEntryList;
    timing: PerformanceResourceTiming;
  };
  coverage?: Coverages;
  requests: Request[];
}
