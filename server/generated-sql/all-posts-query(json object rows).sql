-- [ THIS QUERY WAS AUTO-GENERATED, ANY CHANGES MADE HERE MAY BE LOST. ]
-- JSON_OBJECT_ROWS results representation for all posts query
select
  -- row object for table 'post'
  jsonb_build_object(
    'id', q.id,
    'userId', q."userId",
    'title', q.title,
    'content', q.content,
    'date', q.date,
    'comments', q.comments,
    'reactions', q.reactions
  ) json
from (
  -- base query for table 'post'
  select
    p.id as id,
    p.user_id "userId",
    p.title as title,
    p.content as content,
    p.created as date,
    -- records from child table 'comment' as collection 'comments'
    (
      select
        -- aggregated row objects for table 'comment'
        coalesce(jsonb_agg(jsonb_build_object(
          'id', q.id,
          'content', q.content,
          'userId', q."userId",
          'created', q.created
        ) order by created asc),'[]'::jsonb) json
      from (
        -- base query for table 'comment'
        select
          c.id as id,
          c.content as content,
          c.user_id "userId",
          c.created as created
        from
          comment c
        where (
          c.post_id = p.id
        )
      ) q
    ) as comments,
    -- records from child table 'reaction' as collection 'reactions'
    (
      select
        -- aggregated row objects for table 'reaction'
        coalesce(jsonb_agg(jsonb_build_object(
          'userId', q."userId",
          'reactionType', q."reactionType"
        )),'[]'::jsonb) json
      from (
        -- base query for table 'reaction'
        select
          r.user_id "userId",
          r.reaction_type "reactionType"
        from
          reaction r
        where (
          r.post_id = p.id
        )
      ) q
    ) as reactions
  from
    post p
) q
