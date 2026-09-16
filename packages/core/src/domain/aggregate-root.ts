import { DomainEvent } from './domain-event';

export abstract class AggregateRoot {
  protected domainEvents: DomainEvent<unknown>[] = [];

  getDomainEvents(): DomainEvent<unknown>[] {
    return this.domainEvents;
  }

  addEvent(event: DomainEvent<unknown>): void {
    this.domainEvents.push(event);
  }
}
