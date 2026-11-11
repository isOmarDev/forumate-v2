import { DomainEvent } from '@forumate/core';

export type EventHandler<T extends DomainEvent<unknown>> = (event: T) => void;

export interface IEventBus {
  initialize(): Promise<unknown>;
  stop(): Promise<unknown>;
  publishEvents(events: DomainEvent<unknown>[]): Promise<void>;
  subscribe<T extends DomainEvent<unknown>>(
    eventName: string,
    handler: EventHandler<T>,
  ): void;
  unsubscribe<T extends DomainEvent<unknown>>(
    eventName: string,
    handler: EventHandler<T>,
  ): void;
  clear(): void;
}
