export async function api(path, options = {}) {
    const headers = {
        "Content-Type": "application/json",
    };

    const token = localStorage.getItem("token");
    if (token) {
        headers["Authorization"] = `Bearer ${token}`;
    }

    const response = await fetch("/api" + path, {
        ...options,
        headers
    });

    if (!response.ok) {
        const error = await response.json();
        throw new Error(error.message || "Request failed");
    }

    return response.json();
}

export async function login(email, password) {
    return await api("/auth/login", {
        method: "POST",
        body: JSON.stringify({ email, password })
    });
}

export async function register(name, email, password) {
    return await api("/auth/register", {
        method: "POST",
        body: JSON.stringify({ name, email, password })
    });
}

export async function getCurrentUser() {
    return await api("/users/me", {
        method: "GET"
    });
}

export async function getScrimmages() {
    return await api("/scrimmages");
}

export async function getScrimmage(id) {
    return await api(`/scrimmages/${id}`);
}

export async function getAttendees(scrimmageId) {
    return await api(`/scrimmages/${scrimmageId}/attendees`);
}

export async function getFriendships() {
    return await api("/friendships");
}

export async function createScrimmage(body) {
    return await api("/scrimmages", {
        method: "POST",
        body: JSON.stringify(body)
    });
}

export async function getPendingRequests() {
    return await api("/friendships/requests");
}

export async function acceptFriendRequest(friendshipId) {
    return await api(`/friendships/${friendshipId}/accept`, {
        method: "PUT"
    });
}

export async function declineFriendRequest(friendshipId) {
    return await api(`/friendships/${friendshipId}/decline`, {
        method: "PUT"
    });
}