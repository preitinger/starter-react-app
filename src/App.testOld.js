import { render, screen, within } from '@testing-library/react';
// import {act, Simulate} from 'react-dom/test-utils'; // ES6
// import ReactTestUtils from 'react-dom/test-utils'; // ES6
import userEvent from '@testing-library/user-event'
import App from './App';

function firstInRow(row) {
  return row * (row + 1) / 2;
}


describe('App', () => {
  it('just renders <App/>', () => {
    render(<App />);

    screen.debug();
  }),

  it('creates 5 rows with each 1 segment of lengths 1 through 5', () => {
    render(<App />);
    console.log('nach render App');
    // screen.getByRole("textbox")
    const board = screen.getByTestId('board') // auf board einschraenken, da auch in settingsview ggf. checkboxen sind
    const allCheckboxes = within(board).getAllByRole('checkbox')
    expect(allCheckboxes).toHaveLength(5 * 6 / 2)

    for (let rowIdx = 0; rowIdx < 5; ++rowIdx) {
      const firstInRow = rowIdx * (rowIdx + 1) / 2;
      const parent = allCheckboxes[firstInRow].parentNode
      for (let j = 0; j < firstInRow; ++j) {
        expect(parent).not.toContainElement(allCheckboxes[j]);
      }
      for (let j = firstInRow; j <= firstInRow + rowIdx; ++j) {
        expect(parent).toContainElement(allCheckboxes[j])
      }
      for (let j = firstInRow + rowIdx + 1; j < allCheckboxes.length; ++j) {
        expect(parent).not.toContainElement(allCheckboxes[j])
      }
    }
  }),

  it('lets user check segment parts', () => {
    render(<App />)
    let board = screen.getByTestId('board');
    let allCheckboxes = within(board).getAllByRole('checkbox');

    // in 3. Zeile mittleres Kaestchen streichen, so dass in Zeile
    // 3 dann 3 Segmente jeweils der Laenge 1 enthalten sind, wobei das mittlere gecheckt ist

    const first = firstInRow(2)
    userEvent.click(allCheckboxes[first + 1]);
    board = screen.getByTestId('board');
    allCheckboxes = within(board).getAllByRole('checkbox');
    expect(allCheckboxes[first]).not.toBeChecked();
    expect(allCheckboxes[first + 1]).toBeChecked();
    expect(allCheckboxes[first + 2]).not.toBeChecked();

    userEvent.hover(allCheckboxes[first + 2]);
    board = screen.getByTestId('board');
    allCheckboxes = within(board).getAllByRole('checkbox');
    // nach maus ueber kaestchen ganz rechts in zeile 3 muss mittleres und rechts gecheckt sein
    expect(allCheckboxes[first]).not.toBeChecked();
    expect(allCheckboxes[first + 1]).toBeChecked();
    expect(allCheckboxes[first + 2]).toBeChecked();

    userEvent.hover(allCheckboxes[first]);
    board = screen.getByTestId('board');
    allCheckboxes = within(board).getAllByRole('checkbox');
    // nach maus ueber kaestchen ganz links in zeile 3 muss linkes und mittleres gecheckt sein
    expect(allCheckboxes[first]).toBeChecked();
    expect(allCheckboxes[first + 1]).toBeChecked();
    expect(allCheckboxes[first + 2]).not.toBeChecked();

    userEvent.click(allCheckboxes[first + 2]);
    board = screen.getByTestId('board');
    allCheckboxes = within(board).getAllByRole('checkbox');
    // nach Klick auf das rechte muss mittleres und rechts gecheckt eingefroren sein
    expect(allCheckboxes[first]).not.toBeChecked();
    expect(allCheckboxes[first + 1]).toBeChecked();
    expect(allCheckboxes[first + 2]).toBeChecked();

  })
});
