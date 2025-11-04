export type Role = "guest" | "user" | "admin";

export interface CurrentUser {
    username: string;
    role: Role;
}

export interface AppState {
    xssEnabled: boolean;
    bacEnabled: boolean;
    messages: string[];
    logs: string[];
    currentUser: CurrentUser;
}

export interface TogglePayload {
    xssEnabled?: boolean;
    bacEnabled?: boolean;
}