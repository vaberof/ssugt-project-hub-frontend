// Auth utilities for token management

const TOKEN_KEY = "accessToken";
const ADMIN_STATUS_KEY = "isAdmin";
const ADMIN_CHECK_TIMESTAMP_KEY = "adminCheckTimestamp";

// Время жизни кэша статуса админа (в миллисекундах) - 1 час
const ADMIN_CACHE_DURATION = 60 * 60 * 1000;

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
 * Сохраняет статус администратора в localStorage
 */
export const saveAdminStatus = (isAdmin: boolean): void => {
  localStorage.setItem(ADMIN_STATUS_KEY, JSON.stringify(isAdmin));
  localStorage.setItem(ADMIN_CHECK_TIMESTAMP_KEY, Date.now().toString());
};

/**
 * Получает статус администратора из localStorage
 */
export const getAdminStatus = (): boolean | null => {
  const timestamp = localStorage.getItem(ADMIN_CHECK_TIMESTAMP_KEY);
  const isAdminStr = localStorage.getItem(ADMIN_STATUS_KEY);

  if (!timestamp || !isAdminStr) {
    return null;
  }

  // Проверяем, не истек ли кэш
  const now = Date.now();
  const cachedTime = parseInt(timestamp, 10);

  if (now - cachedTime > ADMIN_CACHE_DURATION) {
    // Кэш истек, удаляем старые данные
    removeAdminStatus();
    return null;
  }

  return JSON.parse(isAdminStr);
};

/**
 * Удаляет статус администратора из localStorage
 */
export const removeAdminStatus = (): void => {
  localStorage.removeItem(ADMIN_STATUS_KEY);
  localStorage.removeItem(ADMIN_CHECK_TIMESTAMP_KEY);
};

/**
 * Проверяет статус ад��инистратора на сервере
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
        Authorization: `Bearer ${token}`,
      },
    });

    if (response.ok) {
      const data = await response.json();
      const isAdmin = data.isAdmin || false;

      // Сохраняем результат в кэш
      saveAdminStatus(isAdmin);

      return isAdmin;
    } else if (response.status === 401) {
      // Токен недействителен
      removeToken();
      removeAdminStatus();
      return false;
    }
  } catch (err) {
    console.error("Ошибка проверки статуса администратора:", err);
  }

  return false;
};

/**
 * Получает статус администратора (из кэша или с сервера)
 */
export const getOrCheckAdminStatus = async (): Promise<boolean> => {
  // Сначала проверяем кэш
  const cachedStatus = getAdminStatus();

  if (cachedStatus !== null) {
    return cachedStatus;
  }

  // Если в кэше нет или кэш истек, делаем запрос
  return await checkAdminStatus();
};

/**
 * Выход из системы
 */
export const logout = (): void => {
  removeToken();
  removeAdminStatus();
  window.location.href = "/login";
};
