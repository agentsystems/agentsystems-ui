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
        title: 'Welcome to AI Sovereignty! 🎉',
        description: `You now have a complete AI agent platform running on your local machine.<br><br>This 60-second tour will show you how to execute AI agents without any external dependencies.`,
        side: 'top',
        align: 'center'
      }
    },

    // Step 2: Navigate to Agents
    {
      element: '[data-tour="agents-nav"]',
      popover: {
        title: 'Your Agent Library',
        description: 'Click the <strong>Agents</strong> link to view your agent library.<br><br>We\'ve pre-installed a hello-world-agent to demonstrate the platform.',
        side: 'right',
        align: 'start',
        disableButtons: ['next']
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

    // Step 3: Show Agent Card (first step on Agents page)
    {
      element: '[data-tour="hello-world-agent-card"]',
      popover: {
        title: 'Your First Agent',
        description: 'The <strong>hello-world-agent</strong> demonstrates how agents run in isolated containers.<br><br>Click the card to view agent details.',
        side: 'top',
        align: 'start',
        disableButtons: ['next', 'previous']
      },
      onHighlighted: (element) => {
        // Detect when user clicks the agent card
        const agentCard = element as HTMLElement
        agentCard.addEventListener('click', () => {
          // Wait for the agent detail page to load
          waitForElement(
            '[data-tour="start-agent-button"]',
            (startButton) => {
              if (startButton) {
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

    // Step 4: Turn On Agent (first step on Agent Detail page)
    {
      element: '[data-tour="start-agent-button"]',
      popover: {
        title: 'Start Your Agent',
        description: 'Click <strong>Turn On</strong> to start the agent container.<br><br>AgentSystems manages containers on-demand to save resources.',
        side: 'top',
        align: 'start',
        disableButtons: ['next']
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

    // Step 5: Agent Metadata (shows runtime information)
    {
      element: '[data-tour="agent-metadata"]',
      popover: {
        title: 'Your Agent is Ready! 🤖',
        description: 'The agent has started and reported its metadata.<br><br>Key information:<br>• <strong>Status:</strong> Running in container<br>• <strong>Model:</strong> Local AI model configured<br>• <strong>Version:</strong> Agent version and capabilities<br><br>All processing happens on your local infrastructure.',
        side: 'top',
        align: 'start'
      }
    },

    // Step 6: Execute Agent
    {
      element: '[data-tour="execute-agent-button"]',
      popover: {
        title: 'Execute Your Agent Locally',
        description: 'Click <strong>Execute</strong> to send a sample request to the agent.<br><br>The agent will process this request using your local compute resources.',
        side: 'top',
        align: 'start',
        disableButtons: ['next']
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

    // Step 7: Execution Status (while running)
    {
      element: '[data-tour="execution-status"]',
      popover: {
        title: 'Agent Processing 🔄',
        description: 'Your agent is processing the request.<br><br>Execution status appears here in real-time.',
        side: 'top',
        align: 'start',
        disableButtons: ['next', 'previous']
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

    // Step 8: Execution Results
    {
      element: '[data-tour="execution-results"]',
      popover: {
        title: 'Success! 🎉',
        description: 'Your agent has completed the request.<br><br>The response shows the AI-generated output from your local infrastructure.',
        side: 'top',
        align: 'start'
      }
    },

    // Step 9: View Execution in Table
    {
      element: '[data-tour="execution-row-first"]',
      popover: {
        title: 'Execution History 📋',
        description: 'Your execution appears in the history table.<br><br>Click the row to view detailed results and artifacts.',
        side: 'top',
        align: 'start',
        disableButtons: ['next']
      },
      onHighlighted: () => {
        // Wait for the execution row to appear in the table
        waitForElement(
          '[data-tour="execution-row-first"]',
          (firstRow) => {
            if (firstRow) {
              const row = firstRow as HTMLElement
              row.addEventListener('click', () => {
                // Move to next step after clicking row
                setTimeout(() => getDriverInstance().moveNext(), 500)
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

    // Step 10: Execution Detail Panel
    {
      element: '[data-tour="execution-detail-panel"]',
      popover: {
        title: 'Execution Details 📊',
        description: 'View complete execution information including inputs, outputs, and status.<br><br>The <strong>Audit Trail</strong> tab provides detailed logs for debugging.',
        side: 'top',
        align: 'start'
      }
    },

    // Step 11: Artifacts Tab
    {
      element: '[data-tour="artifacts-tab"]',
      popover: {
        title: 'Agent Artifacts 📁',
        description: 'Click <strong>Artifacts</strong> to view files generated by your agent.<br><br>All outputs are stored locally and can be downloaded.',
        side: 'top',
        align: 'start',
        disableButtons: ['next']
      },
      onHighlighted: (element) => {
        const artifactsTab = element as HTMLElement
        artifactsTab?.addEventListener('click', () => {
          setTimeout(() => getDriverInstance().moveNext(), 500)
        }, { once: true })
      }
    },

    // Step 12: Artifacts Panel
    {
      element: '[data-tour="artifacts-panel"]',
      popover: {
        title: 'Generated Files',
        description: 'Agent outputs appear here.<br><br>Files can be previewed, downloaded, or used as inputs for other agents.',
        side: 'top',
        align: 'start'
      }
    },

    // Configuration Tour Steps
    // Step 13: Navigate to Configuration
    {
      element: '[data-tour="settings-nav"]',
      popover: {
        title: 'Configuration Center',
        description: 'The Configuration page manages connections and credentials.<br><br>Click <strong>Configuration</strong> to explore these settings.',
        side: 'right',
        align: 'start',
        disableButtons: ['next']
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
    // Step 14: Credentials Card
    {
      element: '[data-tour="credentials-card"]',
      popover: {
        title: 'Credentials Management 🔑',
        description: `Store API keys and authentication tokens securely.<br><br>
Credentials are:<br>
• Stored as environment variables<br>
• Isolated from your codebase<br>
• Injected into containers at runtime<br><br>
<pre style="background: rgba(0,0,0,0.1); padding: 8px; border-radius: 4px; font-size: 12px;">OPENAI_API_KEY=sk-...
ANTHROPIC_API_KEY=sk-ant-...</pre>`,
        side: 'top',
        align: 'start'
      }
    },

    // Step 15: Registry Connections Card
    {
      element: '[data-tour="registry-connections-card"]',
      popover: {
        title: 'Container Registry Access 📦',
        description: `Connect to container registries to access agent images.<br><br>
Supported registries:<br>
• Docker Hub for public agents<br>
• Private registries for proprietary agents<br>
• Enterprise platforms (Harbor, ECR, ACR)<br>
• Multiple simultaneous connections`,
        side: 'top',
        align: 'start'
      }
    },

    // Step 16: Model Connections Card
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

    // Step 17: Agents Card
    {
      element: '[data-tour="agents-config-card"]',
      popover: {
        title: 'Agent Deployments 🚀',
        description: `Define and deploy your agent configurations.<br><br>
Each deployment specifies:<br>
• Container image and version<br>
• Source registry selection<br>
• Runtime parameters and labels<br>
• Resource requirements and limits`,
        side: 'top',
        align: 'start'
      }
    },

    // Step 18: Tour Complete
    {
      popover: {
        title: 'Tour Complete! 🎉',
        description: `You've successfully executed an AI agent on your local infrastructure.<br><br>
<strong>You learned how to:</strong><br>
• Start and execute AI agents<br>
• View execution history and details<br>
• Access generated artifacts<br>
• Configure credentials securely<br>
• Connect to container registries<br>
• Set up AI model providers<br><br>
<strong>Explore more:</strong><br>
• <strong>Agent Hub</strong> - Discover new agents<br>
• <strong>Audit Trail</strong> - View detailed logs<br>
• <strong>Support</strong> - Access help and restart tour<br><br>
<a href="https://agentsystems.mintlify.app/overview" target="_blank" style="color: var(--accent); text-decoration: underline;">View Documentation →</a>`,
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
    onHighlighted: (element: Element | undefined) => {
      // Check if element exists (first step may not have an element)
      if (element) {
        // Add custom highlighting for better visibility
        (element as HTMLElement).style.position = 'relative';
        (element as HTMLElement).style.zIndex = '10001'
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
        (element as HTMLElement).style.zIndex = ''
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

    // Ensure hello-world-agent is stopped before starting tour
    try {
      console.log('Tour: Checking agent state...')
      const response = await agentsApi.list()
      const helloWorldAgent = response.agents.find(a => a.name === 'hello-world-agent')

      if (helloWorldAgent && helloWorldAgent.state === 'running') {
        console.log('Tour: Preparing environment - stopping hello-world-agent')
        await agentsApi.stopAgent('hello-world-agent')
        // Wait a moment for the agent to stop
        await new Promise(resolve => setTimeout(resolve, 500))
      } else {
        console.log('Tour: Agent is already stopped or not found')
      }
    } catch (error) {
      console.warn('Tour: Could not check/stop agent state:', error)
    }

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