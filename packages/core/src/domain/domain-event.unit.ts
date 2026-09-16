import { randomUUID } from 'node:crypto';

import { DomainEvent } from './domain-event';
import { DomainEventStatus } from './domain-event';

interface TestEventProps {
  aggregateId: string;
  testDataField: string;
}

export class TestEvent extends DomainEvent<TestEventProps> {
  private constructor(
    props: TestEventProps,
    id?: string,
    retries?: number,
    status?: DomainEventStatus,
    createdAt?: string,
  ) {
    super(
      'TestEvent',
      props.aggregateId,
      props,
      id,
      retries,
      status,
      createdAt,
    );
  }

  public static create(data: TestEventProps) {
    return new TestEvent(data);
  }
}

describe('domainEvent', () => {
  const aggregateId = randomUUID();

  it('should be able to create a domain event', () => {
    const event = TestEvent.create({ testDataField: 'John', aggregateId });
    expect(event).toBeDefined();
  });

  it('should be able to get the event name', () => {
    const event = TestEvent.create({ testDataField: 'John', aggregateId });
    expect(event.name).toBe('TestEvent');
  });

  it('should be able to get the event props', () => {
    const event = TestEvent.create({ testDataField: 'John', aggregateId });
    expect(event.data).toEqual({ testDataField: 'John', aggregateId });
  });

  it('should start out in the initial state', () => {
    const event = TestEvent.create({ testDataField: 'John', aggregateId });
    expect(event.status).toEqual('INITIAL');
  });

  it('should be able to transition to the published state', () => {
    const event = TestEvent.create({ testDataField: 'John', aggregateId });
    event.markPublished();
    expect(event.status).toEqual('PUBLISHED');
  });

  it('should be able to record a failure to publish', () => {
    const event = TestEvent.create({ testDataField: 'John', aggregateId });
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
