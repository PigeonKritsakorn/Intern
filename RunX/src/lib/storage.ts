export function getUserLogin() {
  return localStorage.getItem("Login");
}

export function setUserLogin(value: string) {
  localStorage.setItem("Login", value);
  return localStorage.getItem("Login");
}

export function setUserLogout() {
  localStorage.clear();
}

export function getAdminLogin() {
  return localStorage.getItem("AdminToken");
}

export function setAdminLogin(token: string) {
  localStorage.setItem("AdminToken", token);
  return localStorage.getItem("AdminLogin");
}

export function removeAdminLogin() {
  localStorage.removeItem("AdminToken");
}
