/**
 * Tour management hook using Driver.js for onboarding
 * 
 * Provides execution-first tour for new users to demonstrate
 * AI sovereignty and platform capabilities
 */

import { useCallback } from 'react'
import { useNavigate } from 'react-router-dom'
import { driver, type Driver, type DriveStep } from 'driver.js'
import { useTourStore } from '@stores/tourStore'
import { useThemeStore } from '@stores/themeStore'
import { agentsApi } from '@api/agents'
import 'driver.js/dist/driver.css'

// CSS to prevent interaction with highlighted elements during tour
const injectTourInteractionStyles = () => {
  const styleId = 'tour-interaction-styles'
  if (!document.getElementById(styleId)) {
    const styleSheet = document.createElement('style')
    styleSheet.id = styleId
    styleSheet.textContent = `
      .tour-no-interaction {
        pointer-events: none !important;
      }
      .tour-no-interaction * {
        pointer-events: none !important;
      }
      /* Make tour popovers slightly wider - override Driver.js defaults */
      .driver-popover {
        min-width: 350px !important;
        width: 350px !important;
      }
      .driver-popover-content {
        width: 100% !important;
      }
      .driver-popover-title {
        max-width: none !important;
      }
      .driver-popover-description {
        max-width: none !important;
        width: 100% !important;
      }
      /* Gradient text for click instructions */
      .tour-action {
        background: linear-gradient(135deg, #00b6a0 0%, #47a1d9 100%);
        -webkit-background-clip: text;
        -webkit-text-fill-color: transparent;
        background-clip: text;
        font-weight: 600;
        display: inline-block;
      }
    `
    document.head.appendChild(styleSheet)
  }
}

interface TourHook {
  startExecutionFirstTour: () => void
  hasCompletedTour: boolean
  markTourComplete: () => void
  resetTour: () => void
}

