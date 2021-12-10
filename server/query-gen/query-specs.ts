import {QueryGroupSpec, QuerySpec, RecordCondition, ResultRepr, TableJsonSpec } from 'sqljson-query';
import {Schema_reduxblog as reduxblog, verifiedFieldNames} from './dbmd/relations-metadata';

const {id : postIdCol} = verifiedFieldNames(reduxblog.post);

function makePostsQuery
  (
    queryName: string,
    recordCondition?: RecordCondition | null,
    resultRepresentations: ResultRepr[] = ['JSON_OBJECT_ROWS']
  )
  : QuerySpec
{
  const postsTableJson: TableJsonSpec = {
    table: 'post',
    fieldExpressions: [
      'id',
      'user_id',
      'title',
      'content',
      { field: 'created', jsonProperty: 'date' },
    ],
    childTables: [
      {
        collectionName: 'comments',
        table: 'comment',
        fieldExpressions: ['id', 'content', 'user_id', 'created'],
        orderBy: 'created asc',
      },
      {
        collectionName: 'reactions',
        table: 'reaction',
        fieldExpressions: ['user_id', 'reaction_type'],
      },
    ],
  };

  return {
    queryName,
    resultRepresentations,
    tableJson: recordCondition ? { ...postsTableJson, recordCondition } : postsTableJson
  };
}

const allPostsQuery = makePostsQuery('all posts query', null, ['JSON_OBJECT_ROWS', 'JSON_ARRAY_ROW']);

const postQuery = makePostsQuery('post query', {sql: `${postIdCol} = $1`});

const usersQuery: QuerySpec = {
  queryName: 'users query',
  resultRepresentations: ['JSON_OBJECT_ROWS', 'JSON_ARRAY_ROW'],
  tableJson: {
    table: 'user',
    fieldExpressions: [
      'id',
      'username',
      {field: 'firstname', jsonProperty: 'firstName'},
      {field: 'lastname', jsonProperty: 'lastName'},
    ],
  }
};

const notificationsQuery: QuerySpec = {
  queryName: 'notifications query',
  resultRepresentations: ['JSON_OBJECT_ROWS', 'JSON_ARRAY_ROW'],
  tableJson: {
    table: 'notification',
    fieldExpressions: ['id', 'user_id', 'message', 'created', 'read'],
  }
};

export const queryGroupSpec: QueryGroupSpec = {
  defaultSchema: 'reduxblog',
  generateUnqualifiedNamesForSchemas: [ 'reduxblog' ],
  propertyNameDefault: 'CAMELCASE',
  querySpecs: [
    allPostsQuery,
    postQuery,
    usersQuery,
    notificationsQuery,
  ]
};
