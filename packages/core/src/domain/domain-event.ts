import { randomUUID } from 'node:crypto';

import { EventModel } from './event-model';

export type DomainEventStatus = 'INITIAL' | 'RETRYING' | 'PUBLISHED' | 'FAILED';

export class DomainEvent<T> {
  constructor(
    public readonly name: string,
    public readonly aggregateId: string,
    public readonly data: T,
    public readonly id: string = randomUUID(),
    private _retries: number = 0,
    private _status: DomainEventStatus = 'INITIAL',
    public readonly createdAt: string = new Date().toISOString(),
  ) {}

  get retries() {
    return this._retries;
  }

  get status() {
    return this._status;
  }

  public serializeData() {
    return JSON.stringify(this.data);
  }

  public serialize() {
    return JSON.stringify(this);
  }

  public markPublished() {
    this._status = 'PUBLISHED';
  }

  public recordFailureToProcess() {
    this._retries++;

    if (this.retries === 3) {
      this._status = 'FAILED';
      return;
    }

    this._status = 'RETRYING';
  }

  public static toDomain<T>(eventModel: EventModel): DomainEvent<T> {
    return new DomainEvent<T>(
      eventModel.name,
      eventModel.aggregateId,
      JSON.parse(eventModel.data) as T,
      eventModel.id,
      eventModel.retries,
      eventModel.status as DomainEventStatus,
      eventModel.createdAt.toISOString(),
    );
  }
}
