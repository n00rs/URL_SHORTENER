import { TcreateLoginDbFactory, TobjLoginDb } from "../auth.model";

/**
 * Factory function to create a function for handling user login and registration in the database.
 * @param param0 - An object containing the queries to be executed in the database.
 * @returns A function that handles user login or registration by checking the existence of the user and saving their details if they don't exist.
 */
export function createLoginDbFactory({
  objQueries,
  generatePublicPrivateKey
}: Parameters<TcreateLoginDbFactory>[0]): ReturnType<TcreateLoginDbFactory> {
  /**
   * Function to handle user login or registration.
   * @param objConnection - The database connection object used to execute queries.
   * @param objExtraJson - Additional JSON data to be saved with the user record.
   * @param strImgUrl - The URL of the user's profile image.
   * @param strMaild - The email ID of the user (unique identifier).
   * @param strUserName - The username of the user.
   * @returns The user details from the database, either existing or newly created.
   */
  return async ({
    objConnection = null,
    objExtraJson = {},
    strImgUrl = "",
    strMaild = "",
    strUserName = "",
  }) => {
    try {
      //check whether user details already exist in db
      const { rows: arrUserDetails }: { rows: TobjLoginDb[] } =
        await objConnection.query(objQueries.objCreate.strGetUSerData, [
          strMaild,
        ]);
      if (arrUserDetails.length) return arrUserDetails[0];
      //   create rsa keys
      const objAcc = await generatePublicPrivateKey();
      const objRefr = await generatePublicPrivateKey();

      const arrInsertParams = [
        strMaild,
        strUserName,
        strImgUrl,
        objAcc["strPublicKey"],
        objAcc["strPrivateKey"],
        objRefr["strPublicKey"],
        objRefr["strPrivateKey"],
        JSON.stringify(objExtraJson),
      ];
      //save user details in db
      const { rows: arrUserDetail }: { rows: TobjLoginDb[] } =
        await objConnection.query(
          objQueries.objCreate.strCreateUser,
          arrInsertParams
        );
      return arrUserDetail[0];
    } catch (err) {
      throw new Error(err);
    }
  };
}
