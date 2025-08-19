/**
 * Performance monitoring utilities for tracking Core Web Vitals and custom metrics
 */

import { captureMessage, addSentryBreadcrumb } from '@config/sentry'

export interface PerformanceMetric {
  name: string
  value: number
  unit: string
  timestamp: number
  context?: Record<string, unknown>
}

export interface WebVitalsMetrics {
  FCP?: number  // First Contentful Paint
  LCP?: number  // Largest Contentful Paint  
  FID?: number  // First Input Delay
  CLS?: number  // Cumulative Layout Shift
  TTFB?: number // Time to First Byte
}

class PerformanceMonitor {
  private metrics: PerformanceMetric[] = []
  private webVitals: WebVitalsMetrics = {}
  private isMonitoring = import.meta.env.PROD || import.meta.env.VITE_ENABLE_PERFORMANCE_MONITORING

  constructor() {
    if (this.isMonitoring) {
      this.initWebVitalsMonitoring()
      this.initNavigationTiming()
    }
  }

  /**
   * Initialize Core Web Vitals monitoring
   */
  private initWebVitalsMonitoring() {
    // Use web-vitals library pattern without the dependency
    if (typeof window !== 'undefined' && 'PerformanceObserver' in window) {
      // First Contentful Paint
      new PerformanceObserver((entryList) => {
        for (const entry of entryList.getEntries()) {
          if (entry.entryType === 'paint' && entry.name === 'first-contentful-paint') {
            this.webVitals.FCP = entry.startTime
            this.recordMetric('FCP', entry.startTime, 'ms', { type: 'web-vital' })
          }
        }
      }).observe({ entryTypes: ['paint'] })

      // Largest Contentful Paint
      new PerformanceObserver((entryList) => {
        const entries = entryList.getEntries()
        if (entries.length > 0) {
          const lastEntry = entries[entries.length - 1]
          this.webVitals.LCP = lastEntry.startTime
          this.recordMetric('LCP', lastEntry.startTime, 'ms', { type: 'web-vital' })
        }
      }).observe({ entryTypes: ['largest-contentful-paint'] })

      // First Input Delay
      new PerformanceObserver((entryList) => {
        for (const entry of entryList.getEntries()) {
          if (entry.entryType === 'first-input') {
            const fid = (entry as any).processingStart - entry.startTime
            this.webVitals.FID = fid
            this.recordMetric('FID', fid, 'ms', { type: 'web-vital' })
          }
        }
      }).observe({ entryTypes: ['first-input'] })

      // Cumulative Layout Shift
      let clsValue = 0
      new PerformanceObserver((entryList) => {
        for (const entry of entryList.getEntries()) {
          if (!(entry as any).hadRecentInput) {
            clsValue += (entry as any).value
          }
        }
        this.webVitals.CLS = clsValue
        this.recordMetric('CLS', clsValue, 'score', { type: 'web-vital' })
      }).observe({ entryTypes: ['layout-shift'] })
    }
  }

  /**
   * Initialize navigation timing monitoring
   */
  private initNavigationTiming() {
    window.addEventListener('load', () => {
      setTimeout(() => {
        const navigation = performance.getEntriesByType('navigation')[0] as PerformanceNavigationTiming
        if (navigation) {
          // Time to First Byte
          const ttfb = navigation.responseStart - navigation.requestStart
          this.webVitals.TTFB = ttfb
          this.recordMetric('TTFB', ttfb, 'ms', { type: 'navigation' })

          // DOM Content Loaded
          const dcl = navigation.domContentLoadedEventEnd - navigation.fetchStart
          this.recordMetric('DCL', dcl, 'ms', { type: 'navigation' })

          // Page Load Complete
          const loadComplete = navigation.loadEventEnd - navigation.fetchStart
          this.recordMetric('Load', loadComplete, 'ms', { type: 'navigation' })
        }
      }, 0)
    })
  }

  /**
   * Record a custom performance metric
   */
  recordMetric(name: string, value: number, unit: string = 'ms', context?: Record<string, unknown>) {
    const metric: PerformanceMetric = {
      name,
      value,
      unit,
      timestamp: Date.now(),
      context,
    }

    this.metrics.push(metric)

    // Add breadcrumb for debugging
    addSentryBreadcrumb(
      `Performance: ${name} = ${value}${unit}`,
      'performance'
    )

    // Log in development
    if (import.meta.env.DEV) {
      console.log(`[Performance] ${name}: ${value}${unit}`, context)
    }

    // Report critical metrics to error tracking
    if (this.isMonitoring) {
      this.checkPerformanceThresholds(metric)
    }
  }

