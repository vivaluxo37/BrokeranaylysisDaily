import React from 'react'
import { render, screen, waitFor, act } from '@testing-library/react'
import { AuthProvider, useAuth } from '@/lib/contexts/AuthContext'
import { createBrowserClient } from '@supabase/ssr'

// Mock Supabase
jest.mock('@supabase/ssr')
const mockCreateBrowserClient = createBrowserClient as jest.MockedFunction<typeof createBrowserClient>

// Test component to access auth context
const TestComponent = () => {
  const { user, loading, signUp, signIn, signOut, updateProfile, updatePassword } = useAuth()
  
  return (
    <div>
      <div data-testid="loading">{loading ? 'loading' : 'loaded'}</div>
      <div data-testid="user">{user ? user.email : 'no user'}</div>
      <button onClick={() => signUp('test@example.com', 'password123')}>Sign Up</button>
      <button onClick={() => signIn('test@example.com', 'password123')}>Sign In</button>
      <button onClick={() => signOut()}>Sign Out</button>
      <button onClick={() => updateProfile({ firstName: 'John' })}>Update Profile</button>
      <button onClick={() => updatePassword('newpassword123')}>Update Password</button>
    </div>
  )
}

describe('AuthContext', () => {
  let mockSupabase: any

  beforeEach(() => {
    mockSupabase = {
      auth: {
        getSession: jest.fn(),
        signUp: jest.fn(),
        signInWithPassword: jest.fn(),
        signOut: jest.fn(),
        updateUser: jest.fn(),
        resetPasswordForEmail: jest.fn(),
        onAuthStateChange: jest.fn(() => ({
          data: { subscription: { unsubscribe: jest.fn() } }
        })),
      }
    }
    mockCreateBrowserClient.mockReturnValue(mockSupabase)
  })

  afterEach(() => {
    jest.clearAllMocks()
  })

  it('should provide initial loading state', async () => {
    mockSupabase.auth.getSession.mockResolvedValue({
      data: { session: null },
      error: null
    })

    render(
      <AuthProvider>
        <TestComponent />
      </AuthProvider>
    )

    expect(screen.getByTestId('loading')).toHaveTextContent('loading')
    
    await waitFor(() => {
      expect(screen.getByTestId('loading')).toHaveTextContent('loaded')
    })
  })

  it('should handle successful sign up', async () => {
    mockSupabase.auth.getSession.mockResolvedValue({
      data: { session: null },
      error: null
    })
    mockSupabase.auth.signUp.mockResolvedValue({
      data: { user: { email: 'test@example.com' } },
      error: null
    })

    render(
      <AuthProvider>
        <TestComponent />
      </AuthProvider>
    )

    await waitFor(() => {
      expect(screen.getByTestId('loading')).toHaveTextContent('loaded')
    })

    await act(async () => {
      screen.getByText('Sign Up').click()
    })

    expect(mockSupabase.auth.signUp).toHaveBeenCalledWith({
      email: 'test@example.com',
      password: 'password123',
      options: { data: {} }
    })
  })

  it('should handle sign up with metadata', async () => {
    mockSupabase.auth.getSession.mockResolvedValue({
      data: { session: null },
      error: null
    })
    mockSupabase.auth.signUp.mockResolvedValue({
      data: { user: { email: 'test@example.com' } },
      error: null
    })

    const TestComponentWithMetadata = () => {
      const { signUp } = useAuth()
      return (
        <button onClick={() => signUp('test@example.com', 'password123', { firstName: 'John' })}>
          Sign Up With Metadata
        </button>
      )
    }

    render(
      <AuthProvider>
        <TestComponentWithMetadata />
      </AuthProvider>
    )

    await waitFor(() => {
      expect(mockSupabase.auth.getSession).toHaveBeenCalled()
    })

    await act(async () => {
      screen.getByText('Sign Up With Metadata').click()
    })

    expect(mockSupabase.auth.signUp).toHaveBeenCalledWith({
      email: 'test@example.com',
      password: 'password123',
      options: { data: { firstName: 'John' } }
    })
  })

  it('should handle successful sign in', async () => {
    mockSupabase.auth.getSession.mockResolvedValue({
      data: { session: null },
      error: null
    })
    mockSupabase.auth.signInWithPassword.mockResolvedValue({
      data: { user: { email: 'test@example.com' } },
      error: null
    })

    render(
      <AuthProvider>
        <TestComponent />
      </AuthProvider>
    )

    await waitFor(() => {
      expect(screen.getByTestId('loading')).toHaveTextContent('loaded')
    })

    await act(async () => {
      screen.getByText('Sign In').click()
    })

    expect(mockSupabase.auth.signInWithPassword).toHaveBeenCalledWith({
      email: 'test@example.com',
      password: 'password123'
    })
  })

  it('should handle sign out', async () => {
    mockSupabase.auth.getSession.mockResolvedValue({
      data: { session: null },
      error: null
    })
    mockSupabase.auth.signOut.mockResolvedValue({
      error: null
    })

    render(
      <AuthProvider>
        <TestComponent />
      </AuthProvider>
    )

    await waitFor(() => {
      expect(screen.getByTestId('loading')).toHaveTextContent('loaded')
    })

    await act(async () => {
      screen.getByText('Sign Out').click()
    })

    expect(mockSupabase.auth.signOut).toHaveBeenCalled()
  })

  it('should handle profile update', async () => {
    mockSupabase.auth.getSession.mockResolvedValue({
      data: { session: null },
      error: null
    })
    mockSupabase.auth.updateUser.mockResolvedValue({
      data: { user: { email: 'test@example.com' } },
      error: null
    })

    render(
      <AuthProvider>
        <TestComponent />
      </AuthProvider>
    )

    await waitFor(() => {
      expect(screen.getByTestId('loading')).toHaveTextContent('loaded')
    })

    await act(async () => {
      screen.getByText('Update Profile').click()
    })

    expect(mockSupabase.auth.updateUser).toHaveBeenCalledWith({
      data: { firstName: 'John' }
    })
  })

  it('should handle password update', async () => {
    mockSupabase.auth.getSession.mockResolvedValue({
      data: { session: null },
      error: null
    })
    mockSupabase.auth.updateUser.mockResolvedValue({
      data: { user: { email: 'test@example.com' } },
      error: null
    })

    render(
      <AuthProvider>
        <TestComponent />
      </AuthProvider>
    )

    await waitFor(() => {
      expect(screen.getByTestId('loading')).toHaveTextContent('loaded')
    })

    await act(async () => {
      screen.getByText('Update Password').click()
    })

    expect(mockSupabase.auth.updateUser).toHaveBeenCalledWith({
      password: 'newpassword123'
    })
  })

  it('should handle auth errors gracefully', async () => {
    const authError = { message: 'Invalid credentials' }
    mockSupabase.auth.getSession.mockResolvedValue({
      data: { session: null },
      error: null
    })
    mockSupabase.auth.signInWithPassword.mockResolvedValue({
      data: null,
      error: authError
    })

    render(
      <AuthProvider>
        <TestComponent />
      </AuthProvider>
    )

    await waitFor(() => {
      expect(screen.getByTestId('loading')).toHaveTextContent('loaded')
    })

    await act(async () => {
      screen.getByText('Sign In').click()
    })

    expect(mockSupabase.auth.signInWithPassword).toHaveBeenCalled()
    // Error handling is done by the calling component, not the context
  })

  it('should handle session changes', async () => {
    const mockSession = {
      user: { email: 'test@example.com', id: '123' },
      access_token: 'token'
    }

    mockSupabase.auth.getSession.mockResolvedValue({
      data: { session: mockSession },
      error: null
    })

    let authStateCallback: any
    mockSupabase.auth.onAuthStateChange.mockImplementation((callback) => {
      authStateCallback = callback
      return { data: { subscription: { unsubscribe: jest.fn() } } }
    })

    render(
      <AuthProvider>
        <TestComponent />
      </AuthProvider>
    )

    await waitFor(() => {
      expect(screen.getByTestId('user')).toHaveTextContent('test@example.com')
    })

    // Simulate auth state change
    act(() => {
      authStateCallback('SIGNED_OUT', null)
    })

    await waitFor(() => {
      expect(screen.getByTestId('user')).toHaveTextContent('no user')
    })
  })

  it('should throw error when used outside provider', () => {
    // Suppress console.error for this test
    const consoleSpy = jest.spyOn(console, 'error').mockImplementation()

    expect(() => {
      render(<TestComponent />)
    }).toThrow('useAuth must be used within an AuthProvider')

    consoleSpy.mockRestore()
  })
})
