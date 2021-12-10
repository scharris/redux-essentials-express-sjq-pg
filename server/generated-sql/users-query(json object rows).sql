-- [ THIS QUERY WAS AUTO-GENERATED, ANY CHANGES MADE HERE MAY BE LOST. ]
-- JSON_OBJECT_ROWS results representation for users query
select
  -- row object for table 'user'
  jsonb_build_object(
    'id', q.id,
    'username', q.username,
    'firstName', q."firstName",
    'lastName', q."lastName"
  ) json
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
