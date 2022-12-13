// @flow
const Msg = {
  settings: (): string => "Einstellungen",
  forNextGame: (): string => "Für das nächste Spiel",
  numRows: (): string => "Anzahl Zeilen",
  botPlaying: (player:number): string =>
  `Computer spielt für Spieler ${player + 1}`,
  lastWins: () => "Mit letztem Zug gewinnen",
  lastLooses: () => "Mit letztem Zug verlieren",
  forAtOnce: (player:number): string => `Für Computer ${player + 1}`,
  priority: () => `Auswahl bei mehreren gleich guten Zügen`,
  animationMs: () => `Dauer der Zuganimation in ms`,
  random: () => "Zufällig",
  short: () => "Möglichst wenig streichen",
  long: () => "Möglichst viel streichen",

  rules: (): string => "Spielregeln",
  rulesContent: () => `
  2 Spieler checken abwechselnd zusammenhängende Abschnitte von Checkboxen
        in einer Zeile. In Zeile 1 befindet sich nur eine Checkbox, in der nächsten eine mehr usw.
        Ein gecheckter Abschnitt darf aus beliebig vielen bisher ungecheckten Checkboxen nebeneinander bestehen.
        Das Spiel endet, wenn alle Checkboxen gecheckt sind.
        Je nach eingestellter Variante verliert oder gewinnt derjenige Spieler,
        der die letzte Checkbox gecheckt hat.`,
  currentVariant: () => "Aktuell gespielte Variante: ",
  lastWinsVariant: (lastWins) => (lastWins ? "Letzter Zug gewinnt." : "Letzter Zug verliert."),
  requestStart: () => "Bitte das Spiel mit dem Button Starten.",
  requestMove: () => `Bitte einen Zug machen mit 2 Klicks erst auf den Anfang, dann
                das Ende des zu streichenden Segments. - Und ja, es ist egal ob
                der Anfang links oder rechts ist. ;-)`,

  humansTurn: () => "Du bist dran.",
  humanNrsTurn: (player) => `Spieler ${player + 1} ist dran.`,
  hintClick1: () => "Bitte einen Zug machen mit 2 Klicks erst auf den Anfang, dann das Ende des zu streichenden Segments. - Und ja, es ist egal ob der Anfang links oder rechts ist. ;-)",
  hintClick2: () => "Bitte den Zug abschließen und auf das Ende des zu streichenden Segments klicken oder Klick zurücknehmen.",
  botsTurn: () => "Der Computer ist dran.",
  botNrsTurn: (player) => `Computer ${player + 1} ist dran.`,
  nrsMightWin: (player:number): string =>
    `Computer ${player + 1}: Könnte gut sein, dass ich diese Runde gewinne... ;-)`,
  mightWin: (): string => (
    "Computer: Könnte gut sein, dass ich diese Runde gewinne... ;-)"
  ),
  gameOver: () =>  "Spiel zuende.",
  humanNrsHasWon: (player:number): string =>
    `Spieler ${player + 1} hat gewonnen.`,
  humanHasWon: (): string => "Du hast gewonnen.",
  botHasWon: () => "Der Computer hat gewonnen.",
  botNrsHasWon: (player) => `Computer ${player + 1} hat gewonnen.`,

  congrats: () => "Herzlichen Glückwunsch!",
  congratsPlayer: (player: number): string =>
    `Herzlichen Glückwunsch, Spieler ${player + 1}!`,

  startGame: () => "Spiel starten",
  sideButtonLabel: (text, isMinified) => (isMinified ? `${text} ...` : text),
  tip: (idx) => `Tipp ${idx + 1}`,
  tip0: () => `Bei diesem Spiel existiert je nach Zeilenanzahl eine Gewinnstrategie für den
    anziehenden oder anderen Spieler.`,
  tip1: () => "XOR... ;-)",
  tip2: () => "Die Gewinnstrategie besteht darin, eine bestimmte Invariante im Zusammenhang mit der XOR-Summe über die Längen aller verbleibenden Segmente nach jedem eigenen Zug herzustellen. Die Frage ist nun welche... ;-)",
  tip3: () => "Für die Variante, in der der gewinnt, der das letzte Segment streicht, ist die Invariante XOR-Summe = 0. Für die andere Variante muss diese für bestimmte Situationen gegen Ende des Spiels angepasst werden.",
  tip4: (xor) => `${xor} ;-)`
}

export default Msg;
