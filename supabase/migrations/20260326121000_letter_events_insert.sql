-- Allow senders to append operational events for their own letters.
create policy "Senders insert own letter events"
  on public.letter_events for insert
  with check (
    exists (
      select 1 from public.letters l
      where l.id = letter_id and l.sender_id = auth.uid()
    )
  );
