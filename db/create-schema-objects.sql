create table "user" (
  id int not null primary key generated always as identity,
  username varchar(30) not null unique,
  firstName varchar(50) not null,
  lastName varchar(50)
);


create table post (
  id int not null primary key generated always as identity,
  title varchar(200) not null,
  content text not null,
  user_id int not null references "user"(id),
  created timestamp with time zone not null
);
create index post_user_ix on post(user_id);
create index post_created_ix on post(created);


create table comment (
  id int not null primary key generated always as identity,
  content text not null,
  post_id int not null references post(id),
  user_id int not null references "user"(id),
  created timestamp with time zone not null
);
create index comment_post_ix on comment(post_id);
create index comment_user_ix on comment(user_id);
create index comment_created_ix on comment(created);


create table notification (
  id int not null primary key generated always as identity,
  user_id int not null references "user"(id),
  message text not null,
  created timestamp with time zone not null,
  read boolean not null default false
);
create index notfn_user_ix on notification(user_id);
create index notfn_created_ix on notification(created);


create table reaction (
  post_id int not null references post(id),
  reaction_type varchar(20) not null,
  user_id int not null references "user"(id),
  constraint pk_reaction primary key (post_id, reaction_type, user_id)
);
create index reaction_user_ix on reaction(user_id);
