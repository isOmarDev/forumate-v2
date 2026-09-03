import { DomainEvent } from '@forumate/core';

export interface IEventBus {
  initialize(): Promise<unknown>;
  stop(): Promise<unknown>;
  publishEvents(events: DomainEvent[]): void;
  subscribe<T extends DomainEvent>(
    eventTypeName: string,
    handler: (event: T) => void,
  ): void;
  unsubscribe(
    eventTypeName: string,
    handler: (event: DomainEvent) => void,
  ): void;
}
