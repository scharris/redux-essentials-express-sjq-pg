

// The types defined in this file correspond to results of the following generated SQL queries.
export const sqlResourceJsonArrayRow = "users-query(json array row).sql";
export const sqlResourceJsonObjectRows = "users-query(json object rows).sql";


// query parameters


// Below are types representing the result data for the generated query, with top-level type first.
export interface User
{
  id: number;
  username: string;
  firstName: string;
  lastName: string | null;
}
