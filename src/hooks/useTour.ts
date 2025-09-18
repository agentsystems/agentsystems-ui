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
          setTimeout(() => getDriverInstance().moveNext(), 800)
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
          setTimeout(() => getDriverInstance().moveNext(), 1000)
        }, { once: true })
      }
    },

    // Step 4: Show Status Banner (first step on Agent Detail page)
    {
      element: '[data-tour="agent-status-banner"]',
      popover: {
        title: 'Agent Status Monitoring',
        description: 'Each agent reports its current state: running, stopped, or not created.<br><br>This agent is currently <strong>stopped</strong> and will start automatically when needed.',
        side: 'bottom',
        align: 'start',
        disableButtons: ['previous']
      }
    },

    // Step 5: Turn On Agent
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
          // Wait for agent to start, then continue tour
          setTimeout(() => getDriverInstance().moveNext(), 3000)
        }, { once: true })
      }
    },

    // Step 6: Agent Metadata (shows runtime information)
    {
      element: '[data-tour="agent-metadata"]',
      popover: {
        title: 'Your Agent is Ready! 🤖',
        description: 'The agent has started and reported its metadata.<br><br>Key information:<br>• <strong>Status:</strong> Running in container<br>• <strong>Model:</strong> Local AI model configured<br>• <strong>Version:</strong> Agent version and capabilities<br><br>All processing happens on your local infrastructure.',
        side: 'top',
        align: 'start'
      }
    },

    // Step 7: Execute Agent
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
          // Wait longer for execution to actually start and status element to render
          setTimeout(() => getDriverInstance().moveNext(), 5000)
        }, { once: true })
      }
    },

    // Step 8: Execution Status (while agent is running)
    {
      element: '[data-tour="execution-status"]',
      popover: {
        title: 'Agent Executing Locally 🔄',
        description: 'The agent is processing your request.<br><br>The execution history shows the current status and tracks all agent activity.',
        side: 'top',
        align: 'start',
        disableButtons: ['next', 'previous']
      },
      onHighlighted: async () => {
        // First, wait for the status element to appear
        let statusCheckAttempts = 0
        const maxStatusAttempts = 10 // 10 seconds to find status element

        const waitForStatusElement = () => {
          statusCheckAttempts++
          const statusElement = document.querySelector('[data-tour="execution-status"]')

          if (!statusElement && statusCheckAttempts < maxStatusAttempts) {
            // Status element not yet visible, keep waiting
            setTimeout(waitForStatusElement, 1000)
            return
          }

          // Now poll for execution completion
          const maxAttempts = 60 // 60 seconds max wait
          let attempts = 0

          const checkForCompletion = async () => {
            attempts++

            // Check if execution status changed to completed
            const resultsElement = document.querySelector('[data-tour="execution-results"]')

            // Check if status changed to completed or if results are ready
            if (resultsElement && resultsElement.textContent && resultsElement.textContent.length > 10) {
              // Results are ready, auto-advance to show them
              setTimeout(() => getDriverInstance().moveNext(), 1000)
              return true
            }

            if (attempts < maxAttempts) {
              // Keep checking every second
              setTimeout(checkForCompletion, 1000)
            } else {
              // Timeout - move to next step anyway
              console.warn('Tour: Execution took too long, proceeding anyway')
              setTimeout(() => getDriverInstance().moveNext(), 1000)
            }
            return false
          }

          // Start checking for completion
          setTimeout(checkForCompletion, 2000)
        }

        // Start waiting for status element
        waitForStatusElement()
      }
    },

    // Step 9: Execution Results (after completion)
    {
      element: '[data-tour="execution-results"]',
      popover: {
        title: 'AI Sovereignty Complete! 🚀',
        description: 'Request processed successfully.<br><br>The JSON response shows the agent\'s output, generated using your local infrastructure.',
        side: 'top',
        align: 'start'
      }
    },

    // Step 10: Tour Completion Choice
    {
      popover: {
        title: 'What\'s Next? 🤔',
        description: `You've executed your first AI agent.<br><br>
Choose your path:<br><br>
• Close the tour to explore on your own<br>
• Click <strong>Continue Tour</strong> to learn about configuration<br><br>
You can restart the tour anytime from the Support page.`,
        side: 'top',
        align: 'center',
        showButtons: ['close', 'next'],
        nextBtnText: 'Continue Tour →',
        onCloseClick: () => {
          // User chose to explore - mark tour complete
          storeMark('execution-first')
          setTourActive(false)
          console.log('User chose to explore on their own')
          getDriverInstance().destroy()
        }
      }
    },

    // Configuration Tour Steps (11-12)
    // Step 11: Navigate to Settings
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
    // Step 12: Credentials Card
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

    // Step 13: Registry Connections Card
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

    // Step 14: Model Connections Card
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

    // Step 15: Agents Card
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

    // Step 16: Tour Complete on Configuration Page
    {
      popover: {
        title: 'Tour Complete! 🎉',
        description: `You've completed the AgentSystems tour.<br><br>
<strong>You learned how to:</strong><br>
• Execute AI agents on local infrastructure<br>
• Monitor agent status and execution<br>
• Configure credentials and connections<br>
• Access container registries<br>
• Connect AI model providers<br>
• Deploy agent configurations<br><br>
<strong>Continue learning:</strong><br>
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