import { randomUUID } from 'node:crypto';

import { DomainEvent } from './domain-event';

type EventData = { data: string };
const testData = 'jhon';

export class TestEvent extends DomainEvent<EventData> {
  static readonly eventName = 'TestEvent';

  constructor(data: string) {
    super(TestEvent.eventName, randomUUID(), { data });
  }
}

describe('domainEvent', () => {
  it('should be able to create a domain event', () => {
    const event = new TestEvent('John');
    expect(event).toBeDefined();
  });

  it('should be able to get the event name', () => {
    const event = new TestEvent(testData);
    expect(event.name).toBe('TestEvent');
  });

  it('should be able to get the event props', () => {
    const event = new TestEvent(testData);
    expect(event.data).toEqual({ data: testData });
  });

  it('should start out in the initial state', () => {
    const event = new TestEvent(testData);
    expect(event.status).toEqual('INITIAL');
  });

  it('should be able to transition to the published state', () => {
    const event = new TestEvent(testData);
    event.markPublished();
    expect(event.status).toEqual('PUBLISHED');
  });

  it('should be able to record a failure to publish', () => {
    const event = new TestEvent(testData);
    expect(event.retries).toEqual(0);
    event.recordFailureToProcess();

    expect(event.retries).toEqual(1);
    expect(event.status).toEqual('RETRYING');

    event.recordFailureToProcess();

    expect(event.retries).toEqual(2);
    expect(event.status).toEqual('RETRYING');

    event.recordFailureToProcess();

    expect(event.retries).toEqual(3);
    expect(event.status).toEqual('FAILED');
  });
});
