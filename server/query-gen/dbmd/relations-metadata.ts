// ---------------------------------------------------------------------------
//   THIS SOURCE CODE WAS AUTO-GENERATED, ANY CHANGES MADE HERE MAY BE LOST.
// ---------------------------------------------------------------------------


export const Schema_reduxblog = {
  "user": { // relation user
     "id": { type: "int4", nullable: false, pkPart: 1, len: null, prec: 32, precRadix: 2, scale: 0 },
     "username": { type: "varchar", nullable: false, pkPart: null, len: 30, prec: null, precRadix: null, scale: null },
     "firstname": { type: "varchar", nullable: false, pkPart: null, len: 50, prec: null, precRadix: null, scale: null },
     "lastname": { type: "varchar", nullable: true, pkPart: null, len: 50, prec: null, precRadix: null, scale: null },
  },

  "post": { // relation post
     "id": { type: "int4", nullable: false, pkPart: 1, len: null, prec: 32, precRadix: 2, scale: 0 },
     "title": { type: "varchar", nullable: false, pkPart: null, len: 200, prec: null, precRadix: null, scale: null },
     "content": { type: "text", nullable: false, pkPart: null, len: null, prec: null, precRadix: null, scale: null },
     "user_id": { type: "int4", nullable: false, pkPart: null, len: null, prec: 32, precRadix: 2, scale: 0 },
     "created": { type: "timestamptz", nullable: false, pkPart: null, len: null, prec: null, precRadix: null, scale: null },
  },

  "comment": { // relation comment
     "id": { type: "int4", nullable: false, pkPart: 1, len: null, prec: 32, precRadix: 2, scale: 0 },
     "content": { type: "text", nullable: false, pkPart: null, len: null, prec: null, precRadix: null, scale: null },
     "post_id": { type: "int4", nullable: false, pkPart: null, len: null, prec: 32, precRadix: 2, scale: 0 },
     "user_id": { type: "int4", nullable: false, pkPart: null, len: null, prec: 32, precRadix: 2, scale: 0 },
     "created": { type: "timestamptz", nullable: false, pkPart: null, len: null, prec: null, precRadix: null, scale: null },
  },

  "notification": { // relation notification
     "id": { type: "int4", nullable: false, pkPart: 1, len: null, prec: 32, precRadix: 2, scale: 0 },
     "user_id": { type: "int4", nullable: false, pkPart: null, len: null, prec: 32, precRadix: 2, scale: 0 },
     "message": { type: "text", nullable: false, pkPart: null, len: null, prec: null, precRadix: null, scale: null },
     "created": { type: "timestamptz", nullable: false, pkPart: null, len: null, prec: null, precRadix: null, scale: null },
     "read": { type: "bool", nullable: false, pkPart: null, len: null, prec: null, precRadix: null, scale: null },
  },

  "reaction": { // relation reaction
     "post_id": { type: "int4", nullable: false, pkPart: 1, len: null, prec: 32, precRadix: 2, scale: 0 },
     "reaction_type": { type: "varchar", nullable: false, pkPart: 2, len: 20, prec: null, precRadix: null, scale: null },
     "user_id": { type: "int4", nullable: false, pkPart: 3, len: null, prec: 32, precRadix: 2, scale: 0 },
  },

};

export function verifiedFieldNames<T extends Object>(relMd: T): { [P in keyof T]: string }
{
   const res: any = {};
   for ( const fieldName of Object.keys(relMd) )
      res[fieldName] = fieldName;
   return res;
}

export function verifiedTableName<T extends Object>(schemaMd: T, tableName: string & keyof T): (string & keyof T)
{
   return tableName;
}
