import React from 'react'
import { render, screen, fireEvent, waitFor } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import '@testing-library/jest-dom'
import TradingCalculatorComponent from '@/components/TradingCalculatorComponent'

// Mock lucide-react icons
jest.mock('lucide-react', () => ({
  Calculator: () => <div data-testid="calculator-icon" />,
  TrendingUp: () => <div data-testid="trending-up-icon" />,
  DollarSign: () => <div data-testid="dollar-sign-icon" />,
  Percent: () => <div data-testid="percent-icon" />
}))

describe('TradingCalculatorComponent', () => {
  beforeEach(() => {
    render(<TradingCalculatorComponent />)
  })

  describe('Initial Render', () => {
    test('renders calculator title', () => {
      expect(screen.getByText('Trading Calculator')).toBeInTheDocument()
    })

    test('renders trade parameters section', () => {
      expect(screen.getByText('Trade Parameters')).toBeInTheDocument()
    })

    test('renders calculation results section', () => {
      expect(screen.getByText('Calculation Results')).toBeInTheDocument()
    })

    test('renders all required input fields', () => {
      expect(screen.getByLabelText(/currency pair/i)).toBeInTheDocument()
      expect(screen.getByLabelText(/position type/i)).toBeInTheDocument()
      expect(screen.getByLabelText(/lot size/i)).toBeInTheDocument()
      expect(screen.getByLabelText(/entry price/i)).toBeInTheDocument()
      expect(screen.getByLabelText(/exit price/i)).toBeInTheDocument()
      expect(screen.getByLabelText(/spread/i)).toBeInTheDocument()
      expect(screen.getByLabelText(/commission/i)).toBeInTheDocument()
    })
  })

  describe('Currency Pair Selection', () => {
    test('has default currency pair selected', () => {
      const currencySelect = screen.getByLabelText(/currency pair/i) as HTMLSelectElement
      expect(currencySelect.value).toBe('EURUSD')
    })

    test('can change currency pair', async () => {
      const user = userEvent.setup()
      const currencySelect = screen.getByLabelText(/currency pair/i)
      
      await user.selectOptions(currencySelect, 'GBPUSD')
      expect(currencySelect).toHaveValue('GBPUSD')
    })

    test('displays currency pair options', () => {
      const currencySelect = screen.getByLabelText(/currency pair/i)
      const options = currencySelect.querySelectorAll('option')
      
      expect(options.length).toBeGreaterThan(5)
      expect(screen.getByRole('option', { name: /EURUSD - Euro \/ US Dollar/i })).toBeInTheDocument()
      expect(screen.getByRole('option', { name: /GBPUSD - British Pound \/ US Dollar/i })).toBeInTheDocument()
    })
  })

  describe('Position Type Selection', () => {
    test('has buy position selected by default', () => {
      const buyRadio = screen.getByLabelText(/buy \(long\)/i) as HTMLInputElement
      expect(buyRadio.checked).toBe(true)
    })

    test('can switch to sell position', async () => {
      const user = userEvent.setup()
      const sellRadio = screen.getByLabelText(/sell \(short\)/i)
      
      await user.click(sellRadio)
      expect(sellRadio).toBeChecked()
    })
  })

  describe('Numeric Inputs', () => {
    test('has default values for numeric inputs', () => {
      const lotSizeInput = screen.getByLabelText(/lot size/i) as HTMLInputElement
      const entryPriceInput = screen.getByLabelText(/entry price/i) as HTMLInputElement
      const exitPriceInput = screen.getByLabelText(/exit price/i) as HTMLInputElement
      const spreadInput = screen.getByLabelText(/spread/i) as HTMLInputElement
      
      expect(lotSizeInput.value).toBe('1')
      expect(entryPriceInput.value).toBe('1.1')
      expect(exitPriceInput.value).toBe('1.105')
      expect(spreadInput.value).toBe('1.5')
    })

    test('can update lot size', async () => {
      const user = userEvent.setup()
      const lotSizeInput = screen.getByLabelText(/lot size/i)
      
      await user.clear(lotSizeInput)
      await user.type(lotSizeInput, '0.5')
      
      expect(lotSizeInput).toHaveValue(0.5)
    })

    test('can update entry price', async () => {
      const user = userEvent.setup()
      const entryPriceInput = screen.getByLabelText(/entry price/i)
      
      await user.clear(entryPriceInput)
      await user.type(entryPriceInput, '1.2000')
      
      expect(entryPriceInput).toHaveValue(1.2)
    })

    test('can update exit price', async () => {
      const user = userEvent.setup()
      const exitPriceInput = screen.getByLabelText(/exit price/i)
      
      await user.clear(exitPriceInput)
      await user.type(exitPriceInput, '1.2050')
      
      expect(exitPriceInput).toHaveValue(1.205)
    })
  })

  describe('Calculation Results', () => {
    test('displays pip value result', () => {
      expect(screen.getByText('Pip Value')).toBeInTheDocument()
      expect(screen.getByText('Per pip movement')).toBeInTheDocument()
    })

    test('displays trading costs result', () => {
      expect(screen.getByText('Trading Costs')).toBeInTheDocument()
      expect(screen.getByText('Spread Cost:')).toBeInTheDocument()
      expect(screen.getByText('Commission:')).toBeInTheDocument()
      expect(screen.getByText('Total Cost:')).toBeInTheDocument()
    })

    test('displays profit/loss result', () => {
      expect(screen.getByText('Profit/Loss')).toBeInTheDocument()
      expect(screen.getByText('Gross P/L:')).toBeInTheDocument()
      expect(screen.getByText('Net P/L:')).toBeInTheDocument()
    })

    test('displays trade summary', () => {
      expect(screen.getByText('Trade Summary')).toBeInTheDocument()
      expect(screen.getByText(/Position:/)).toBeInTheDocument()
      expect(screen.getByText(/Entry:/)).toBeInTheDocument()
      expect(screen.getByText(/Exit:/)).toBeInTheDocument()
      expect(screen.getByText(/Pip Movement:/)).toBeInTheDocument()
    })
  })

  describe('Real-time Calculations', () => {
    test('updates calculations when lot size changes', async () => {
      const user = userEvent.setup()
      const lotSizeInput = screen.getByLabelText(/lot size/i)
      
      // Get initial pip value
      const initialPipValue = screen.getByText('Pip Value').closest('div')?.textContent
      
      // Change lot size
      await user.clear(lotSizeInput)
      await user.type(lotSizeInput, '2')
      
      // Wait for calculation update
      await waitFor(() => {
        const newPipValue = screen.getByText('Pip Value').closest('div')?.textContent
        expect(newPipValue).not.toBe(initialPipValue)
      })
    })

    test('updates calculations when position type changes', async () => {
      const user = userEvent.setup()
      
      // Get initial P/L
      const initialPL = screen.getByText('Net P/L:').parentElement?.textContent
      
      // Switch to sell position
      const sellRadio = screen.getByLabelText(/sell \(short\)/i)
      await user.click(sellRadio)
      
      // Wait for calculation update
      await waitFor(() => {
        const newPL = screen.getByText('Net P/L:').parentElement?.textContent
        expect(newPL).not.toBe(initialPL)
      })
    })

    test('updates calculations when spread changes', async () => {
      const user = userEvent.setup()
      const spreadInput = screen.getByLabelText(/spread/i)
      
      // Get initial spread cost
      const initialSpreadCost = screen.getByText('Spread Cost:').parentElement?.textContent
      
      // Change spread
      await user.clear(spreadInput)
      await user.type(spreadInput, '3.0')
      
      // Wait for calculation update
      await waitFor(() => {
        const newSpreadCost = screen.getByText('Spread Cost:').parentElement?.textContent
        expect(newSpreadCost).not.toBe(initialSpreadCost)
      })
    })
  })

  describe('Currency Formatting', () => {
    test('displays currency values with proper formatting', () => {
      // Check that currency values are displayed with $ symbol
      const pipValueElement = screen.getByText('Pip Value').closest('div')
      expect(pipValueElement).toHaveTextContent('$')
      
      const totalCostElement = screen.getByText('Total Cost:').parentElement
      expect(totalCostElement).toHaveTextContent('$')
    })
  })

  describe('Input Validation', () => {
    test('handles invalid numeric inputs gracefully', async () => {
      const user = userEvent.setup()
      const lotSizeInput = screen.getByLabelText(/lot size/i)
      
      // Try to enter invalid input
      await user.clear(lotSizeInput)
      await user.type(lotSizeInput, 'invalid')
      
      // Should not crash and should handle gracefully
      expect(lotSizeInput).toHaveValue(null)
    })

    test('respects minimum values for inputs', () => {
      const lotSizeInput = screen.getByLabelText(/lot size/i) as HTMLInputElement
      const spreadInput = screen.getByLabelText(/spread/i) as HTMLInputElement
      const commissionInput = screen.getByLabelText(/commission/i) as HTMLInputElement
      
      expect(lotSizeInput.min).toBe('0.01')
      expect(spreadInput.min).toBe('0')
      expect(commissionInput.min).toBe('0')
    })

    test('has proper step values for inputs', () => {
      const lotSizeInput = screen.getByLabelText(/lot size/i) as HTMLInputElement
      const entryPriceInput = screen.getByLabelText(/entry price/i) as HTMLInputElement
      const spreadInput = screen.getByLabelText(/spread/i) as HTMLInputElement
      
      expect(lotSizeInput.step).toBe('0.01')
      expect(entryPriceInput.step).toBe('0.0001')
      expect(spreadInput.step).toBe('0.1')
    })
  })

  describe('Accessibility', () => {
    test('has proper labels for all inputs', () => {
      const inputs = screen.getAllByRole('textbox')
      const selects = screen.getAllByRole('combobox')
      const radios = screen.getAllByRole('radio')
      
      inputs.forEach(input => {
        expect(input).toHaveAccessibleName()
      })
      
      selects.forEach(select => {
        expect(select).toHaveAccessibleName()
      })
      
      radios.forEach(radio => {
        expect(radio).toHaveAccessibleName()
      })
    })

    test('has proper ARIA labels and descriptions', () => {
      const lotSizeInput = screen.getByLabelText(/lot size/i)
      expect(lotSizeInput).toHaveAccessibleName()

      // Check for description text
      const lotSizeDescription = screen.getByText(/1.0 = Standard lot/)
      expect(lotSizeDescription).toBeInTheDocument()
    })
  })

  describe('Icons and Visual Elements', () => {
    test('renders calculator icon', () => {
      expect(screen.getByTestId('calculator-icon')).toBeInTheDocument()
    })

    test('renders result section icons', () => {
      expect(screen.getByTestId('trending-up-icon')).toBeInTheDocument()
      expect(screen.getByTestId('percent-icon')).toBeInTheDocument()
      expect(screen.getByTestId('dollar-sign-icon')).toBeInTheDocument()
    })
  })
})