export function useTour(): TourHook {
  const navigate = useNavigate()
  const {
    hasCompletedTour,
    markTourComplete: storeMark,
    resetTour: storeReset,
    setTourActive
  } = useTourStore()

  // Tour step templates without driver instance references
  const getTourSteps = (getDriverInstance: () => Driver, originalTheme?: string): DriveStep[] => {
    const steps: DriveStep[] = []

    // Helper function to wait for elements with configurable polling
    const waitForElement = (
      selector: string,
      callback: (element: Element | null) => void,
      options: {
        maxAttempts?: number
        intervalMs?: number
        onTimeout?: () => void
      } = {}
    ) => {
      const {
        maxAttempts = 20,  // Default: 10 seconds with 500ms intervals
        intervalMs = 500,
        onTimeout
      } = options

      let attempts = 0

      const checkElement = () => {
        attempts++
        const element = document.querySelector(selector)

        if (element) {
          callback(element)
          return
        }

        if (attempts < maxAttempts) {
          setTimeout(checkElement, intervalMs)
        } else {
          console.warn(`Tour: Element ${selector} not found after ${attempts * intervalMs}ms`)
          if (onTimeout) {
            onTimeout()
          } else {
            callback(null)
          }
        }
      }

      // Start checking immediately
      checkElement()
    }

    // Add theme switching confirmation step if needed
    if (originalTheme && originalTheme !== 'light') {
      steps.push({
        popover: {
          title: '🎨Theme Switch',
          description: `Tour looks best in light theme.<br><br>
We'll restore ${originalTheme} theme when done.`,
          side: 'top',
          align: 'center',
          showButtons: ['close', 'next'],
          nextBtnText: 'Start Tour →',
          onNextClick: () => {
            console.log('Tour: Switching to light theme')
            useThemeStore.getState().setTheme('light')
            getDriverInstance().moveNext()
          },
          onCloseClick: () => {
            console.log('Tour: User declined theme switch')
            storeMark('execution-first')
            setTourActive(false)
            getDriverInstance().destroy()
          }
        }
      })
    }

    // Add the regular tour steps
    steps.push(
    // Step 1 (or 2): Welcome Modal (free-floating)
    {
      popover: {
        title: 'Welcome to AI Sovereignty 🎉',
        description: `You now have a complete AI agent platform running on your local machine.<br><br>This quick tour will show you how to execute AI agents locally.`,
        side: 'top',
        align: 'center',
        showButtons: ['next', 'close']  // Hide Back button on welcome step
      }
    },

    // Step 2: Dashboard Overview
    {
      element: '[data-tour="dashboard-header"]',
      popover: {
        title: 'Your Command Center 📊',
        description: 'This dashboard provides real-time visibility into your AI infrastructure:<br><br>• <strong>Running Agents:</strong> Active containers and their status<br>• <strong>Recent Executions:</strong> Latest agent activity<br>• <strong>System Health:</strong> Resource usage and performance<br><br>Designed to run locally on your infrastructure.',
        side: 'bottom',
        align: 'start'
      }
    },

    // Step 3: Navigate to Agents
    {
      element: '[data-tour="agents-nav"]',
      popover: {
        title: 'Your Agent Library',
        description: 'View and manage your AI agents from this section.<br><br>We\'ve pre-installed a hello-world-agent to demonstrate the platform.<br><br><span class="tour-action">Click "Agents" to continue.</span>',
        side: 'right',
        align: 'start',
        showButtons: ['previous', 'close']
      },
      onHighlighted: (element) => {
        // Detect when user clicks the actual Agents link
        const agentsLink = element as HTMLElement
        agentsLink.addEventListener('click', () => {
          // Wait for the agents page to load and card to appear
          waitForElement(
            '[data-tour="hello-world-agent-card"]',
            (card) => {
              if (card) {
                getDriverInstance().moveNext()
              }
            },
            {
              maxAttempts: 10,
              intervalMs: 200  // Check frequently for smooth transition
            }
          )
        }, { once: true })
      }
    },

    // Step 4: Show Agent Card (first step on Agents page)
    {
      element: '[data-tour="hello-world-agent-card"]',
      popover: {
        title: 'Your First Agent',
        description: 'The <strong>hello-world-agent</strong> demonstrates how agents run in isolated containers.<br><br><span class="tour-action">Click the agent card to continue.</span>',
        side: 'top',
        align: 'start',
        showButtons: ['close']
      },
      onHighlighted: (element) => {
        // Detect when user clicks the agent card
        const agentCard = element as HTMLElement
        agentCard.addEventListener('click', () => {
          // Wait for the agent detail page to load AND the start button to appear
          // The start button only appears when agent is stopped
          waitForElement(
            '[data-tour="start-agent-button"]',
            (startButton) => {
              if (startButton) {
                console.log('Tour: Start button found, agent is stopped')
                getDriverInstance().moveNext()
              }
            },
            {
              maxAttempts: 20,  // Give more time for agent to stop if needed
              intervalMs: 300,
              onTimeout: () => {
                // If button never appears, agent might still be running
                console.warn('Tour: Start button not found, agent may still be running')
                // Try to proceed anyway
                getDriverInstance().moveNext()
              }
            }
          )
        }, { once: true })
      }
    },

    // Step 5: Turn On Agent (first step on Agent Detail page)
    {
      element: '[data-tour="start-agent-button"]',
      popover: {
        title: 'Start Your Agent',
        description: 'AgentSystems manages containers on-demand to save resources.<br><br><span class="tour-action">Click "Turn On" to continue.</span>',
        side: 'top',
        align: 'start',
        showButtons: ['close']  // Hide Back button since this is first step on new page
      },
      onHighlighted: (element) => {
        // Detect when user clicks the start button
        const startButton = element as HTMLElement
        startButton.addEventListener('click', () => {
          // Wait for agent metadata to appear after starting
          waitForElement(
            '[data-tour="agent-metadata"]',
            (metadata) => {
              if (metadata) {
                // Give a moment for the metadata to fully render
                setTimeout(() => getDriverInstance().moveNext(), 500)
              }
            },
            {
              maxAttempts: 20,  // 10 seconds for agent to start
              intervalMs: 500
            }
          )
        }, { once: true })
      }
    },

    // Step 6: Agent Metadata (shows runtime information)
    {
      element: '[data-tour="agent-metadata"]',
      popover: {
        title: 'Your Agent is Ready 🤖',
        description: 'The agent has started and reported its metadata.<br><br>Key information:<br>• <strong>Status:</strong> Running in container<br>• <strong>Model:</strong> Local AI model configured<br>• <strong>Version:</strong> Agent version and capabilities<br><br>Processing is designed for local infrastructure.',
        side: 'top',
        align: 'start',
        showButtons: ['next', 'close']  // Hide Back button since start button state has changed
      }
    },

    // Step 7: Execute Agent
    {
      element: '[data-tour="execute-agent-button"]',
      popover: {
        title: 'Execute Your Agent Locally',
        description: 'The agent will process this request using your local compute resources.<br><br><span class="tour-action">Click "Execute" to continue.</span>',
        side: 'top',
        align: 'start',
        showButtons: ['previous', 'close']
      },
      onHighlighted: (element) => {
        // Detect when user clicks the execute button
        const executeButton = element as HTMLElement
        executeButton.addEventListener('click', () => {
          // Wait for execution status element to appear
          waitForElement(
            '[data-tour="execution-status"]',
            (statusEl) => {
              if (statusEl) {
                // Move to next step to highlight the status
                getDriverInstance().moveNext()
              }
            },
            {
              maxAttempts: 10,  // 5 seconds
              intervalMs: 500
            }
          )
        }, { once: true })
      }
    },

    // Step 8: Execution Status (while running)
    {
      element: '[data-tour="execution-status"]',
      popover: {
        title: 'Agent Processing 🔄',
        description: 'Your agent is processing the request.<br><br>Execution status appears here in real-time.',
        side: 'top',
        align: 'start',
        showButtons: ['close']
      },
      onHighlighted: async () => {
        // First wait for the execution status element to appear
        waitForElement(
          '[data-tour="execution-status"]',
          (statusElement) => {
            if (!statusElement) {
              console.warn('Tour: Execution status element never appeared, skipping')
              setTimeout(() => getDriverInstance().moveNext(), 1000)
              return
            }

            // Now poll for execution completion
            let attempts = 0
            const maxAttempts = 60 // 60 seconds max wait

            const checkForCompletion = () => {
              attempts++

              // Check if results are ready
              const resultsElement = document.querySelector('[data-tour="execution-results"]')
              if (resultsElement && resultsElement.textContent && resultsElement.textContent.length > 10) {
                // Results are ready, auto-advance
                setTimeout(() => getDriverInstance().moveNext(), 500)
                return
              }

              if (attempts < maxAttempts) {
                setTimeout(checkForCompletion, 1000)
              } else {
                console.warn('Tour: Execution took too long, proceeding anyway')
                setTimeout(() => getDriverInstance().moveNext(), 500)
              }
            }

            // Start checking for completion after a brief delay
            setTimeout(checkForCompletion, 2000)
          },
          {
            maxAttempts: 20,  // 10 seconds
            intervalMs: 500
          }
        )
      }
    },

    // Step 9: Execution Results
    {
      element: '[data-tour="execution-results"]',
      popover: {
        title: 'Success 🎉',
        description: 'Your agent has completed the request.<br><br>The response shows the AI-generated output from your local infrastructure.',
        side: 'top',
        align: 'start',
        showButtons: ['next', 'close']  // Hide Back button on success step
      }
    },

    // Step 10: View Execution in Table
    {
      element: '[data-tour="execution-row-first"]',
      popover: {
        title: 'Execution History 📋',
        description: 'Your execution appears in the history table.<br><br><span class="tour-action">Click the execution row to continue.</span>',
        side: 'top',
        align: 'start',
        showButtons: ['previous', 'close']
      },
      onHighlighted: () => {
        // Wait for the execution row to appear in the table
        waitForElement(
          '[data-tour="execution-row-first"]',
          (firstRow) => {
            if (firstRow) {
              const row = firstRow as HTMLElement
              row.addEventListener('click', () => {
                // Wait for the execution detail panel to appear on the Executions page
                waitForElement(
                  '[data-tour="execution-detail-panel"]',
                  (panel) => {
                    if (panel) {
                      getDriverInstance().moveNext()
                    }
                  },
                  {
                    maxAttempts: 10,
                    intervalMs: 200
                  }
                )
              }, { once: true })
            } else {
              // If row doesn't appear, skip to next step
              console.warn('Tour: Execution row did not appear in table')
              setTimeout(() => getDriverInstance().moveNext(), 500)
            }
          },
          {
            maxAttempts: 10,  // 5 seconds should be enough
            intervalMs: 500
          }
        )
      }
    },

    // Step 11: Execution Detail Panel
    {
      element: '[data-tour="execution-detail-panel"]',
      popover: {
        title: 'Execution Details 📊',
        description: 'View complete execution information including inputs, outputs, and status.<br><br>The <strong>Audit</strong> tab provides detailed logs for debugging.',
        side: 'top',
        align: 'start',
        showButtons: ['next', 'close']  // Hide Back button on execution details
      }
    },

    // Step 12: Artifacts Tab
    {
      element: '[data-tour="artifacts-tab"]',
      popover: {
        title: 'Agent Artifacts 📁',
        description: 'View files generated by your agent. All outputs are stored locally and can be downloaded.<br><br><span class="tour-action">Click "Artifacts" to continue.</span>',
        side: 'top',
        align: 'start',
        showButtons: ['close']  // Hide Back button on artifacts navigation
      },
      onHighlighted: (element) => {
        const artifactsTab = element as HTMLElement
        artifactsTab?.addEventListener('click', () => {
          setTimeout(() => getDriverInstance().moveNext(), 500)
        }, { once: true })
      }
    },

    // Step 13: Artifacts Panel
    {
      element: '[data-tour="artifacts-panel"]',
      popover: {
        title: 'Generated Files',
        description: 'Agent outputs appear here.<br><br>Files can be previewed, downloaded, or used as inputs for other agents.',
        side: 'top',
        align: 'start'
      },
      onHighlighted: (element) => {
        // Prevent clicks on artifacts during tour
        if (element) {
          (element as HTMLElement).classList.add('tour-no-interaction')
        }
      },
      onDeselected: (element) => {
        if (element) {
          (element as HTMLElement).classList.remove('tour-no-interaction')
        }
      }
    },

    // Configuration Tour Steps
    // Step 14: Navigate to Configuration
    {
      element: '[data-tour="settings-nav"]',
      popover: {
        title: 'Configuration Center',
        description: 'The Configuration page manages connections and credentials.<br><br><span class="tour-action">Click "Configuration" to continue.</span>',
        side: 'right',
        align: 'start',
        showButtons: ['previous', 'close']
      },
      onHighlighted: (element) => {
        const settingsLink = element as HTMLElement
        settingsLink.addEventListener('click', () => {
          // Wait for navigation then show completion
          setTimeout(() => {
            getDriverInstance().moveNext()
          }, 800)
        }, { once: true })
      }
    },

    // Configuration Page Tour Steps (12-16)
    // Step 15: Credentials Card
    {
      element: '[data-tour="credentials-card"]',
      popover: {
        title: 'Credentials Management 🔑',
        description: `Store API keys and authentication tokens.<br><br>
Credentials are:<br>
• Stored as environment variables<br>
• Isolated from your codebase<br>
• Injected into containers at runtime<br><br>
<pre style="background: rgba(0,0,0,0.1); padding: 8px; border-radius: 4px; font-size: 12px;">OPENAI_API_KEY=sk-...
ANTHROPIC_API_KEY=sk-ant-...</pre>`,
        side: 'top',
        align: 'start',
        showButtons: ['next', 'close']  // Hide Back button on credentials step
      }
    },

    // Step 16: Registry Connections Card
    {
      element: '[data-tour="registry-connections-card"]',
      popover: {
        title: 'Container Registry Access 📦',
        description: `Connect to container registries to access agent images.<br><br>
Supported registries:<br>
• <strong>Docker Hub:</strong> Public agent images<br>
• <strong>Private registries:</strong> Proprietary agent images<br>
• <strong>Enterprise platforms:</strong> Harbor, ECR, ACR support<br>
• <strong>Multi-registry:</strong> Connect to multiple sources`,
        side: 'top',
        align: 'start'
      }
    },

    // Step 17: Model Connections Card
    {
      element: '[data-tour="model-connections-card"]',
      popover: {
        title: 'AI Model Configuration 🤖',
        description: `Configure connections to AI model providers.<br><br>
Supported providers:<br>
• <strong>Cloud:</strong> OpenAI, Anthropic, AWS Bedrock<br>
• <strong>Local:</strong> Ollama for on-premise models<br>
• <strong>Flexibility:</strong> Switch providers without code changes<br>
• <strong>Routing:</strong> Automatic model selection per agent`,
        side: 'top',
        align: 'start'
      }
    },

    // Step 18: Agents Configuration
    {
      element: '[data-tour="agents-config-card"]',
      popover: {
        title: 'Agent Deployments 🚀',
        description: `Define and deploy your agent configurations.<br><br>
Each deployment specifies:<br>
• <strong>Image:</strong> Container and version to deploy<br>
• <strong>Registry:</strong> Source for pulling images<br>
• <strong>Parameters:</strong> Runtime configuration and labels<br>
• <strong>Resources:</strong> Requirements and limits`,
        side: 'top',
        align: 'start'
      }
    },

    // Step 19: Agent Hub
    {
      element: '[data-tour="hub-nav"]',
      popover: {
        title: 'Agent Hub 🌐',
        description: 'Discover and install new AI agents from the community.<br><br>The <strong>Agent Hub</strong> provides:<br>• <strong>Pre-built agents:</strong> Common tasks ready to use<br>• <strong>Community solutions:</strong> Contributed by developers<br>• <strong>Enterprise templates:</strong> Production-ready agents<br>• <strong>One-click deployment:</strong> Easy installation',
        side: 'right',
        align: 'start'
      },
      onHighlighted: (element) => {
        // Prevent clicking the nav item during tour
        if (element) {
          (element as HTMLElement).classList.add('tour-no-interaction')
        }
      },
      onDeselected: (element) => {
        if (element) {
          (element as HTMLElement).classList.remove('tour-no-interaction')
        }
      }
    },

    // Step 20: Support
    {
      element: '[data-tour="support-nav"]',
      popover: {
        title: 'Help & Documentation 💬',
        description: 'Get help whenever you need it.<br><br>The <strong>Support</strong> page provides:<br>• <strong>Documentation:</strong> Guides and references<br>• <strong>Troubleshooting:</strong> Common issues and solutions<br>• <strong>Community:</strong> Forums and discussions<br>• <strong>Tour restart:</strong> Access this tour anytime',
        side: 'right',
        align: 'start'
      },
      onHighlighted: (element) => {
        // Prevent clicking the nav item during tour
        if (element) {
          (element as HTMLElement).classList.add('tour-no-interaction')
        }
      },
      onDeselected: (element) => {
        if (element) {
          (element as HTMLElement).classList.remove('tour-no-interaction')
        }
      }
    },

    // Step 21: Tour Complete
    {
      popover: {
        title: 'Congratulations 🎉',
        description: `You've completed the tour!<br><br>
<strong>You successfully:</strong><br>
✅ Executed an AI agent locally<br>
✅ Viewed execution results and artifacts<br>
✅ Explored configuration options<br><br>
You're ready to explore AgentSystems.<br><br>
<strong>Ready to build something amazing?</strong><br><br>
<a href="https://agentsystems.mintlify.app/overview" target="_blank" style="color: var(--accent); text-decoration: underline;">Explore the Docs →</a>`,
        side: 'top',
        align: 'center',
        showButtons: ['close']
      },
      onHighlighted: () => {
        // Mark tour as complete when this step is shown
        showCompletionMessage()
      }
    }
    )

    return steps
  }

  // Scroll prevention handler
  const preventScroll = (e: Event) => {
    e.preventDefault()
    e.stopPropagation()
    return false
  }

  // Driver instance configuration
  const driverConfig = {
    showProgress: true,
    showButtons: ['next', 'previous', 'close'] as ('next' | 'previous' | 'close')[],
    nextBtnText: 'Next →',
    prevBtnText: '← Back',
    doneBtnText: 'Complete Tour',
    closeBtnText: 'Skip Tour',
    progressText: 'Step {{current}} of {{total}}',

    // Allow intentional exits (ESC key, Close button) but prevent accidental overlay clicks
    allowKeyboardControl: true,
    overlayClickBehavior: undefined, // Disable overlay click behavior

    // Disable Driver.js auto-scrolling completely
    smoothScroll: false,
    disableBodyScroll: true,

    // Callbacks
    onHighlighted: (element: Element | undefined, step: DriveStep) => {
      // Inject styles if not already done
      injectTourInteractionStyles()

      // Check if element exists (first step may not have an element)
      if (element) {
        // Add custom highlighting for better visibility
        (element as HTMLElement).style.position = 'relative';
        (element as HTMLElement).style.zIndex = '10001'

        // Check if this step shows the 'next' button
        const buttonsShown = step?.popover?.showButtons || ['next', 'previous', 'close']
        const showsNextButton = buttonsShown.includes('next')

        // If next button is NOT shown, user needs to click the element, so DON'T prevent interaction
        // If next button IS shown, prevent interaction with the element
        if (showsNextButton) {
          (element as HTMLElement).classList.add('tour-no-interaction')
        }
      }

      // Prevent all scrolling during tour
      document.addEventListener('wheel', preventScroll, { passive: false, capture: true })
      document.addEventListener('touchmove', preventScroll, { passive: false, capture: true })
      document.addEventListener('scroll', preventScroll, { passive: false, capture: true })
      window.addEventListener('scroll', preventScroll, { passive: false, capture: true })
    },

    onDeselected: (element: Element | undefined) => {
      // Reset any custom styling
      if (element) {
        (element as HTMLElement).style.position = '';
        (element as HTMLElement).style.zIndex = '';
        // Remove interaction prevention class
        (element as HTMLElement).classList.remove('tour-no-interaction')
      }
    },

    onDestroyed: () => {
      // Remove scroll prevention
      document.removeEventListener('wheel', preventScroll, { capture: true })
      document.removeEventListener('touchmove', preventScroll, { capture: true })
      document.removeEventListener('scroll', preventScroll, { capture: true })
      window.removeEventListener('scroll', preventScroll, { capture: true })

      // Tour was closed/completed
      console.log('Tour ended')
      setTourActive(false)

      // Mark tour as complete if user closed it (prevents restart on navigation)
      // We assume if they close it, they don't want to see it again
      storeMark('execution-first')
    }
  }

  const showCompletionMessage = () => {
    // Mark tour as completed in store
    storeMark('execution-first')
    setTourActive(false)
    console.log('Tour completed successfully')
  }

  const startExecutionFirstTour = useCallback(async () => {
    console.log('Tour: startExecutionFirstTour called')

    // Inject tour styles immediately
    injectTourInteractionStyles()

    // Save current theme and force light theme for best tour experience
    const themeStore = useThemeStore.getState()
    const originalTheme = themeStore.theme
    console.log('Tour: Saving original theme:', originalTheme)

    // Prevent multiple simultaneous starts
    const currentTourState = useTourStore.getState()
    if (currentTourState.isTourActive) {
      console.log('Tour: Already active, skipping start')
      return
    }

    // Always start from dashboard
    if (window.location.pathname !== '/dashboard' && window.location.pathname !== '/') {
      console.log('Tour: Not on dashboard, navigating...')
      navigate('/dashboard')
      setTimeout(() => {
        startExecutionFirstTour()
      }, 500)
      return
    }

    // We'll handle theme switching after user confirms in the first tour step

    console.log('Tour: Setting tour active')
    // Set tour active
    setTourActive(true)

    // Ensure hello-world-agent is stopped for consistent tour experience
    // Do this async so it doesn't delay tour start
    agentsApi.list().then(response => {
      const helloWorldAgent = response.agents.find(a => a.name === 'hello-world-agent')
      if (helloWorldAgent && helloWorldAgent.state === 'running') {
        console.log('Tour: Stopping hello-world-agent for consistent experience')
        agentsApi.stopAgent('hello-world-agent').catch(error => {
          console.warn('Tour: Could not stop agent:', error)
        })
      }
    }).catch(error => {
      console.warn('Tour: Could not check agent state:', error)
    })

    console.log('Tour: Creating Driver instance')

    // Since we force light theme, always use light theme overlay
    const overlayColor = 'rgba(0, 0, 0, 0.5)' // light theme overlay
    console.log('Tour: Using light theme overlay for tour')

    // We need to create a mutable reference for the driver instance
    let driverInstance: Driver | null = null

    // Create steps with reference to driver instance and original theme
    const steps = getTourSteps((() => driverInstance!), originalTheme)

    // Create custom driver config with theme restoration
    const tourDriverConfig = {
      ...driverConfig,
      overlayColor,
      steps,
      onDestroyed: () => {
        // Call original onDestroyed
        driverConfig.onDestroyed()

        // Restore original theme if it was changed
        if (originalTheme !== 'light') {
          console.log('Tour: Restoring original theme:', originalTheme)
          useThemeStore.getState().setTheme(originalTheme)
        }
      }
    }

    // Create new driver instance with theme-aware overlay
    driverInstance = driver(tourDriverConfig)

    console.log('Tour: Starting Driver tour')
    driverInstance.drive()
    console.log('Tour: Driver tour started')
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [navigate, setTourActive, storeMark])

  const markTourComplete = useCallback(() => {
    storeMark('execution-first')
  }, [storeMark])

  const resetTour = useCallback(() => {
    storeReset()
  }, [storeReset])

  return {
    startExecutionFirstTour,
    hasCompletedTour,
    markTourComplete,
    resetTour
  }
}