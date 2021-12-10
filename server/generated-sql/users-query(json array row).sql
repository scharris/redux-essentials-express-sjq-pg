-- [ THIS QUERY WAS AUTO-GENERATED, ANY CHANGES MADE HERE MAY BE LOST. ]
-- JSON_ARRAY_ROW results representation for users query
select
  -- aggregated row objects for table 'user'
  coalesce(jsonb_agg(jsonb_build_object(
    'id', q.id,
    'username', q.username,
    'firstName', q."firstName",
    'lastName', q."lastName"
  )),'[]'::jsonb) json
from (
  -- base query for table 'user'
  select
    u.id as id,
    u.username as username,
    u.firstname "firstName",
    u.lastname "lastName"
  from
    "user" u
) q
