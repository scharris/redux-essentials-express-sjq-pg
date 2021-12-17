import { EntityState } from '@reduxjs/toolkit';

export function sortedEntities<T>
  (
    entityState: EntityState<T>,
    compare: (t1: T, t2: T) => number
  )
  : T[]
{
  const res = [];

  for (const id of entityState.ids)
  {
    const entity = entityState.entities[id];
    if (entity)
      res.push(entity);
  }

  res.sort(compare);

  return res;
}
