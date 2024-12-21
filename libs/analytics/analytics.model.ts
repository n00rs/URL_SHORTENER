import { Pool, Client } from "pg";
import { TgetPgConnection } from "../common/functions/verifyToken.model";
//type defintion for Queries
export type TobjQueries = {
  objGet: {
    strGetLogDetails: string;
  };
};
//type for get strGetLogDetails response
type TobjGetLogDetails = {
  intUserId: number;
  datCreated: string;
  strOs: string;
  strDevice: string;
  intUrlId: number;
  strShortUrl: string;
};
export type TarrGetLogDetails = { rows: TobjGetLogDetails[] };
/**
 * type defintion for getLogDb function
 */
export type TgetLogDb = (objparams: {
  objConnection: Pool | Client;
  strTopic?: string;
  strcustomAlias?: string;
  intUserId: number;
}) => Promise<TobjGetLogDetails[]>;

//type defintion for getLogDbFactory
export type TgetLogDbFactory = (objParams: {
  objQueries: TobjQueries;
}) => TgetLogDb;

//
export type TgetAnalyticsUsecaseFactory = (objParams: {
  getLogDb: TgetLogDb;
  getPgConnection:TgetPgConnection
}) => (objParams: {
  objBody: {
    strcustomAlias?: string;
    strTopic?: string;
    intUserId?: number;
    strType: "ALIAS" | "TOPIC" | 'OVERALL';
  };
  objConnection?: Pool | Client;
}) => Promise<TobjAliasReturn>;

export type TobjAliasReturn = {
  intTotalUrls?:number; //Total number of short URLs created by the user.
  intTotalClicks: number; //Total number of times the short URL has been accessed.
  intUniqueClicks: number; // Number of unique users who accessed the short URL.
  arrClicksByDate: Array<{ strDate: string; intTotalClicks: number }>; //An array of objects containing date and click count.
  // An array of objects containing:
  arrOsType?: Array<{
    strOsName: string; //The name of the operating system (e.g., Windows, macOS, Linux, iOS, Android).
    intUniqueClicks: number; // Number of unique clicks for that OS.
    intUniqueUsers: number; //Number of unique users for that OS.
    setUsers?: Set<number>;
  }>;
  //An array of objects containing:
  arrDeviceType?: Array<{
    strDeviceName: string; // The type of device used (e.g., mobile, desktop).
    intUniqueClicks: number; // Number of unique clicks for that device type.
    intUniqueUsers: number; // Number of unique users for that device type.
    setUsers?: Set<number>;
  }>;
  //An array of URLs under the specified topic, each containing:
  arrUrls?: Array<{
    strShortUrl: string; //The generated short URL.
    intTotalClicks: number; // Number of unique clicks for that short URL type.
    intUniqueClicks: number; // Number of unique users for that short URL type.
    setUsers?: Set<number>;
  }>;
};
