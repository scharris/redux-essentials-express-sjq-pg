insert into "user" (username, firstname, lastname)
  values
    ('hjames', 'Henry', 'James'),
    ('sharris', 'Steve', 'Harris'),
    ('ecummins', 'Eliza', 'Cummins')
;

insert into post (title, content, user_id, created)
  values
    ('Kangaroos and Rats',
     'A pomegranate is a sympathetic hamster. Washing and polishing the car,a vigorous cranberry''s fish comes with it the thought that the practical lemon is a rat. Though we assume the latter, the first tough eagle is, in its own way, a cherry. We know that a self-assured cheetah is a kumquat of the mind. The rat of a bird becomes a sincere duck. The pro-active pig reveals itself as a painstaking lemon to those who look. Few can name a convivial kangaroo that isn''t an easygoing strawberry!',
     1, now() - interval '4 minute'),
    ('Spider Discredit?',
     'This is not to discredit the idea that we can assume that any instance of a tiger can be construed as a kind spider.',
     1, now() - interval '1 day - 6 hour'),
    ('Spider Discredit?',
     'Can we assume any instance of a tiger can be construed as a kind spider?',
     2, now() - interval '3 day - 8 hour'),
    ('Kangaroos and Rats',
     'Not sure myself if a pomegranate is a sympathetic hamster or we know that a self-assured cheetah is a kumquat of the mind. The rat of a bird becomes a sincere duck. The pro-active pig reveals itself as a painstaking lemon to those who look. Few can name a convivial kangaroo that isn''t an easygoing strawberry!',
     2, now()),
    ('Squirrels, Zebras and Ducks',
     'The forceful squirrel comes from a polite blueberry! Eminent zebras show us how bananas can be hippopotamus. Unfortunately, that is wrong; on the contrary, a gregarious banana''s blueberry comes with it the thought that the alluring grapes is a strawberry? They were lost without the dynamic banana that composed their duck.',
     2, now())
;

insert into comment (content, post_id, user_id, created)
  values
    ('I lost you at the very end there.', 1, 2, now() - interval '1 minute'),
    ('What has this to do with tigers?', 2, 2, now() - interval '1 day - 5 hour'),
    ('That is an excellent point, Steve', 3, 1, now() - interval '3 day - 5 hour')
;

insert into notification (user_id, message, created)
  values
    (1, 'A comment was added on post "Kangaroos and Rats".', now() - interval '1 minute'),
    (1, 'A comment was added on post "Spider Discredit?".', now() - interval '1 day - 5 hour'),
    (2, 'A comment was added on post "Spider Discredit?".', now() - interval '3 day - 8 hour')
;

insert into reaction (post_id, reaction_type, user_id)
  values
    (1, 'thumbsUp', 2),
    (1, 'eyes', 3),
    (2, 'eyes', 2),
    (3, 'heart', 1),
    (3, 'heart', 3),
    (3, 'thumbsUp', 3)
;
