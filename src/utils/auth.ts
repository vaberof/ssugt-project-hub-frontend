// Auth utilities for token management

const TOKEN_KEY = "accessToken";

/**
 * Сохраняет токен в localStorage
 */
export const saveToken = (token: string): void => {
  localStorage.setItem(TOKEN_KEY, token);
};

/**
 * Получает токен из localStorage
 */
export const getToken = (): string | null => {
  return localStorage.getItem(TOKEN_KEY);
};

/**
 * Удаляет токен из localStorage
 */
export const removeToken = (): void => {
  localStorage.removeItem(TOKEN_KEY);
};

/**
 * Проверяет, авторизован ли пользователь
 */
export const isAuthenticated = (): boolean => {
  return !!getToken();
};

/**
 * Создает заголовки с авторизацией для API запросов
 */
export const getAuthHeaders = (): Record<string, string> => {
  const token = getToken();
  const headers: Record<string, string> = {
    "Content-Type": "application/json",
  };

  if (token) {
    headers["Authorization"] = `Bearer ${token}`;
  }

  return headers;
};

/**
 * Выполняет авторизованный запрос к API
 */
export const fetchWithAuth = async (
  url: string,
  options: RequestInit = {},
): Promise<Response> => {
  const authHeaders = getAuthHeaders();

  const config: RequestInit = {
    ...options,
    headers: {
      ...authHeaders,
      ...options.headers,
    },
  };

  const response = await fetch(url, config);

  // Если получили 401, токен недействителен - удаляем его
  if (response.status === 401) {
    removeToken();
    // Можно добавить редирект на страницу логина
    window.location.href = "/login";
  }

  return response;
};

/**
 * Проверяет статус администратора на сервере (live, без кэша)
 */
export const checkAdminStatus = async (): Promise<boolean> => {
  const token = getToken();

  if (!token) {
    return false;
  }

  try {
    const response = await fetch("http://localhost:80/auth/is-admin", {
      method: "GET",
      headers: {
        Authorization: `${token}`,
      },
    });

    if (response.ok) {
      const data = await response.json();
      return data.isAdmin || false;
    } else if (response.status === 401) {
      // Токен недействителен
      removeToken();
      return false;
    }
  } catch (err) {
    console.error("Ошибка проверки статуса администратора:", err);
  }

  return false;
};

/**
 * Выход из системы - очищает токен
 * (перенаправление делаем через navigate в компонентах)
 */
export const logout = (): void => {
  removeToken();
  // Не используем window.location.href! Навигацию делаем в React-компоненте
};

export const getUserIdFromApi = async (): Promise<number | null> => {
  const token = getToken();
  if (!token) return null;

  try {
    const response = await fetch("http://localhost:80/auth/issuer", {
      method: "GET",
      headers: {
        Authorization: `${token}`,
        "Content-Type": "application/json",
      },
    });
    if (!response.ok) return null;
    const data = await response.json();
    // data.issuer — int
    return typeof data.issuer === "number" ? data.issuer : null;
  } catch {
    return null;
  }
};