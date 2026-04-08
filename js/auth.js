// Mehis Auth - Login & Registration with Supabase

// Your config
const SUPABASE_URL = 'https://etgaxhkizapqzzxdttrn.supabase.co'
const SUPABASE_ANON_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImV0Z2F4aGtpemFwcXp6eGR0dHJuIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzU2NzMzOTQsImV4cCI6MjA5MTI0OTM5NH0.XlgKhu0wAo1570kgexl5a9gnhD-x0e_eOs7O_ucK640'

// Register new user
async function registerUser(email, password, fullName) {
  try {
    // 1. Create auth user
    const authResponse = await fetch(`${SUPABASE_URL}/auth/v1/signup`, {
      method: 'POST',
      headers: {
        'apikey': SUPABASE_ANON_KEY,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ email, password })
    })
    
    const authData = await authResponse.json()
    
    if (authData.error) {
      return { success: false, error: authData.error.message }
    }
    
    // 2. Add to users table
    const userResponse = await fetch(`${SUPABASE_URL}/rest/v1/users`, {
      method: 'POST',
      headers: {
        'apikey': SUPABASE_ANON_KEY,
        'Authorization': `Bearer ${authData.session.access_token}`,
        'Content-Type': 'application/json',
        'Prefer': 'return=minimal'
      },
      body: JSON.stringify({
        id: authData.user.id,
        email: email,
        full_name: fullName,
        tier: 'free'
      })
    })
    
    return { success: true, user: authData.user }
    
  } catch (error) {
    return { success: false, error: error.message }
  }
}

// Login user
async function loginUser(email, password) {
  try {
    const response = await fetch(`${SUPABASE_URL}/auth/v1/token?grant_type=password`, {
      method: 'POST',
      headers: {
        'apikey': SUPABASE_ANON_KEY,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ email, password })
    })
    
    const data = await response.json()
    
    if (data.error) {
      return { success: false, error: data.error.message }
    }
    
    return { success: true, session: data.session }
    
  } catch (error) {
    return { success: false, error: error.message }
  }
}

// Get user profile
async function getUserProfile(userId) {
  try {
    const response = await fetch(`${SUPABASE_URL}/rest/v1/users?id=eq.${userId}`, {
      headers: {
        'apikey': SUPABASE_ANON_KEY,
        'Content-Type': 'application/json'
      }
    })
    
    const data = await response.json()
    return data[0] || null
    
  } catch (error) {
    return null
  }
}

// Check if user is logged in
function isLoggedIn() {
  return localStorage.getItem('mehis_user') !== null
}

// Get current user
function getCurrentUser() {
  const user = localStorage.getItem('mehis_user')
  return user ? JSON.parse(user) : null
}

// Logout
function logout() {
  localStorage.removeItem('mehis_user')
  window.location.href = 'login.html'
}

// Save user to localStorage
function saveUser(userData) {
  localStorage.setItem('mehis_user', JSON.stringify(userData))
}