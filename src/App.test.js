import { queryAllByRole, render, screen, within, act, fireEvent } from '@testing-library/react';
// import {act, Simulate} from 'react-dom/test-utils'; // ES6
// import ReactTestUtils from 'react-dom/test-utils'; // ES6
import userEvent from '@testing-library/user-event'
import {isInaccessable, logRoles} from '@testing-library/dom'
import App from './App';
import Msg from './components/Msg'


// Hilfsfunktionen fuer die Tests

const firstInRow = (row) => {
  return row * (row + 1) / 2;
}

const enterSettings = () => {
  return userEvent.click(screen.getByText(Msg.sideButtonLabel(Msg.settings(), true)));
}

const sleep = (ms) => {
  return new Promise(resolve => setTimeout(resolve, ms));
}

 const actSleep = (ms) => {
  return act(() => {
    return sleep(ms);
  })
}
const typeNumRows = async (n) => {
  await userEvent.type(screen.getByLabelText(Msg.numRows()), "{backspace}" + n);
}

const clickStart = async () => {
  await userEvent.click(screen.getByText(Msg.startGame()));
}

const clickBotPlaying = async (player) => {
  await userEvent.click(screen.getByLabelText(Msg.botPlaying(player)));
}

const allBoxes = () => {
  const board = screen.getByTestId("board");
  return queryAllByRole(board, "checkbox");
}

const nextNonAutoStyle = (el, name) => {
  // console.log("nextNonAutoStyle: name=", name);
  if (el == null) return null;
  const st = getComputedStyle(el);
  // console.log("el", el, "st", st);
  // console.log("name", name);
  const val = st.getPropertyValue(name);
  console.log("el", el.tagName);
  console.log("st", st);
  console.log("val", val);
  if (val != null && val !== "auto" && val !== "") {
    return val;
  }

  return nextNonAutoStyle(el.parentElement, name);
}

const simClickBox = (idx) => {
  return userEvent.click(queryAllByRole(screen.getByTestId("board"), "checkbox")[idx]);
}

// first und last sind 0-basierte Indizes in die Liste aller Checkboxen innerhalb des Boards
const simHumanMove = async (first, last) => {
  console.log("first", first, "last", last);
  await simClickBox(first);
  await actSleep(1);
  await simClickBox(last);
}


