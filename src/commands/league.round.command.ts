export class LeagueRoundCommand {
  date: string;
  scoring: {
    team: string;
    score: number;
  }[];
}
