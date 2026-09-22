import { DomainEvent } from '@forumate/core';

export interface IEventBus {
  initialize(): Promise<unknown>;
  stop(): Promise<unknown>;
  publishEvents(events: DomainEvent<unknown>[]): void;
  subscribe<T extends DomainEvent<unknown>>(
    eventTypeName: string,
    handler: (event: T) => void,
  ): void;
  unsubscribe(
    eventTypeName: string,
    handler: (event: DomainEvent<unknown>) => void,
  ): void;
  clear(): void;
}
