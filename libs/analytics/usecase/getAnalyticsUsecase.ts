import {
  TgetAnalyticsUsecaseFactory,
  TobjAliasReturn,
} from "../analytics.model";

/**
 *
 * @param param0
 * @returns
 */
export default function getAnalyticsUsecaseFactory({
  getLogDb,getPgConnection
}: Parameters<TgetAnalyticsUsecaseFactory>[0]): ReturnType<TgetAnalyticsUsecaseFactory> {
  /**
   *
   */
  return async ({
    objBody: { strcustomAlias, strTopic, intUserId, strType = "ALIAS" },
    objConnection,
  }) => {
    objConnection = objConnection || (await getPgConnection({ blnPool: true }));
    const blnAlias = strType === "ALIAS";
    const blnTopic = strType === "TOPIC";
    const blnOverAll = strType === "OVERALL";
    try {
      //basic validation
      if (blnAlias && !strcustomAlias) throw new Error("PLEASE_PROVIDE_ALIAS");
      if (blnTopic && !strTopic) throw new Error("PLEASE_PROVIDE_TOPIC");

      const arrLogData = await getLogDb({
        objConnection,
        strcustomAlias,
        strTopic,
        intUserId,
      });

      const objReturn: TobjAliasReturn = {
        arrClicksByDate: [],
        arrDeviceType: [],
        arrOsType: [],
        arrUrls: [],
        intTotalClicks: 0,
        intUniqueClicks: 0,
        intTotalUrls: 0,
      };
      if (!arrLogData?.length) return objReturn;
      /**
       * set to hold unique userid's
       */
      const setUsers: Set<number> = new Set();
      const objDate: {
        [key: string]: TobjAliasReturn["arrClicksByDate"][number];
      } = {};
      const objOs: { [key: string]: TobjAliasReturn["arrOsType"][number] } = {};
      const objDevice: {
        [key: string]: TobjAliasReturn["arrDeviceType"][number];
      } = {};
      const objUrl: {
        [key: string]: TobjAliasReturn["arrUrls"][number];
      } = {};
      const setUrls: Set<string> = new Set();

      arrLogData.forEach((objLog) => {
        //incrementing total clicks by 1
        objReturn["intTotalClicks"]++;
        //adding user id to set
        setUsers.add(objLog.intUserId);

        //last 7 days db response is sorted by date
        if (Object.keys(objDate).length <= 7) {
          // date wise data
          if (!objDate[objLog.datCreated])
            objDate[objLog.datCreated] = {
              strDate: objLog.datCreated,
              intTotalClicks: 0,
            };
          objDate[objLog.datCreated]["intTotalClicks"]++;
        }
        /**
         *handling Topic wise data
         */
        if (blnTopic) {
          if (!objUrl[objLog.strShortUrl])
            objUrl[objLog.strShortUrl] = {
              strShortUrl: objLog.strShortUrl,
              intUniqueClicks: 0,
              intTotalClicks: 0,
              setUsers: new Set(),
            };

          objUrl[objLog.strShortUrl]["intTotalClicks"]++;
          objUrl[objLog.strShortUrl]["setUsers"].add(objLog.intUserId);
          objUrl[objLog.strShortUrl]["intUniqueClicks"] =
            objUrl[objLog.strShortUrl]["setUsers"].size;
          return;
        }
        /**
         * handling os wise data
         */
        if (!objOs[objLog.strOs])
          objOs[objLog.strOs] = {
            strOsName: objLog.strOs,
            intUniqueClicks: 0,
            intUniqueUsers: 0,
            setUsers: new Set(),
          };

        objOs[objLog.strOs]["intUniqueClicks"]++;
        objOs[objLog.strOs]["setUsers"].add(objLog.intUserId);
        objOs[objLog.strOs]["intUniqueUsers"] =
          objOs[objLog.strOs]["setUsers"].size;

        /**
         *handling device wise data
         */
        if (!objDevice[objLog.strDevice])
          objDevice[objLog.strDevice] = {
            strDeviceName: objLog.strDevice,
            intUniqueClicks: 0,
            intUniqueUsers: 0,
            setUsers: new Set(),
          };

        objDevice[objLog.strDevice]["intUniqueClicks"]++;
        objDevice[objLog.strDevice]["setUsers"].add(objLog.intUserId);
        objDevice[objLog.strDevice]["intUniqueUsers"] =
          objDevice[objLog.strDevice]["setUsers"].size;
        blnOverAll && setUrls.add(objLog.strShortUrl);
      });
      if (blnAlias) {
        delete objReturn.arrUrls;
        delete objReturn.intTotalUrls;
        objReturn.arrClicksByDate = Object.values(objDate);
        objReturn.arrDeviceType = Object.values(objDevice);
        objReturn.arrOsType = Object.values(objOs);
      }
      if (blnTopic) {
        delete objReturn.arrClicksByDate;
        delete objReturn.arrDeviceType;
        delete objReturn.arrOsType;
        delete objReturn.intTotalUrls;

        objReturn.arrUrls = Object.values(objUrl);
      }
      if (blnOverAll) {
        delete objReturn.arrUrls;
        objReturn.intTotalUrls = setUrls.size;
        objReturn.arrClicksByDate = Object.values(objDate);
        objReturn.arrDeviceType = Object.values(objDevice);
        objReturn.arrOsType = Object.values(objOs);
      }
      objReturn.intUniqueClicks = setUsers.size;
      return objReturn;
    } catch (err) {
      throw new Error(err);
    }
  };
}
