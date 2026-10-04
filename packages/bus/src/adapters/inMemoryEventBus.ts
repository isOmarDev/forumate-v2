import { DomainEvent } from '@forumate/core';

import { EventHandler, IEventBus } from '../ports/eventBus';

export class InMemoryEventBus implements IEventBus {
  private subscriptions: Map<
    string,
    Array<EventHandler<DomainEvent<unknown>>>
  > = new Map();

  async initialize(): Promise<void> {}

  async stop(): Promise<void> {}

  async publishEvents(events: DomainEvent<unknown>[]): Promise<void> {
    for (const event of events) {
      const eventType = event.name;
      const handlers = this.subscriptions.get(eventType);

      if (!handlers) {
        continue;
      }

      console.log(`Publishing event: ${eventType}`);

      const results = await Promise.allSettled(
        handlers.map((handler) => handler(event)),
      );

      const failures = results.filter(
        (r): r is PromiseRejectedResult => r.status === 'rejected',
      );

      if (failures.length > 0) {
        console.error(
          `${failures.length} handler(s) failed for event "${eventType}"`,
          failures.map((f) => f.reason),
        );
      }
    }
  }

  subscribe<T extends DomainEvent<unknown>>(
    eventName: string,
    handler: EventHandler<T>,
  ): void {
    const handlers = this.subscriptions.get(eventName) ?? [];

    handlers.push(handler as EventHandler<DomainEvent<unknown>>);

    this.subscriptions.set(eventName, handlers);
  }

  unsubscribe<T extends DomainEvent<unknown>>(
    eventName: string,
    handler: EventHandler<T>,
  ): void {
    const handlers = this.subscriptions.get(eventName);

    if (!handlers) {
      return;
    }

    const index = handlers.indexOf(
      handler as EventHandler<DomainEvent<unknown>>,
    );
    if (index !== -1) {
      handlers.splice(index, 1);
    }

    if (handlers.length === 0) {
      this.subscriptions.delete(eventName);
    }
  }

  clear(): void {
    this.subscriptions.clear();
  }
}
