

// The types defined in this file correspond to results of the following generated SQL queries.
export const sqlResourceJsonArrayRow = "notifications-query(json array row).sql";
export const sqlResourceJsonObjectRows = "notifications-query(json object rows).sql";


// query parameters


// Below are types representing the result data for the generated query, with top-level type first.
export interface Notification
{
  id: number;
  userId: number;
  message: string;
  created: string;
  read: boolean;
}
