const API_BASE = '/api';

const getAuthHeaders = () => {
  const token = localStorage.getItem('authToken');
  return {
    'Content-Type': 'application/json',
    ...(token ? { Authorization: `Bearer ${token}` } : {}),
  };
};

export const apiLogin = async (email, password) => {
  try {
    const res = await fetch(`${API_BASE}/auth/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, password }),
    });
    const data = await res.json();
    if (res.ok && data.success) {
      if (data.token) {
        localStorage.setItem('authToken', data.token);
      }
      return { success: true, ...data };
    }
    return { success: false, message: data.message || 'Login failed' };
  } catch (error) {
    console.warn('[API] Backend unreachable for login, falling back to local mode:', error.message);
    return { success: false, networkError: true };
  }
};

export const apiFetchEmployees = async () => {
  try {
    const res = await fetch(`${API_BASE}/employees`, {
      headers: getAuthHeaders(),
    });
    const data = await res.json();
    if (res.ok && data.success) {
      return data.employees;
    }
    return null;
  } catch (error) {
    console.warn('[API] Backend unreachable for employees list, using local fallback:', error.message);
    return null;
  }
};

export const apiCreateTask = async (taskPayload) => {
  try {
    const res = await fetch(`${API_BASE}/tasks`, {
      method: 'POST',
      headers: getAuthHeaders(),
      body: JSON.stringify(taskPayload),
    });
    const data = await res.json();
    if (res.ok && data.success) {
      return { success: true, data };
    }
    return { success: false, message: data.message || 'Failed to create task' };
  } catch (error) {
    console.warn('[API] Backend unreachable for task creation, saving locally:', error.message);
    return { success: false, networkError: true };
  }
};

export const apiUpdateTaskStatus = async (employeeId, taskIndex, nextStatus) => {
  try {
    const res = await fetch(`${API_BASE}/tasks/status`, {
      method: 'PATCH',
      headers: getAuthHeaders(),
      body: JSON.stringify({ employeeId, taskIndex, nextStatus }),
    });
    const data = await res.json();
    if (res.ok && data.success) {
      return { success: true, employee: data.employee };
    }
    return { success: false, message: data.message || 'Failed to update task status' };
  } catch (error) {
    console.warn('[API] Backend unreachable for status update, saving locally:', error.message);
    return { success: false, networkError: true };
  }
};
