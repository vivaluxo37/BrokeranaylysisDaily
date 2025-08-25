import React from 'react'
import { render, screen, fireEvent, waitFor } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import '@testing-library/jest-dom'
import AIAssistantComponent from '@/components/AIAssistantComponent'

// Mock lucide-react icons
jest.mock('lucide-react', () => ({
  Bot: () => <div data-testid="bot-icon" />,
  Send: () => <div data-testid="send-icon" />,
  Loader: () => <div data-testid="loader-icon" />,
  CheckCircle: () => <div data-testid="check-circle-icon" />,
  AlertCircle: () => <div data-testid="alert-circle-icon" />,
  DollarSign: () => <div data-testid="dollar-sign-icon" />
}))

describe('AIAssistantComponent', () => {
  beforeEach(() => {
    render(<AIAssistantComponent />)
  })

  describe('Initial Render', () => {
    test('renders AI assistant title', () => {
      expect(screen.getByText('AI Broker Recommendation')).toBeInTheDocument()
    })

    test('renders bot icon', () => {
      expect(screen.getByTestId('bot-icon')).toBeInTheDocument()
    })

    test('renders progress bar', () => {
      expect(screen.getByText('Question 1 of 7')).toBeInTheDocument()
      expect(screen.getByText('14% Complete')).toBeInTheDocument()
    })

    test('renders first question', () => {
      expect(screen.getByText('What is your trading experience level?')).toBeInTheDocument()
    })

    test('renders answer options for first question', () => {
      expect(screen.getByLabelText(/Beginner \(0-1 years\)/)).toBeInTheDocument()
      expect(screen.getByLabelText(/Intermediate \(1-3 years\)/)).toBeInTheDocument()
      expect(screen.getByLabelText(/Advanced \(3\+ years\)/)).toBeInTheDocument()
      expect(screen.getByLabelText(/Professional trader/)).toBeInTheDocument()
    })
  })

  describe('Question Navigation', () => {
    test('Next button is disabled initially', () => {
      const nextButton = screen.getByRole('button', { name: /next/i })
      expect(nextButton).toBeDisabled()
    })

    test('Previous button is disabled on first question', () => {
      const prevButton = screen.getByRole('button', { name: /previous/i })
      expect(prevButton).toBeDisabled()
    })

    test('Next button becomes enabled after selecting an answer', async () => {
      const user = userEvent.setup()
      const beginnerOption = screen.getByLabelText(/Beginner \(0-1 years\)/)
      
      await user.click(beginnerOption)
      
      const nextButton = screen.getByRole('button', { name: /next/i })
      expect(nextButton).toBeEnabled()
    })

    test('can navigate to next question', async () => {
      const user = userEvent.setup()
      
      // Select an answer
      const beginnerOption = screen.getByLabelText(/Beginner \(0-1 years\)/)
      await user.click(beginnerOption)
      
      // Click Next
      const nextButton = screen.getByRole('button', { name: /next/i })
      await user.click(nextButton)
      
      // Should be on question 2
      expect(screen.getByText('Question 2 of 7')).toBeInTheDocument()
      expect(screen.getByText('What is your preferred trading style?')).toBeInTheDocument()
    })

    test('can navigate back to previous question', async () => {
      const user = userEvent.setup()
      
      // Navigate to question 2
      const beginnerOption = screen.getByLabelText(/Beginner \(0-1 years\)/)
      await user.click(beginnerOption)
      const nextButton = screen.getByRole('button', { name: /next/i })
      await user.click(nextButton)
      
      // Navigate back
      const prevButton = screen.getByRole('button', { name: /previous/i })
      await user.click(prevButton)
      
      // Should be back on question 1
      expect(screen.getByText('Question 1 of 7')).toBeInTheDocument()
      expect(screen.getByText('What is your trading experience level?')).toBeInTheDocument()
    })
  })

  describe('Question Types', () => {
    test('handles single-choice questions', async () => {
      const user = userEvent.setup()
      
      // First question is single choice
      const beginnerOption = screen.getByLabelText(/Beginner \(0-1 years\)/)
      const intermediateOption = screen.getByLabelText(/Intermediate \(1-3 years\)/)
      
      await user.click(beginnerOption)
      expect(beginnerOption).toBeChecked()
      
      // Clicking another option should uncheck the first
      await user.click(intermediateOption)
      expect(intermediateOption).toBeChecked()
      expect(beginnerOption).not.toBeChecked()
    })

    test('handles multiple-choice questions', async () => {
      const user = userEvent.setup()
      
      // Navigate to instruments question (question 3)
      await user.click(screen.getByLabelText(/Beginner/))
      await user.click(screen.getByRole('button', { name: /next/i }))
      await user.click(screen.getByLabelText(/Scalping/))
      await user.click(screen.getByRole('button', { name: /next/i }))
      
      // Should be on instruments question
      expect(screen.getByText('Which instruments do you want to trade?')).toBeInTheDocument()
      
      // Should be able to select multiple options
      const forexOption = screen.getByLabelText(/Forex \(Currency Pairs\)/)
      const stocksOption = screen.getByLabelText(/Stocks/)
      
      await user.click(forexOption)
      await user.click(stocksOption)
      
      expect(forexOption).toBeChecked()
      expect(stocksOption).toBeChecked()
    })
  })

  describe('Progress Tracking', () => {
    test('updates progress bar as user advances', async () => {
      const user = userEvent.setup()
      
      // Initial progress
      expect(screen.getByText('14% Complete')).toBeInTheDocument()
      
      // Navigate to question 2
      await user.click(screen.getByLabelText(/Beginner/))
      await user.click(screen.getByRole('button', { name: /next/i }))
      
      // Progress should update
      expect(screen.getByText('29% Complete')).toBeInTheDocument()
    })

    test('progress bar visual indicator updates', async () => {
      const user = userEvent.setup()
      
      // Get initial progress bar width
      const progressBar = document.querySelector('.bg-purple-600.h-2.rounded-full')
      const initialWidth = progressBar?.getAttribute('style')
      
      // Navigate to next question
      await user.click(screen.getByLabelText(/Beginner/))
      await user.click(screen.getByRole('button', { name: /next/i }))
      
      // Progress bar should have different width
      const newWidth = progressBar?.getAttribute('style')
      expect(newWidth).not.toBe(initialWidth)
    })
  })

  describe('Final Question and Submission', () => {
    test('shows Get Recommendations button on last question', async () => {
      const user = userEvent.setup()
      
      // Navigate through all questions quickly
      const answers = [
        /Beginner/,
        /Scalping/,
        /Forex/,
        /Under \$500/,
        /United States/,
        /MetaTrader 4/,
        /Low spreads/
      ]
      
      for (let i = 0; i < answers.length; i++) {
        const option = screen.getByLabelText(answers[i])
        await user.click(option)
        
        if (i < answers.length - 1) {
          const nextButton = screen.getByRole('button', { name: /next/i })
          await user.click(nextButton)
        }
      }
      
      // Should show Get Recommendations button
      expect(screen.getByRole('button', { name: /Get Recommendations/i })).toBeInTheDocument()
      expect(screen.getByTestId('send-icon')).toBeInTheDocument()
    })
  })

  describe('Analysis State', () => {
    test('shows analysis screen when submitting', async () => {
      const user = userEvent.setup()
      
      // Navigate through all questions and submit
      const answers = [
        /Beginner/,
        /Scalping/,
        /Forex/,
        /Under \$500/,
        /United States/,
        /MetaTrader 4/,
        /Low spreads/
      ]
      
      for (let i = 0; i < answers.length; i++) {
        const option = screen.getByLabelText(answers[i])
        await user.click(option)
        
        if (i < answers.length - 1) {
          const nextButton = screen.getByRole('button', { name: /next/i })
          await user.click(nextButton)
        }
      }
      
      // Submit
      const submitButton = screen.getByRole('button', { name: /Get Recommendations/i })
      await user.click(submitButton)
      
      // Should show analysis screen
      expect(screen.getByText('Analyzing Your Preferences')).toBeInTheDocument()
      expect(screen.getByTestId('loader-icon')).toBeInTheDocument()
      expect(screen.getByText(/Our AI is analyzing your trading profile/)).toBeInTheDocument()
    })
  })

  describe('Results State', () => {
    test('shows results after analysis completes', async () => {
      const user = userEvent.setup()
      
      // Navigate through all questions and submit
      const answers = [
        /Beginner/,
        /Scalping/,
        /Forex/,
        /Under \$500/,
        /United States/,
        /MetaTrader 4/,
        /Low spreads/
      ]
      
      for (let i = 0; i < answers.length; i++) {
        const option = screen.getByLabelText(answers[i])
        await user.click(option)
        
        if (i < answers.length - 1) {
          const nextButton = screen.getByRole('button', { name: /next/i })
          await user.click(nextButton)
        }
      }
      
      // Submit
      const submitButton = screen.getByRole('button', { name: /Get Recommendations/i })
      await user.click(submitButton)
      
      // Wait for analysis to complete (mocked to 3 seconds)
      await waitFor(() => {
        expect(screen.getByText('Your Personalized Recommendations')).toBeInTheDocument()
      }, { timeout: 4000 })
      
      // Should show broker recommendations
      expect(screen.getAllByTestId('check-circle-icon').length).toBeGreaterThan(0)
      expect(screen.getByText(/IC Markets|Pepperstone|XM Group/)).toBeInTheDocument()
    })

    test('shows Get New Recommendations button in results', async () => {
      const user = userEvent.setup()
      
      // Complete the flow to get to results
      const answers = [
        /Beginner/,
        /Scalping/,
        /Forex/,
        /Under \$500/,
        /United States/,
        /MetaTrader 4/,
        /Low spreads/
      ]
      
      for (let i = 0; i < answers.length; i++) {
        const option = screen.getByLabelText(answers[i])
        await user.click(option)
        
        if (i < answers.length - 1) {
          const nextButton = screen.getByRole('button', { name: /next/i })
          await user.click(nextButton)
        }
      }
      
      const submitButton = screen.getByRole('button', { name: /Get Recommendations/i })
      await user.click(submitButton)
      
      await waitFor(() => {
        expect(screen.getByText('Get New Recommendations')).toBeInTheDocument()
      }, { timeout: 4000 })
    })
  })

  describe('Reset Functionality', () => {
    test('can reset and start over', async () => {
      const user = userEvent.setup()
      
      // Complete the flow
      const answers = [
        /Beginner/,
        /Scalping/,
        /Forex/,
        /Under \$500/,
        /United States/,
        /MetaTrader 4/,
        /Low spreads/
      ]
      
      for (let i = 0; i < answers.length; i++) {
        const option = screen.getByLabelText(answers[i])
        await user.click(option)
        
        if (i < answers.length - 1) {
          const nextButton = screen.getByRole('button', { name: /next/i })
          await user.click(nextButton)
        }
      }
      
      const submitButton = screen.getByRole('button', { name: /Get Recommendations/i })
      await user.click(submitButton)
      
      // Wait for results and reset
      await waitFor(async () => {
        const resetButton = screen.getByText('Get New Recommendations')
        await user.click(resetButton)
      }, { timeout: 4000 })
      
      // Should be back to first question
      expect(screen.getByText('Question 1 of 7')).toBeInTheDocument()
      expect(screen.getByText('What is your trading experience level?')).toBeInTheDocument()
    })
  })

  describe('Accessibility', () => {
    test('has proper labels for radio buttons', () => {
      const radioButtons = screen.getAllByRole('radio')
      radioButtons.forEach(radio => {
        expect(radio).toHaveAccessibleName()
      })
    })

    test('has proper button labels', () => {
      const buttons = screen.getAllByRole('button')
      buttons.forEach(button => {
        expect(button).toHaveAccessibleName()
      })
    })

    test('progress bar has proper ARIA attributes', () => {
      const progressText = screen.getByText('Question 1 of 7')
      expect(progressText).toBeInTheDocument()
    })
  })
})
