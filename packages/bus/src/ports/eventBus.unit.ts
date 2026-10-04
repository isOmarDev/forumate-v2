import { DomainEvent } from '@forumate/core';

import { InMemoryEventBus } from '../adapters/inMemoryEventBus';

import { IEventBus } from './eventBus';

type EventData = { data: string };

class TestEvent extends DomainEvent<EventData> {
  static readonly eventName = 'TestEvent';

  constructor(data: string) {
    super(TestEvent.eventName, 'testEventId', { data });
  }
}

class AnotherTestEvent extends DomainEvent<EventData> {
  static readonly eventName = 'AnotherTestEvent';

  constructor(data: string) {
    super(AnotherTestEvent.eventName, 'anotherTestEventId', { data });
  }
}

describe('EventBus', () => {
  let eventBus: IEventBus;

  beforeEach(() => {
    eventBus = new InMemoryEventBus();
  });

  it('should register an event listener', async () => {
    const listener = jest.fn();
    const testEvent = new TestEvent('testData');

    eventBus.subscribe(TestEvent.eventName, listener);
    await eventBus.publishEvents([testEvent]);

    expect(listener).toHaveBeenCalledWith(testEvent);
  });

  it('should emit an event to multiple listeners', async () => {
    const listener1 = jest.fn();
    const listener2 = jest.fn();

    eventBus.subscribe(TestEvent.eventName, listener1);
    eventBus.subscribe(TestEvent.eventName, listener2);

    const testEvent = new TestEvent('testData');

    await eventBus.publishEvents([testEvent]);

    expect(listener1).toHaveBeenCalledWith(testEvent);
    expect(listener2).toHaveBeenCalledWith(testEvent);
  });

  it('should not call listeners for different events', async () => {
    const listener = jest.fn();
    eventBus.subscribe(TestEvent.eventName, listener);

    const testEvent = new TestEvent('testData');
    const differentEvent = new AnotherTestEvent('differentData');

    await eventBus.publishEvents([testEvent]);
    await eventBus.publishEvents([differentEvent]);

    expect(listener).toHaveBeenCalledTimes(1);
    expect(listener).toHaveBeenCalledWith(testEvent);
    expect(listener).not.toHaveBeenCalledWith(differentEvent);
  });

  it('should remove an event listener', async () => {
    const listener = jest.fn();
    eventBus.subscribe(TestEvent.eventName, listener);
    eventBus.unsubscribe(TestEvent.eventName, listener);

    const testEvent = new TestEvent('testData');

    await eventBus.publishEvents([testEvent]);

    expect(listener).not.toHaveBeenCalled();
  });
});
