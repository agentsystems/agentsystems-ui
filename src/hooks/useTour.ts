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
  const getTourSteps = (getDriverInstance: () => Driver): DriveStep[] => {
    return [
    // Step 1: Welcome Modal (free-floating)
    {
      popover: {
        title: 'Welcome to AI Sovereignty! 🎉',
        description: `You now have a complete AI agent platform running <strong>locally on your machine</strong>. Let's see it in action in just 60 seconds!`,
        side: 'top',
        align: 'center'
      }
    },

    // Step 2: Navigate to Agents
    {
      element: '[data-tour="agents-nav"]',
      popover: {
        title: 'Your Agent Library',
        description: '<strong>Click the "Agents" link</strong> to see all your configured agents.<br><br>We\'ve pre-installed a <em>hello-world-agent</em> for you to try.',
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
        description: 'This is your <strong>hello-world-agent</strong> - ready to demonstrate local AI processing.<br><br><em>Click on the card background (avoid the buttons) to view details.</em>',
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
        description: 'AgentSystems tracks each agent\'s state in <strong>real-time</strong>.<br><br>This agent is <em>stopped</em> but will <strong>auto-start</strong> when you invoke it.',
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
        description: '<strong>Click "Turn On"</strong> to start the agent container.<br><br>This demonstrates AgentSystems\' <em>on-demand container management</em>.',
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
        description: 'This metadata was loaded <strong>directly from the running container</strong>.<br><br>Notice:<br>• <strong>Purpose:</strong> generates historical narratives<br>• <strong>Version:</strong> 0.1.1<br>• <strong>AI Model:</strong> gemma3:1b (local)<br><br><em>All of this runs entirely on your computer!</em>',
        side: 'top',
        align: 'start'
      }
    },

    // Step 7: Execute Agent
    {
      element: '[data-tour="execute-agent-button"]',
      popover: {
        title: 'Execute Your Agent Locally',
        description: '<strong>Click "Execute"</strong> to run this agent with a sample request.<br><br>The processing happens <strong>entirely on your machine</strong> - <em>no external servers involved!</em>',
        side: 'top',
        align: 'start',
        disableButtons: ['next']
      },
      onHighlighted: (element) => {
        // Detect when user clicks the execute button
        const executeButton = element as HTMLElement
        executeButton.addEventListener('click', () => {
          // Wait for execution to start, then show status
          setTimeout(() => getDriverInstance().moveNext(), 3000)
        }, { once: true })
      }
    },

    // Step 8: Execution Status (while agent is running)
    {
      element: '[data-tour="execution-status"]',
      popover: {
        title: 'Agent Executing Locally 🔄',
        description: 'Your agent is now processing the request using <strong>local AI models</strong>.<br><br>Notice the <strong>"running"</strong> status in the execution history - this is happening <em>on your computer</em>.',
        side: 'top',
        align: 'start',
        disableButtons: ['next', 'previous']
      },
      onHighlighted: async () => {
        // Poll for execution completion
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

        // Start checking after a short delay
        setTimeout(checkForCompletion, 2000)
      }
    },

    // Step 9: Execution Results (after completion)
    {
      element: '[data-tour="execution-results"]',
      popover: {
        title: 'AI Sovereignty Complete! 🚀',
        description: '<strong>Perfect!</strong> Your agent processed the request locally and returned results.<br><br>This JSON response was generated <strong>entirely on your machine!</strong>',
        side: 'top',
        align: 'start'
      }
    },

    // Step 10: Tour Completion Choice
    {
      popover: {
        title: 'What\'s Next? 🤔',
        description: `<strong>Great job!</strong> You've successfully executed an AI agent locally.<br><br>
Would you like to:<br><br>
• <strong>Explore on your own</strong> - Start building with AgentSystems<br>
• <strong>Continue the tour</strong> - Learn about configuration, credentials, and deploying custom agents<br><br>
<em>You can always restart the tour from Support if you skip it now.</em>`,
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
        description: 'Let\'s configure AgentSystems to connect to your environment.<br><br><strong>Click Configuration to continue.</strong>',
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
        description: `<strong>Store API keys and tokens</strong><br><br>
• Environment variables keep credentials separate from code<br>
• Not exposed in configuration files<br>
• Passed to agent containers at runtime<br><br>
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
        description: `<strong>Connect to agent repositories</strong><br><br>
• Docker Hub for public agents<br>
• Private registries for proprietary agents<br>
• Enterprise repositories (Harbor, ECR, ACR)<br>
• <em>Pull agents from multiple sources simultaneously</em>`,
        side: 'top',
        align: 'start'
      }
    },

    // Step 14: Model Connections Card
    {
      element: '[data-tour="model-connections-card"]',
      popover: {
        title: 'AI Model Configuration 🤖',
        description: `<strong>Configure AI provider connections</strong><br><br>
• <strong>Cloud:</strong> OpenAI, Anthropic, AWS Bedrock<br>
• <strong>Local:</strong> Ollama for local processing<br>
• <strong>Routing:</strong> Agents use models transparently<br>
• <em>Switch providers without changing agent code!</em>`,
        side: 'top',
        align: 'start'
      }
    },

    // Step 15: Agents Card
    {
      element: '[data-tour="agents-config-card"]',
      popover: {
        title: 'Agent Deployments 🚀',
        description: `<strong>Define your agent fleet</strong><br><br>
• Container image and version<br>
• Registry source selection<br>
• Runtime parameters and labels<br>
• <em>Deploy agents with a single command!</em>`,
        side: 'top',
        align: 'start'
      }
    },

    // Step 16: Tour Complete on Configuration Page
    {
      popover: {
        title: 'Tour Complete! 🎉',
        description: `<strong>Excellent work!</strong> You've learned the essentials of AgentSystems.<br><br>
<strong>You now understand how to:</strong><br>
• Execute AI agents locally on your machine<br>
• Configure credentials and connections<br>
• Connect to container registries for agent deployment<br>
• Set up AI model providers<br>
• Manage your agent deployments<br><br>
<strong>Ready to learn more?</strong><br>
<a href="https://agentsystems.mintlify.app/overview" target="_blank" style="color: var(--accent); text-decoration: underline;">View the documentation →</a>`,
        side: 'top',
        align: 'center',
        showButtons: ['close']
      },
      onHighlighted: () => {
        // Mark tour as complete when this step is shown
        showCompletionMessage()
      }
    }
  ]
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

    // Get the current theme from the store and adjust overlay color
    const currentTheme = useThemeStore.getState().theme
    let overlayColor = 'rgba(0, 0, 0, 0.5)' // default for light theme

    if (currentTheme === 'dark') {
      overlayColor = 'rgba(0, 0, 0, 0.9)' // very dark for dark theme
      console.log('Tour: Using dark theme overlay')
    } else if (currentTheme === 'cyber') {
      overlayColor = 'rgba(0, 10, 0, 0.9)' // very dark green for cyber theme
      console.log('Tour: Using cyber theme overlay')
    } else {
      console.log('Tour: Using default light theme overlay')
    }
    console.log('Tour: Current theme:', currentTheme, 'Overlay color:', overlayColor)

    // We need to create a mutable reference for the driver instance
    let driverInstance: Driver | null = null

    // Create steps with reference to driver instance
    const steps = getTourSteps((() => driverInstance!))

    // Create new driver instance with theme-aware overlay
    driverInstance = driver({
      ...driverConfig,
      overlayColor,
      steps
    })

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