import { useNavigate } from 'react-router-dom'
import { 
  ChatBubbleLeftRightIcon,
  DocumentTextIcon,
  CodeBracketIcon,
  HeartIcon,
  BugAntIcon,
  AcademicCapIcon,
  RocketLaunchIcon,
  BuildingOffice2Icon,
  ExclamationTriangleIcon,
  SparklesIcon,
  UserGroupIcon,
  EnvelopeIcon,
  LinkIcon,
  PlayIcon
} from '@heroicons/react/24/outline'
import Card from '@components/common/Card'
import { useTour } from '@hooks/useTour'
import styles from './Support.module.css'

export default function Support() {
  const navigate = useNavigate()
  const { startExecutionFirstTour, resetTour } = useTour()
  
  const handleExternalLink = (url: string) => {
    window.open(url, '_blank', 'noopener,noreferrer')
  }

  const handleStartTour = () => {
    resetTour() // Clear any existing completion state
    navigate('/dashboard') // Go to dashboard
    setTimeout(() => {
      startExecutionFirstTour() // Start fresh tour
    }, 500)
  }

  return (
    <div className={styles.support}>
      <div className={styles.header}>
        <h1>Support</h1>
        <p className={styles.subtitle}>
          Get help, contribute to the community, and access platform resources
        </p>
      </div>

      <div className={styles.grid}>
        {/* Getting Help Section */}
        <section className={styles.section}>
          <h2 className={styles.sectionTitle}>
            <ChatBubbleLeftRightIcon className={styles.sectionIcon} />
            Getting Help
          </h2>

          <Card className={styles.resourceCard}>
            <div className={styles.resourceHeader}>
              <PlayIcon className={styles.resourceIcon} />
              <div>
                <h3>Interactive Tour</h3>
                <p>Take the guided tour to learn AgentSystems features</p>
              </div>
            </div>
            <button 
              className={styles.resourceButton}
              onClick={handleStartTour}
            >
              <PlayIcon className={styles.buttonIcon} />
              Start Tour
            </button>
          </Card>
          
          <Card className={styles.resourceCard}>
            <div className={styles.resourceHeader}>
              <BugAntIcon className={styles.resourceIcon} />
              <div>
                <h3>Report Issues</h3>
                <p>Found a bug or have a feature request?</p>
              </div>
            </div>
            <button 
              className={styles.resourceButton}
              onClick={() => handleExternalLink('https://github.com/agentsystems/agentsystems/issues')}
            >
              <LinkIcon className={styles.buttonIcon} />
              GitHub Issues
            </button>
          </Card>

          <Card className={styles.resourceCard}>
            <div className={styles.resourceHeader}>
              <UserGroupIcon className={styles.resourceIcon} />
              <div>
                <h3>Community Support</h3>
                <p>Join our community for discussions and help</p>
              </div>
            </div>
            <button 
              className={styles.resourceButton}
              onClick={() => handleExternalLink('https://discord.com/invite/JsxDxQ5zfV')}
            >
              <LinkIcon className={styles.buttonIcon} />
              Discord Community
            </button>
          </Card>

          <Card className={styles.resourceCard}>
            <div className={styles.resourceHeader}>
              <EnvelopeIcon className={styles.resourceIcon} />
              <div>
                <h3>Direct Support</h3>
                <p>Contact our team directly for urgent issues</p>
              </div>
            </div>
            <button
              className={styles.resourceButton}
              onClick={() => handleExternalLink('https://agentsystems.ai/contact.html?inquiry=direct-support')}
            >
              <LinkIcon className={styles.buttonIcon} />
              Contact Us
            </button>
          </Card>
        </section>

        {/* Documentation & Resources */}
        <section className={styles.section}>
          <h2 className={styles.sectionTitle}>
            <DocumentTextIcon className={styles.sectionIcon} />
            Documentation & Resources
          </h2>
          
          <Card className={styles.resourceCard}>
            <div className={styles.resourceHeader}>
              <RocketLaunchIcon className={styles.resourceIcon} />
              <div>
                <h3>Getting Started Guide</h3>
                <p>Complete guide to deploying your first agents</p>
              </div>
            </div>
            <button 
              className={styles.resourceButton}
              onClick={() => handleExternalLink('https://docs.agentsystems.ai/getting-started/quickstart')}
            >
              <LinkIcon className={styles.buttonIcon} />
              Quick Start
            </button>
          </Card>

          <Card className={styles.resourceCard}>
            <div className={styles.resourceHeader}>
              <ExclamationTriangleIcon className={styles.resourceIcon} />
              <div>
                <h3>Troubleshooting</h3>
                <p>Common issues and solutions</p>
              </div>
            </div>
            <button 
              className={styles.resourceButton}
              onClick={() => handleExternalLink('https://docs.agentsystems.ai/user-guide/troubleshooting')}
            >
              <LinkIcon className={styles.buttonIcon} />
              Troubleshooting
            </button>
          </Card>

          <Card className={styles.resourceCard}>
            <div className={styles.resourceHeader}>
              <AcademicCapIcon className={styles.resourceIcon} />
              <div>
                <h3>Agent Deployment Guide</h3>
                <p>Learn to deploy and publish your own agents</p>
              </div>
            </div>
            <button 
              className={styles.resourceButton}
              onClick={() => handleExternalLink('https://docs.agentsystems.ai/deploy-agents/quickstart')}
            >
              <LinkIcon className={styles.buttonIcon} />
              Deployment Guide
            </button>
          </Card>
        </section>

        {/* Community & Contribution */}
        <section className={styles.section}>
          <h2 className={styles.sectionTitle}>
            <HeartIcon className={styles.sectionIcon} />
            Community & Contribution
          </h2>
          
          <Card className={styles.resourceCard}>
            <div className={styles.resourceHeader}>
              <SparklesIcon className={styles.resourceIcon} />
              <div>
                <h3>Request Custom Agent</h3>
                <p>Need a specific workflow agent for your industry?</p>
              </div>
            </div>
            <button
              className={styles.resourceButton}
              onClick={() => handleExternalLink('https://agentsystems.ai/contact.html?inquiry=custom-agent')}
            >
              <LinkIcon className={styles.buttonIcon} />
              Request Agent
            </button>
          </Card>

          <Card className={styles.resourceCard}>
            <div className={styles.resourceHeader}>
              <CodeBracketIcon className={styles.resourceIcon} />
              <div>
                <h3>Contribute Code</h3>
                <p>Help improve the platform and build new features</p>
              </div>
            </div>
            <button 
              className={styles.resourceButton}
              onClick={() => handleExternalLink('https://github.com/agentsystems/agentsystems/blob/main/CONTRIBUTING.md')}
            >
              <LinkIcon className={styles.buttonIcon} />
              Contributing Guide
            </button>
          </Card>

          <Card className={styles.resourceCard}>
            <div className={styles.resourceHeader}>
              <UserGroupIcon className={styles.resourceIcon} />
              <div>
                <h3>Join Beta Program</h3>
                <p>Get early access to new features and provide feedback</p>
              </div>
            </div>
            <button 
              className={styles.resourceButton}
              onClick={() => handleExternalLink('https://agentsystems.ai/contact.html?inquiry=beta-program')}
            >
              <LinkIcon className={styles.buttonIcon} />
              Beta Program
            </button>
          </Card>
        </section>

        {/* Enterprise & Commercial */}
        <section className={styles.section}>
          <h2 className={styles.sectionTitle}>
            <BuildingOffice2Icon className={styles.sectionIcon} />
            Enterprise & Commercial
          </h2>
          
          <Card className={styles.resourceCard}>
            <div className={styles.resourceHeader}>
              <BuildingOffice2Icon className={styles.resourceIcon} />
              <div>
                <h3>Enterprise Support</h3>
                <p>Priority support, SLAs, and custom deployment assistance</p>
              </div>
            </div>
            <button
              className={styles.resourceButton}
              onClick={() => handleExternalLink('https://agentsystems.ai/contact.html?inquiry=enterprise-support')}
            >
              <LinkIcon className={styles.buttonIcon} />
              Contact Enterprise
            </button>
          </Card>

          <Card className={styles.resourceCard}>
            <div className={styles.resourceHeader}>
              <CodeBracketIcon className={styles.resourceIcon} />
              <div>
                <h3>Custom Agent Development</h3>
                <p>Professional services for custom workflow automation</p>
              </div>
            </div>
            <button
              className={styles.resourceButton}
              onClick={() => handleExternalLink('https://agentsystems.ai/contact.html?inquiry=custom-development')}
            >
              <LinkIcon className={styles.buttonIcon} />
              Custom Development
            </button>
          </Card>

          <Card className={styles.resourceCard}>
            <div className={styles.resourceHeader}>
              <AcademicCapIcon className={styles.resourceIcon} />
              <div>
                <h3>Training & Consulting</h3>
                <p>Expert guidance for agent deployment and best practices</p>
              </div>
            </div>
            <button 
              className={styles.resourceButton}
              onClick={() => handleExternalLink('https://agentsystems.ai/contact.html?inquiry=training-consulting')}
            >
              <LinkIcon className={styles.buttonIcon} />
              Training Services
            </button>
          </Card>

          <Card className={styles.resourceCard}>
            <div className={styles.resourceHeader}>
              <UserGroupIcon className={styles.resourceIcon} />
              <div>
                <h3>Partner Program</h3>
                <p>Become an AgentSystems integration partner</p>
              </div>
            </div>
            <button 
              className={styles.resourceButton}
              onClick={() => handleExternalLink('https://agentsystems.ai/contact.html?inquiry=partner-program')}
            >
              <LinkIcon className={styles.buttonIcon} />
              Partner Program
            </button>
          </Card>
        </section>
      </div>

      {/* Beta Feedback Banner */}
      <div className={styles.betaFeedbackBanner}>
        <div className={styles.feedbackContent}>
          <div>
            <h3>🚧 Beta Testing Feedback</h3>
            <p>Your feedback helps shape the future of AgentSystems. Share your experience, report issues, and suggest improvements.</p>
          </div>
          <button
            className={styles.feedbackButton}
            onClick={() => handleExternalLink('https://agentsystems.ai/contact.html?inquiry=beta-feedback')}
          >
            Provide Feedback
          </button>
        </div>
      </div>
    </div>
  )
}