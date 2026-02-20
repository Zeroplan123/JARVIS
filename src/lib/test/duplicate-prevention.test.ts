/**
 * Duplicate Prevention System Tests
 * Manual testing functions for cooldown, single-flight guard, and rising-edge detection
 */

import { JarvisStateMachine } from '../state/machine.js';

// Simple test framework
interface TestResult {
  name: string;
  passed: boolean;
  error?: string;
}

class TestRunner {
  private results: TestResult[] = [];

  test(name: string, testFn: () => void | Promise<void>): void {
    try {
      const result = testFn();
      if (result instanceof Promise) {
        result
          .then(() => this.results.push({ name, passed: true }))
          .catch((error) => this.results.push({ name, passed: false, error: error.message }));
      } else {
        this.results.push({ name, passed: true });
      }
    } catch (error) {
      this.results.push({ 
        name, 
        passed: false, 
        error: error instanceof Error ? error.message : String(error) 
      });
    }
  }

  expect(actual: any) {
    return {
      toBe: (expected: any) => {
        if (actual !== expected) {
          throw new Error(`Expected ${expected}, got ${actual}`);
        }
      },
      toHaveBeenCalledTimes: (times: number) => {
        if (actual.callCount !== times) {
          throw new Error(`Expected ${times} calls, got ${actual.callCount}`);
        }
      },
      toHaveBeenCalledWith: (...args: any[]) => {
        if (!actual.lastCall || !this.arraysEqual(actual.lastCall, args)) {
          throw new Error(`Expected call with ${JSON.stringify(args)}, got ${JSON.stringify(actual.lastCall)}`);
        }
      }
    };
  }

  private arraysEqual(a: any[], b: any[]): boolean {
    return a.length === b.length && a.every((val, i) => val === b[i]);
  }

  getResults(): TestResult[] {
    return this.results;
  }

  printResults(): void {
    console.log('\n=== Test Results ===');
    this.results.forEach(result => {
      const status = result.passed ? '✅ PASS' : '❌ FAIL';
      console.log(`${status}: ${result.name}`);
      if (!result.passed && result.error) {
        console.log(`   Error: ${result.error}`);
      }
    });
    
    const passed = this.results.filter(r => r.passed).length;
    const total = this.results.length;
    console.log(`\nResults: ${passed}/${total} tests passed`);
  }
}

// Mock callback tracker
class MockCallback {
  callCount = 0;
  lastCall: any[] = [];

  fn = (...args: any[]) => {
    this.callCount++;
    this.lastCall = args;
  };

  reset() {
    this.callCount = 0;
    this.lastCall = [];
  }
}

// Test Suite for Duplicate Prevention
export function runDuplicatePreventionTests(): void {
  const runner = new TestRunner();
  
  // Test 1: Cooldown Protection
  runner.test('should block wake word during cooldown period', () => {
    const stateMachine = new JarvisStateMachine({
      cooldownMs: 1500,
      maxCommandDurationMs: 10000,
      maxProcessingTimeMs: 30000,
      wakeUpDelayMs: 300
    });

    const mockStateChange = new MockCallback();
    stateMachine.setCallbacks({
      onStateChange: mockStateChange.fn
    });
    
    stateMachine.initialize();

    // First wake word should succeed
    const success1 = stateMachine.onWakeWordDetected();
    runner.expect(success1).toBe(true);
    runner.expect(mockStateChange).toHaveBeenCalledTimes(1);
    runner.expect(mockStateChange).toHaveBeenCalledWith('waking_up', 'passive');

    // Second wake word within cooldown should fail
    const success2 = stateMachine.onWakeWordDetected();
    runner.expect(success2).toBe(false);
    
    // Should not change state again
    runner.expect(mockStateChange).toHaveBeenCalledTimes(1);
    
    stateMachine.destroy();
  });

  // Test 2: Single-Flight Guard
  runner.test('should prevent multiple concurrent wake word processing', () => {
    const stateMachine = new JarvisStateMachine({
      cooldownMs: 1500,
      maxCommandDurationMs: 10000,
      maxProcessingTimeMs: 30000,
      wakeUpDelayMs: 300
    });

    const mockStateChange = new MockCallback();
    stateMachine.setCallbacks({
      onStateChange: mockStateChange.fn
    });
    
    stateMachine.initialize();

    // First wake word
    const success1 = stateMachine.onWakeWordDetected();
    runner.expect(success1).toBe(true);

    // Simulate time advance to recording_cmd state
    setTimeout(() => {
      // Another wake word should be blocked by single-flight guard
      const success2 = stateMachine.onWakeWordDetected();
      runner.expect(success2).toBe(false);
    }, 300);
    
    stateMachine.destroy();
  });

  // Test 3: State Machine Integrity
  runner.test('should maintain correct state transitions', () => {
    const stateMachine = new JarvisStateMachine({
      cooldownMs: 1500,
      maxCommandDurationMs: 10000,
      maxProcessingTimeMs: 30000,
      wakeUpDelayMs: 300
    });

    const stateChanges: string[] = [];
    stateMachine.setCallbacks({
      onStateChange: (newState: string, _oldState: string) => {
        stateChanges.push(newState);
      }
    });
    
    stateMachine.initialize();

    // Complete wake word cycle
    stateMachine.onWakeWordDetected();
    
    setTimeout(() => {
      stateMachine.onCommandReceived('test');
      stateMachine.onProcessingComplete();
      stateMachine.onSpeakingComplete();

      runner.expect(stateChanges).toBe([
        'waking_up',
        'recording_cmd',
        'processing',
        'speaking',
        'passive'
      ]);
    }, 350);
    
    stateMachine.destroy();
  });

  // Test 4: Performance Test
  runner.test('should handle rapid wake word attempts efficiently', () => {
    const stateMachine = new JarvisStateMachine({
      cooldownMs: 1500,
      maxCommandDurationMs: 10000,
      maxProcessingTimeMs: 30000,
      wakeUpDelayMs: 300
    });

    const mockStateChange = new MockCallback();
    stateMachine.setCallbacks({
      onStateChange: mockStateChange.fn
    });
    
    stateMachine.initialize();

    const startTime = performance.now();
    
    // Attempt 100 rapid wake words
    for (let i = 0; i < 100; i++) {
      stateMachine.onWakeWordDetected();
    }
    
    const endTime = performance.now();
    const duration = endTime - startTime;
    
    // Should complete in reasonable time (< 50ms for 100 attempts)
    if (duration >= 50) {
      throw new Error(`Performance test failed: ${duration}ms for 100 attempts`);
    }
    
    // Should only process the first one
    runner.expect(mockStateChange).toHaveBeenCalledTimes(1);
    
    stateMachine.destroy();
  });

  // Print results
  runner.printResults();
}

// Example usage - call this function to run the tests
// runDuplicatePreventionTests();
