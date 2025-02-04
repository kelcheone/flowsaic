revoke delete on table "public"."Projects" from "anon";

revoke insert on table "public"."Projects" from "anon";

revoke references on table "public"."Projects" from "anon";

revoke select on table "public"."Projects" from "anon";

revoke trigger on table "public"."Projects" from "anon";

revoke truncate on table "public"."Projects" from "anon";

revoke update on table "public"."Projects" from "anon";

revoke delete on table "public"."Projects" from "authenticated";

revoke insert on table "public"."Projects" from "authenticated";

revoke references on table "public"."Projects" from "authenticated";

revoke select on table "public"."Projects" from "authenticated";

revoke trigger on table "public"."Projects" from "authenticated";

revoke truncate on table "public"."Projects" from "authenticated";

revoke update on table "public"."Projects" from "authenticated";

revoke delete on table "public"."Projects" from "service_role";

revoke insert on table "public"."Projects" from "service_role";

revoke references on table "public"."Projects" from "service_role";

revoke select on table "public"."Projects" from "service_role";

revoke trigger on table "public"."Projects" from "service_role";

revoke truncate on table "public"."Projects" from "service_role";

revoke update on table "public"."Projects" from "service_role";

alter table "public"."Projects" drop constraint "Projects_pkey";

drop index if exists "public"."Projects_pkey";

drop table "public"."Projects";

create table "public"."ModulesFlow" (
    "id" uuid not null default gen_random_uuid(),
    "created_at" timestamp with time zone not null default now(),
    "module_id" uuid not null default gen_random_uuid(),
    "flow" json
);


create table "public"."ModulesManager" (
    "id" uuid not null default gen_random_uuid(),
    "created_at" timestamp with time zone not null default now(),
    "name" text not null,
    "description" text
);


CREATE UNIQUE INDEX "ModulesFlow_id_key" ON public."ModulesFlow" USING btree (id);

CREATE UNIQUE INDEX "ModulesFlow_pkey" ON public."ModulesFlow" USING btree (id);

CREATE UNIQUE INDEX "Projects_pkey" ON public."ModulesManager" USING btree (id);

alter table "public"."ModulesFlow" add constraint "ModulesFlow_pkey" PRIMARY KEY using index "ModulesFlow_pkey";

alter table "public"."ModulesManager" add constraint "Projects_pkey" PRIMARY KEY using index "Projects_pkey";

alter table "public"."ModulesFlow" add constraint "ModulesFlow_id_key" UNIQUE using index "ModulesFlow_id_key";

alter table "public"."ModulesFlow" add constraint "ModulesFlow_module_id_fkey" FOREIGN KEY (module_id) REFERENCES "ModulesManager"(id) ON DELETE CASCADE not valid;

alter table "public"."ModulesFlow" validate constraint "ModulesFlow_module_id_fkey";

grant delete on table "public"."ModulesFlow" to "anon";

grant insert on table "public"."ModulesFlow" to "anon";

grant references on table "public"."ModulesFlow" to "anon";

grant select on table "public"."ModulesFlow" to "anon";

grant trigger on table "public"."ModulesFlow" to "anon";

grant truncate on table "public"."ModulesFlow" to "anon";

grant update on table "public"."ModulesFlow" to "anon";

grant delete on table "public"."ModulesFlow" to "authenticated";

grant insert on table "public"."ModulesFlow" to "authenticated";

grant references on table "public"."ModulesFlow" to "authenticated";

grant select on table "public"."ModulesFlow" to "authenticated";

grant trigger on table "public"."ModulesFlow" to "authenticated";

grant truncate on table "public"."ModulesFlow" to "authenticated";

grant update on table "public"."ModulesFlow" to "authenticated";

grant delete on table "public"."ModulesFlow" to "service_role";

grant insert on table "public"."ModulesFlow" to "service_role";

grant references on table "public"."ModulesFlow" to "service_role";

grant select on table "public"."ModulesFlow" to "service_role";

grant trigger on table "public"."ModulesFlow" to "service_role";

grant truncate on table "public"."ModulesFlow" to "service_role";

grant update on table "public"."ModulesFlow" to "service_role";

grant delete on table "public"."ModulesManager" to "anon";

grant insert on table "public"."ModulesManager" to "anon";

grant references on table "public"."ModulesManager" to "anon";

grant select on table "public"."ModulesManager" to "anon";

grant trigger on table "public"."ModulesManager" to "anon";

grant truncate on table "public"."ModulesManager" to "anon";

grant update on table "public"."ModulesManager" to "anon";

grant delete on table "public"."ModulesManager" to "authenticated";

grant insert on table "public"."ModulesManager" to "authenticated";

grant references on table "public"."ModulesManager" to "authenticated";

grant select on table "public"."ModulesManager" to "authenticated";

grant trigger on table "public"."ModulesManager" to "authenticated";

grant truncate on table "public"."ModulesManager" to "authenticated";

grant update on table "public"."ModulesManager" to "authenticated";

grant delete on table "public"."ModulesManager" to "service_role";

grant insert on table "public"."ModulesManager" to "service_role";

grant references on table "public"."ModulesManager" to "service_role";

grant select on table "public"."ModulesManager" to "service_role";

grant trigger on table "public"."ModulesManager" to "service_role";

grant truncate on table "public"."ModulesManager" to "service_role";

grant update on table "public"."ModulesManager" to "service_role";


