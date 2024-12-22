import { TarrGetLogDetails, TgetLogDbFactory } from "../analytics.model";

/**
 *
 * @param param0
 * @returns
 */
export function getLogDbFactory({
  objQueries,
}: Parameters<TgetLogDbFactory>[0]): ReturnType<TgetLogDbFactory> {
  /**
   *
   */
  return async ({ objConnection, strTopic, strcustomAlias, intUserId }) => {
    try {
      let strWhereReplace = ``;
      // in case of get all data related to a specified topic add where condition 
      strTopic && (strWhereReplace += ` AND tu.vchr_topic ILIKE '%${strTopic}%' `);
      // in case of get all data related to a specified alias add where condition 

      strcustomAlias &&
        (strWhereReplace += ` AND tu.vchr_custom_alias = '${strcustomAlias}' `);
        // to get data realated specifc user
      intUserId &&
        (strWhereReplace += ` AND tu.fk_bint_user_id = ${intUserId} `);
        
      const { rows: arrLogData }: TarrGetLogDetails = await objConnection.query(
        objQueries.objGet.strGetLogDetails.replace(/{WHERE}/, strWhereReplace)
      );
      return arrLogData;
    } catch (err) {
      throw new Error(err);
    }
  };
}
