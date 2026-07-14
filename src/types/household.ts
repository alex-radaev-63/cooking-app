export interface Invite {
  id: string;
  household: {
    id: string;
    name: string;
  };
  invited_by_name: string;
  invited_email: string;
  status: "pending" | "accepted" | "declined";
  created_at: string;
};

export interface Household {
  id: string;
  name: string;
  created_at: string;
  role: "owner" | "editor";
}