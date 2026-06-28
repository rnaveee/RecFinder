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
        let message = "Request failed";
        try {
            const error = await response.json();
            message = error.message || message;
        } catch {}
        throw new Error(message);
    }

    if (response.status === 204) return null;
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

export async function updateCurrentUser(body){
    return await api("/users/me", {
        method: "PUT",
        body: JSON.stringify(body)
    });
}

export async function changePassword(body) {
    return await api("/users/me/password", {
        method: "PUT",
        body: JSON.stringify(body)
    });
}

export async function getScrimmages() {
    return await api("/scrimmages");
}

export async function getUser(id) {
    return await api(`/users/${id}`);
}

export async function getMyScrimmages() {
    return await api("/scrimmages/mine");
}

export async function getJoinedScrimmages() {
    return await api("/scrimmages/joined");
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

export async function updateScrimmage(id, body){
    return await api(`/scrimmages/${id}`, {
        method: "PUT",
        body: JSON.stringify(body)
    });
}

export async function deleteScrimmage(id){
    return await api(`/scrimmages/${id}`, {
        method: "DELETE",
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

export async function getSentRequests() {
    return await api("/friendships/sent");
}

export async function sendFriendRequest(addresseeId){
    return await api(`/friendships/${addresseeId}`, {
        method: "POST"
    });
}

export async function withdrawFriendRequest(friendshipId) {
    return await api(`/friendships/${friendshipId}/withdraw`, {
        method: "DELETE"
    });
}

export async function joinScrimmage(scrimmageId){
    return await api(`/scrimmages/${scrimmageId}/attendees`, {
        method: "POST"
    });
}
export async function leaveScrimmage(scrimmageId){
    return await api(`/scrimmages/${scrimmageId}/attendees`, {
        method: "DELETE"
    });
}

export async function removeFriend(friendshipId) {
    return await api(`/friendships/${friendshipId}/remove`, {
        method: "DELETE"
    });
}