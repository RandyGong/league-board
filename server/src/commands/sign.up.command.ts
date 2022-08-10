export class SignUpCommand {
  openId: string;
  nickName: string;
  avatarUrl: string;
  team: "noTeam" | "white" | "blue" | "red";
  isDelegate: boolean;
  status: "confirmed" | "tbd" | "leave";
  reason: string;
}
