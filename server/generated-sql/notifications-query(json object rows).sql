-- [ THIS QUERY WAS AUTO-GENERATED, ANY CHANGES MADE HERE MAY BE LOST. ]
-- JSON_OBJECT_ROWS results representation for notifications query
select
  -- row object for table 'notification'
  jsonb_build_object(
    'id', q.id,
    'userId', q."userId",
    'message', q.message,
    'created', q.created,
    'read', q.read
  ) json
from (
  -- base query for table 'notification'
  select
    n.id as id,
    n.user_id "userId",
    n.message as message,
    n.created as created,
    n.read as read
  from
    notification n
) q
