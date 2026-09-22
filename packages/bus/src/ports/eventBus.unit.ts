import { DomainEvent } from '@forumate/core';

import { InMemoryEventBus } from '../adapters/inMemoryEventBus';

import { IEventBus } from './eventBus';

type EventData = { data: string };
type TestEventData = EventData;
type AnotherTestEventData = EventData;

class TestEvent extends DomainEvent<TestEventData> {
  constructor(data: string) {
    super('TestEvent', 'testEventId', { data });
  }
}

class AnotherTestEvent extends DomainEvent<AnotherTestEventData> {
  constructor(data: string) {
    super('AnotherTestEvent', 'anotherTestEventId', { data });
  }
}

describe('EventBus', () => {
  let eventBus: IEventBus;

  beforeEach(() => {
    eventBus = new InMemoryEventBus();
  });

  it('should register an event listener', () => {
    const listener = jest.fn();
    const testEvent = new TestEvent('testData');
    eventBus.subscribe('TestEvent', listener);
    eventBus.publishEvents([testEvent]);
    expect(listener).toHaveBeenCalledWith(testEvent);
  });

  it('should emit an event to multiple listeners', () => {
    const listener1 = jest.fn();
    const listener2 = jest.fn();
    eventBus.subscribe('TestEvent', listener1);
    eventBus.subscribe('TestEvent', listener2);
    const testEvent = new TestEvent('testData');
    eventBus.publishEvents([testEvent]);
    expect(listener1).toHaveBeenCalledWith(testEvent);
    expect(listener2).toHaveBeenCalledWith(testEvent);
  });

  it('should not call listeners for different events', () => {
    const listener = jest.fn();
    eventBus.subscribe('TestEvent', listener);

    const testEvent = new TestEvent('testData');
    const differentEvent = new AnotherTestEvent('differentData');

    eventBus.publishEvents([testEvent]);
    eventBus.publishEvents([differentEvent]);

    expect(listener).toHaveBeenCalledTimes(1);
    expect(listener).toHaveBeenCalledWith(testEvent);
    expect(listener).not.toHaveBeenCalledWith(differentEvent);
  });

  it('should remove an event listener', () => {
    const listener = jest.fn();
    eventBus.subscribe('TestEvent', listener);
    eventBus.unsubscribe('TestEvent', listener);

    const testEvent = new TestEvent('testData');
    eventBus.publishEvents([testEvent]);

    expect(listener).not.toHaveBeenCalled();
  });
});
