export type Timestamps = 'createdAt' | 'updatedAt';

/** A Prisma model without the DB-managed timestamp columns. */
export type Persistence<TModel> = Omit<TModel, Timestamps>;
