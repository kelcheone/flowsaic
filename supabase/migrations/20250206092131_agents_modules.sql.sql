create table "public"."AgentFlow" (
    "id" uuid not null default gen_random_uuid(),
    "created_at" timestamp with time zone not null default now(),
    "agent_id" uuid not null default gen_random_uuid(),
    "flow" json
);


create table "public"."Agents" (
    "id" uuid not null default gen_random_uuid(),
    "created_at" timestamp with time zone not null default now(),
    "name" text not null,
    "description" text
);


CREATE UNIQUE INDEX "AgentFlow_agent_id_key" ON public."AgentFlow" USING btree (agent_id);

CREATE UNIQUE INDEX "AgentFlow_pkey" ON public."AgentFlow" USING btree (id);

CREATE UNIQUE INDEX "Agents_pkey" ON public."Agents" USING btree (id);

alter table "public"."AgentFlow" add constraint "AgentFlow_pkey" PRIMARY KEY using index "AgentFlow_pkey";

alter table "public"."Agents" add constraint "Agents_pkey" PRIMARY KEY using index "Agents_pkey";

alter table "public"."AgentFlow" add constraint "AgentFlow_agent_id_fkey" FOREIGN KEY (agent_id) REFERENCES "Agents"(id) ON DELETE CASCADE not valid;

alter table "public"."AgentFlow" validate constraint "AgentFlow_agent_id_fkey";

alter table "public"."AgentFlow" add constraint "AgentFlow_agent_id_key" UNIQUE using index "AgentFlow_agent_id_key";

grant delete on table "public"."AgentFlow" to "anon";

grant insert on table "public"."AgentFlow" to "anon";

grant references on table "public"."AgentFlow" to "anon";

grant select on table "public"."AgentFlow" to "anon";

grant trigger on table "public"."AgentFlow" to "anon";

grant truncate on table "public"."AgentFlow" to "anon";

grant update on table "public"."AgentFlow" to "anon";

grant delete on table "public"."AgentFlow" to "authenticated";

grant insert on table "public"."AgentFlow" to "authenticated";

grant references on table "public"."AgentFlow" to "authenticated";

grant select on table "public"."AgentFlow" to "authenticated";

grant trigger on table "public"."AgentFlow" to "authenticated";

grant truncate on table "public"."AgentFlow" to "authenticated";

grant update on table "public"."AgentFlow" to "authenticated";

grant delete on table "public"."AgentFlow" to "service_role";

grant insert on table "public"."AgentFlow" to "service_role";

grant references on table "public"."AgentFlow" to "service_role";

grant select on table "public"."AgentFlow" to "service_role";

grant trigger on table "public"."AgentFlow" to "service_role";

grant truncate on table "public"."AgentFlow" to "service_role";

grant update on table "public"."AgentFlow" to "service_role";

grant delete on table "public"."Agents" to "anon";

grant insert on table "public"."Agents" to "anon";

grant references on table "public"."Agents" to "anon";

grant select on table "public"."Agents" to "anon";

grant trigger on table "public"."Agents" to "anon";

grant truncate on table "public"."Agents" to "anon";

grant update on table "public"."Agents" to "anon";

grant delete on table "public"."Agents" to "authenticated";

grant insert on table "public"."Agents" to "authenticated";

grant references on table "public"."Agents" to "authenticated";

grant select on table "public"."Agents" to "authenticated";

grant trigger on table "public"."Agents" to "authenticated";

grant truncate on table "public"."Agents" to "authenticated";

grant update on table "public"."Agents" to "authenticated";

grant delete on table "public"."Agents" to "service_role";

grant insert on table "public"."Agents" to "service_role";

grant references on table "public"."Agents" to "service_role";

grant select on table "public"."Agents" to "service_role";

grant trigger on table "public"."Agents" to "service_role";

grant truncate on table "public"."Agents" to "service_role";

grant update on table "public"."Agents" to "service_role";


