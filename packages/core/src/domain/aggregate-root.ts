import { DomainEvent } from './domain-event';

export abstract class AggregateRoot {
  protected domainEvents: DomainEvent<unknown>[] = [];

  public getDomainEvents(): DomainEvent<unknown>[] {
    return this.domainEvents;
  }

  public addDomainEvent(event: DomainEvent<unknown>): void {
    this.domainEvents.push(event);
  }

  public clearDomainEvents(): void {
    this.domainEvents = [];
  }
}