  /**
   * Check if metrics exceed performance budgets and report issues
   */
  private checkPerformanceThresholds(metric: PerformanceMetric) {
    const thresholds: Record<string, number> = {
      FCP: 2000,    // First Contentful Paint should be < 2s
      LCP: 4000,    // Largest Contentful Paint should be < 4s  
      FID: 300,     // First Input Delay should be < 300ms
      CLS: 0.25,    // Cumulative Layout Shift should be < 0.25
      TTFB: 1500,   // Time to First Byte should be < 1.5s
      DCL: 3000,    // DOM Content Loaded should be < 3s
      Load: 5000,   // Full page load should be < 5s
    }

    const threshold = thresholds[metric.name]
    if (threshold && metric.value > threshold) {
      captureMessage(
        `Performance budget exceeded: ${metric.name} = ${metric.value}${metric.unit} (threshold: ${threshold}${metric.unit})`,
        'warning' as any,
        {
          performance: true,
          metric: metric.name,
          value: metric.value,
          threshold,
          ...metric.context,
        }
      )
    }
  }

  /**
   * Get all recorded metrics
   */
  getMetrics(): PerformanceMetric[] {
    return [...this.metrics]
  }

  /**
   * Get Web Vitals summary
   */
  getWebVitals(): WebVitalsMetrics {
    return { ...this.webVitals }
  }

  /**
   * Measure and record the duration of a function execution
   */
  async measureAsync<T>(name: string, fn: () => Promise<T>, context?: Record<string, unknown>): Promise<T> {
    const start = performance.now()
    try {
      const result = await fn()
      const duration = performance.now() - start
      this.recordMetric(name, duration, 'ms', context)
      return result
    } catch (error) {
      const duration = performance.now() - start
      this.recordMetric(`${name}_error`, duration, 'ms', { ...context, error: true })
      throw error
    }
  }

  /**
   * Measure and record the duration of a synchronous function execution
   */
  measure<T>(name: string, fn: () => T, context?: Record<string, unknown>): T {
    const start = performance.now()
    try {
      const result = fn()
      const duration = performance.now() - start
      this.recordMetric(name, duration, 'ms', context)
      return result
    } catch (error) {
      const duration = performance.now() - start
      this.recordMetric(`${name}_error`, duration, 'ms', { ...context, error: true })
      throw error
    }
  }

  /**
   * Record resource loading metrics
   */
  recordResourceMetrics() {
    const resources = performance.getEntriesByType('resource') as PerformanceResourceTiming[]
    
    const bundleResources = resources.filter(resource => 
      resource.name.includes('.js') || resource.name.includes('.css')
    )

    for (const resource of bundleResources) {
      const loadTime = resource.responseEnd - resource.requestStart
      const resourceName = resource.name.split('/').pop() || 'unknown'
      
      this.recordMetric(
        `resource_${resourceName}`,
        loadTime,
        'ms',
        {
          type: 'resource',
          url: resource.name,
          size: resource.transferSize,
        }
      )
    }
  }
}

// Global performance monitor instance
export const performanceMonitor = new PerformanceMonitor()

/**
 * React hook for measuring component render performance
 */
export function usePerformanceMonitoring(componentName: string) {
  return {
    /**
     * Measure an async operation
     */
    measureAsync: <T>(operationName: string, fn: () => Promise<T>, context?: Record<string, unknown>) =>
      performanceMonitor.measureAsync(`${componentName}_${operationName}`, fn, context),

    /**
     * Measure a synchronous operation  
     */
    measure: <T>(operationName: string, fn: () => T, context?: Record<string, unknown>) =>
      performanceMonitor.measure(`${componentName}_${operationName}`, fn, context),

    /**
     * Record a custom metric for this component
     */
    recordMetric: (metricName: string, value: number, unit: string = 'ms', context?: Record<string, unknown>) =>
      performanceMonitor.recordMetric(`${componentName}_${metricName}`, value, unit, context),
  }
}

/**
 * Initialize performance monitoring when the app loads
 */
export function initPerformanceMonitoring() {
  if (typeof window !== 'undefined') {
    // Record initial metrics after a short delay
    setTimeout(() => {
      performanceMonitor.recordResourceMetrics()
    }, 1000)

    // Report final metrics before page unload
    window.addEventListener('beforeunload', () => {
      const vitals = performanceMonitor.getWebVitals()
      if (Object.keys(vitals).length > 0) {
        addSentryBreadcrumb('Page unload - final Web Vitals', 'performance')
      }
    })
  }
}