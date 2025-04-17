// Event management utilities
class EventManager {
  constructor() {
    this.events = new Map();
  }

  on(element, event, handler) {
    if (!this.events.has(element)) {
      this.events.set(element, new Map());
    }
    
    const elementEvents = this.events.get(element);
    if (!elementEvents.has(event)) {
      elementEvents.set(event, new Set());
    }
    
    elementEvents.get(event).add(handler);
    element.addEventListener(event, handler);
  }

  off(element, event, handler) {
    if (!this.events.has(element)) return;
    
    const elementEvents = this.events.get(element);
    if (!elementEvents.has(event)) return;
    
    const handlers = elementEvents.get(event);
    handlers.delete(handler);
    element.removeEventListener(event, handler);
    
    if (handlers.size === 0) {
      elementEvents.delete(event);
    }
    
    if (elementEvents.size === 0) {
      this.events.delete(element);
    }
  }

  trigger(element, event, data) {
    if (!this.events.has(element)) return;
    
    const elementEvents = this.events.get(element);
    if (!elementEvents.has(event)) return;
    
    const handlers = elementEvents.get(event);
    handlers.forEach(handler => {
      try {
        handler(data);
      } catch (error) {
        ErrorHandler.handleError(error, `Event handler for ${event}`);
      }
    });
  }

  destroy() {
    this.events.forEach((elementEvents, element) => {
      elementEvents.forEach((handlers, event) => {
        handlers.forEach(handler => {
          element.removeEventListener(event, handler);
        });
      });
    });
    this.events.clear();
  }
}

// Create a global event manager instance
window.eventManager = new EventManager(); 