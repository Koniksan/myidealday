-- Run this in your Supabase SQL editor to set up the schema.

create table if not exists tasks (
    id         uuid        primary key default gen_random_uuid(),
    user_id    uuid        references auth.users(id) on delete cascade not null default auth.uid(),
    date       date        not null,
    label      text        not null,
    checked    boolean     not null default false,
    position   integer     not null default 0,
    created_at timestamptz not null default now()
);

create index if not exists tasks_user_date_idx on tasks (user_id, date);

-- Row-level security: each user can only access their own tasks.
alter table tasks enable row level security;

create policy "Users can manage their own tasks"
    on tasks
    for all
    using (auth.uid() = user_id)
    with check (auth.uid() = user_id);