describe("App", () => {
  beforeEach(() => {
    console.log("App.beforeEach");
    // Funktioniert leider nicht richtig im Zusammenhang mit asynchronen Testfunktionen:
    // jest.useFakeTimers()
    // return render(<App/>);
    render(<App/>);

  })
  describe("when editing settings", () => {
    beforeEach(async () => {
      console.log("when editing settings - beforeEach");
      await enterSettings();
    })
    it("lets users set number of rows", async () => {
      // enterSettings();
      expect(screen.queryByText(Msg.sideButtonLabel(Msg.settings(), false))).toBeInTheDocument(); // ansonsten sind Einstellungen hidden; das ist ja leider bei vererbung nicht mit toBeVisible() testbar! - entweder bug oder feature ;-)
      const zeilenElem = screen.getByLabelText(Msg.numRows());
      expect(screen.getByLabelText(Msg.numRows())).toBeVisible();
      expect(screen.getByLabelText(Msg.numRows())).toBeInTheDocument();
      typeNumRows(7);
      expect(screen.getByLabelText(Msg.numRows())).toHaveValue(7)
    });

    it("lets users set if player 1 is a bot", async () => {
      // screen.debug();
      expect(screen.queryByText(Msg.sideButtonLabel(Msg.settings(), false)))
      .toBeInTheDocument(); // ansonsten sind Einstellungen hidden; das ist ja leider bei vererbung nicht mit toBeVisible() testbar! - entweder bug oder feature ;-)
      expect(screen.getByLabelText(Msg.botPlaying(0)))
      .not.toBeChecked();
      await clickBotPlaying(0);
      // await userEvent.click(screen.getByLabelText(Msg.botPlaying(0)));
      expect(screen.getByLabelText(Msg.botPlaying(0))).toBeChecked();
    })

    it("lets users set if player 2 is a bot", async () => {
      expect(screen.getByLabelText(Msg.botPlaying(1))).toBeChecked();
      await userEvent.click(screen.getByLabelText(Msg.botPlaying(1)));
      expect(screen.getByLabelText(Msg.botPlaying(1))).not.toBeChecked();
    });

  })

  it(
    "wenn gerade kein Spiel laeuft und in den Einstellungen 6 als Anzahl der " +
    "Zeilen eingegeben wird ist bei beliebigen anderen Einstellungen eine " +
    "Sekunde spaeter die Anzahl der Checkboxen im Brett (6 * 7 / 2 = 21)", async () => {

    expect(screen.queryByText(Msg.sideButtonLabel(Msg.settings(), true))).toBeInTheDocument();
    await enterSettings();

    // ansonsten sind Einstellungen hidden; das ist ja leider bei vererbung nicht mit toBeVisible() testbar! - entweder bug oder feature ;-)
    expect(screen.queryByText(Msg.sideButtonLabel(Msg.settings(), false))).toBeInTheDocument();
    typeNumRows(6);
    expect(screen.getByLabelText(Msg.numRows())).toHaveValue(6);
    await actSleep(1000);
    expect(allBoxes()).toHaveLength(6 * 7 / 2);
  })

  it("lets users start a new game with previously selected settings",
  async () => {
    await clickStart();
    expect(allBoxes()).toHaveLength(5 * 6 / 2);

    expect(screen.queryByText(Msg.sideButtonLabel(Msg.settings(), true))).toBeInTheDocument();
    await enterSettings();

    await typeNumRows(6);
    await actSleep(1000);
    expect(screen.getByLabelText(Msg.numRows())).toHaveValue(6);
    await userEvent.click(screen.getByLabelText(Msg.botPlaying(0))) // toggle from bot off to bot on
    await userEvent.click(screen.getByLabelText(Msg.botPlaying(1))) // toggle from bot on to bot off

    await clickStart();
    expect(await screen.findByText(Msg.botsTurn())).toBeInTheDocument();
    expect(allBoxes()).toHaveLength(6 * 7 / 2);

    await userEvent.type(screen.getByLabelText(Msg.numRows()), "{backspace}7");
    expect(screen.getByLabelText(Msg.numRows())).toHaveValue(7);
    await userEvent.click(screen.getByLabelText(Msg.botPlaying(0))) // toggle from bot on to bot off

    await userEvent.click(screen.getByText(/start/i));
    expect(await screen.findByText(Msg.humanNrsTurn(0))).toBeInTheDocument();
    {
      const allCheckboxes = allBoxes();
      expect(allCheckboxes).toHaveLength(7 * 8 / 2);
      await simHumanMove(0, 0);
      // await userEvent.click(allCheckboxes[0]); // Anfang des Bereichs (Zug des Spielers 1 (bzw. intern 0) beginnt)
      // await userEvent.click(allCheckboxes[0]); // Ende des Bereichs, damit Zug des ersten Spielers zuende
      expect(await screen.findByText(Msg.humanNrsTurn(1))).toBeInTheDocument();
    }

    await userEvent.click(screen.getByLabelText(Msg.botPlaying(0))); // Bot[0] aktiv
    await userEvent.click(screen.getByLabelText(Msg.botPlaying(1))); // Bot[1] aktiv

    clickStart();
    // await userEvent.click(screen.getByText(/start/i));
    expect(await screen.findByText(Msg.botNrsTurn(0))).toBeInTheDocument();

    // throw Error("nyi");
  });

  it("shows the not-allowed cursor on checked segments", async () => {
    await enterSettings();
    await userEvent.click(screen.getByLabelText(Msg.botPlaying(1)));
    await clickStart();

    {
      const allCheckboxes = allBoxes();
      expect(allCheckboxes).toHaveLength(5 * 6 / 2);
      expect(allCheckboxes[0].parentNode.parentNode).toHaveClass("allowed");
      await simHumanMove(0, 0);
      await act(async () => {
        await userEvent.click(allCheckboxes[0]); // Beginn des Zugs
        await userEvent.click(allCheckboxes[0]); // Ende des Zugs
      });
    }


    {
      const board = screen.getByTestId("board");
      const allCheckboxes = allBoxes()
      expect(allCheckboxes[0]).toBeChecked();
      expect(allCheckboxes[0].parentNode.parentNode).toHaveClass("not-allowed");
      expect(allCheckboxes[1]).not.toBeChecked();
      expect(allCheckboxes[1].parentNode.parentNode).toHaveClass("allowed");
    }

  });

  describe("when it's a human player's turn", () => {

    beforeEach(async () => {
      console.log("when it's a human player's turn - beforeEach");
      await userEvent.click(screen.getByText(Msg.startGame()));

      // Bei Default-Einstellungen nach Start gleich der Mensch dran

    })

    describe("when a human move has been started, but not finished", () => {

      beforeEach(async () => {
        const board = screen.getByTestId("board");
        expect(board).toBeInTheDocument();
        const allCheckboxes = queryAllByRole(board, "checkbox");

        allCheckboxes.forEach((cb, i) => {
          const segment = cb.parentNode.parentNode; // touche, ein bisschen unschoen implementierungsabhaengig, aber die Zeit draengt ;-)
          expect(segment).toHaveClass("allowed");
        });

        // Nun Zug Beginnen mit Klick auf 1. Checkbox in der 2. Zeile (mit Segment der Laenge 2)
        // Und pruefen ob danach nur noch Checkboxen in diesem Segment "allowed" und alle anderen "not-allowed" sind.

        const firstInSeg = 1;
        const lastInSeg = 2;
        await userEvent.click(allCheckboxes[1]);
      })

      it(
        "shows the pointer cursor on unchecked segments until a " +
        "box in an unchecked segment is clicked and selected as start of the range to be checked", () => {

        const board = screen.getByTestId("board");
        expect(board).toBeInTheDocument();
        const allCheckboxes = queryAllByRole(board, "checkbox");
        const firstInSeg = 1;
        const lastInSeg = 2;

        allCheckboxes.forEach((cb, i) => {
          const seg = cb.parentNode.parentNode;
          if (i >= firstInSeg && i <= lastInSeg) {
            expect(seg).toHaveClass("allowed");
          } else {
            expect(seg).toHaveClass("not-allowed");
          }
        });


      });

      it("highlights the segment containing the start checkbox", () => {
        const board = screen.getByTestId("board");
        expect(board).toBeInTheDocument();
        const allCheckboxes = queryAllByRole(board, "checkbox");
        const firstInSeg = 1;
        const lastInSeg = 2;

        allCheckboxes.forEach((cb, i) => {
          const seg = cb.parentNode.parentNode;
          if (i >= firstInSeg && i <= lastInSeg) {
            expect(seg).toHaveClass("highlight");
          } else {
            expect(seg).not.toHaveClass("highlight");
          }
        });
      })

    })

  })


  it("highlights the changed segment (and only that) during a bot move", async () => {
    await userEvent.click(screen.getByText(Msg.startGame()));
    const humanFirst = 1, humanLast = 2;
    await simHumanMove(humanFirst, humanLast);
    expect(await screen.findByText(Msg.botsTurn())).toBeInTheDocument();

    // Suche eine Checkbox, die der Bot markiert hat und pruefe ob das Segment,
    // zu dem sie gehoert, die class "highlight" besitzt und die anderen Segmente
    // nicht
    let botSeg = null;
    const board = screen.getByTestId("board");
    const allCheckboxes = queryAllByRole(board, "checkbox");

    allCheckboxes.forEach((cb, i) => {
      if (i < humanFirst || i > humanLast) {
        if (botSeg == null) {
          if (cb.checked) {
            botSeg = cb.parentNode.parentNode;
          }
        }
      }
    });

    expect(botSeg).not.toBeNull();

    allCheckboxes.forEach((cb, i) => {
      const seg = cb.parentNode.parentNode;
      if (seg === botSeg) {
        expect(seg).toHaveClass("highlight");
      } else {
        console.log("i", i);
        expect(seg).not.toHaveClass("highlight");
      }
    });
  });



  it("shows game over message after a game", async () => {
    await enterSettings();
    await typeNumRows(1);
    clickStart();
    await simHumanMove(0, 0);
    expect(await screen.getByText(Msg.gameOver())).toBeInTheDocument();

  });

  describe("when game is over and human has won", () => {
    beforeEach(() => {
      enterSettings();
    })
    it("shows trophy", async () => {
      throw Error("nyi")
    })
    it("when 2 human players, shows player index", async () => {
      throw Error("nyi")
    })
    it("when 1 human player, shows no player index", async() => {
      throw Error("nyi")
    })
  })

  it.only("shows youHaveWon() when human is first player and has won against bot when last loses", async () => {
    await enterSettings();
    await typeNumRows(2);
    clickStart();
    simHumanMove(1, 2);
    simHumanMove(0, 0);
    expect(screen.findByText(Msg.youHaveWon())).toBeInTheDocument();
  });

  it("shows humanHasWon() when human is first player and has won against bot when last wins", async () => {
    throw Error("nyi")
  })

  it("shows humanHasWon() when human is second player and has won against bot when last loses", async() => {
    throw Error("nyi");
  })

  it("shows humanHasWon() when human is second player and has won against bot when last wins", async() => {
    throw Error("nyi");
  })

  it("shows humanNrsHasWon(0) when both players are human and first player has won when last loses", async() => {
    throw Error("nyi");
  });

  it("shows humanNrsHasWon(0) when both players are human and first player has won when last wins", async() => {
    throw Error("nyi");
  })

  it("shows humanNrsHasWon(1) when both players are human and second player has won when last loses", async() => {
    throw Error("nyi")
  })

  it("shows humanNrsHasWon(1) when both players are human and second player has won when last wins", async() => {
    throw Error("nyi")
  })


});
