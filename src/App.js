import React from 'react'
import './App.css'
// const initialState = {
//   word:
//     window.localStorage.getItem("word") == null
//       ? ""
//       : window.localStorage.getItem("word")
// };
let initialState = {
	Boards:
		window.localStorage.getItem('Boards') == null
			? [
					{
						title: 'Monte Cristo',
						cards: [{ task: 'default 1' }, { task: 'default 2' }],
						id: Date.now(),
						editing: false,
						task: '',
					},
			  ]
			: JSON.parse(window.localStorage.getItem('Boards')),
}
function boardReducer(state, action) {
	switch (action.type) {
		case 'TOGGLE': {
			const { title } = action
			let updated = state.Boards.map(b => {
				if (b.title === title) {
					return { ...b, editing: !b.editing }
				}
				return b
			})
			return { Boards: updated }
		}
		case 'ADD': {
			let board = {
				title: action.title,
				cards: [{ task: 'default 1' }, { task: 'default 2' }],
				id: Date.now(),
				editing: false,
				task: '',
			}
			return { ...state, Boards: [...state.Boards, board] }
		}
		case 'EDIT': {
			let card = state.Boards.find(b => b.title === action.title)
			let newB = { task: action.task }
			card.editing = false
			card.cards = [...card.cards, newB]
			let newBoards = state.Boards.map(b => {
				if (b.title === action.title) {
					return card
				}
				return b
			})
			card.task = ''
			return { ...state, Boards: newBoards }
		}
		case 'INPUT': {
			let card = state.Boards.find(b => b.title === action.title)
			card.task = action.e
			let newBoards = state.Boards.map(b => {
				if (b.title === action.title) {
					return card
				}
				return b
			})
			return { ...state, Boards: newBoards }
		}
		// eslint-disable-next-line no-fallthrough
		default: {
			throw new Error(`unsupported ${action.type}`)
		}
	}
}
function App() {
	const [boardTitle, setBoardTitle] = React.useState('')
	const [state, dispatch] = React.useReducer(boardReducer, initialState)
	React.useEffect(() => {
		localStorage.setItem('Boards', JSON.stringify(state.Boards))
	}, [state.Boards])
	return (
		<>
			<header className="header">
				<label htmlFor="boardTitle" />
				<input
					id="boardTitle"
					value={boardTitle}
					onChange={e => setBoardTitle(e.target.value)}
				/>
				<button onClick={() => dispatch({ type: 'ADD', title: boardTitle })}>
					ADD BOARD
				</button>
			</header>
			<div className="App">
				{state.Boards.map(b => (
					<Board b={b} dispatch={dispatch} />
				))}
			</div>
		</>
	)
}
function Board({ b: { title, task, editing, cards }, dispatch }) {
	return (
		<div className="board">
			<h2>{title}</h2>
			{cards.map(c => (
				<div>
					<p className="task" draggable={true}>
						{c.task}
					</p>
				</div>
			))}
			<div>
				{editing && (
					<>
						<label htmlFor="task" />
						<input
							type="text"
							placeholder="..."
							id="task"
							value={task}
							onChange={e =>
								dispatch({ type: 'INPUT', e: e.target.value, title })
							}
						/>
						<button onClick={() => dispatch({ type: 'EDIT', title, task })}>
							Add Task
						</button>
						<button onClick={() => dispatch({ type: 'TOGGLE', title })}>
							Cancel
						</button>
					</>
				)}
				<button
					disabled={editing}
					onClick={() => dispatch({ type: 'TOGGLE', title })}>
					{'✏️'}
				</button>
			</div>
		</div>
	)
}
export default App
