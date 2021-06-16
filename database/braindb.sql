/*==============================================================*/
/* DBMS name:      PostgreSQL 9.x                               */
/* Created on:     6/15/2021 20:23:52                           */
/*==============================================================*/


drop index if exists HAVE_FK;

drop index if exists LOGIN_PK;

drop table if exists LOGIN;

drop index if exists USER_PK;

drop table if exists "user";

/*==============================================================*/
/* Table: LOGIN                                                 */
/*==============================================================*/
create table LOGIN (
   EMAIL                VARCHAR(70)          not null,
   ID                   INT4                 not null,
   PASSWORD             TEXT                 null,
   constraint PK_LOGIN primary key (EMAIL)
);

/*==============================================================*/
/* Index: LOGIN_PK                                              */
/*==============================================================*/
create unique index LOGIN_PK on LOGIN (
EMAIL
);

/*==============================================================*/
/* Index: HAVE_FK                                               */
/*==============================================================*/
create  index HAVE_FK on LOGIN (
ID
);

/*==============================================================*/
/* Table: "user"                                                */
/*==============================================================*/
create table "user" (
   ID                   SERIAL                 not null,
   NAME                 VARCHAR(20)         unique null,
   AVATAR               TEXT                 null,
   ENTRIES              INT4     default 0   not null,
   JOINED               DATE                 null,
   constraint PK_USER primary key (ID)
);

/*==============================================================*/
/* Index: USER_PK                                               */
/*==============================================================*/
create unique index USER_PK on "user" (
ID
);

alter table LOGIN
   add constraint FK_LOGIN_HAVE_USER foreign key (ID)
      references "user" (ID)
      on delete cascade on update cascade;

