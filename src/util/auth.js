export const loginUser = () => {
    localStorage.setItem("isAuthenticated", "true");
};

export const logoutUser = () => {
    localStorage.removeItem("isAuthenticated");
};

export const isAuthenticated = () => {
    return localStorage.getItem("isAuthenticated") === "true";
};
