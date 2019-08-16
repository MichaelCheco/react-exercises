import React from 'react'
import './App.css'
import {
	Menu,
	MenuList,
	MenuButton,
	MenuItem,
	MenuLink,
} from '@reach/menu-button'
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
		case 'MOVE': {
			// remove from current board
			let boardToRemove = state.Boards.find(b => b.title === action.title)
			let adding
			boardToRemove.cards.forEach((c, i) => {
				if (c.task === action.task) {
					adding = c
				}
			})

			let filtered = boardToRemove.cards.filter(c => c.task !== action.task)
			boardToRemove.cards = filtered
			// add to new board
			let boardToAdd = state.Boards.find(b => b.id === action.id)
			boardToAdd.cards = [...boardToAdd.cards, adding]
			let final = state.Boards.map(b => {
				if (b.title === action.title) {
					return boardToRemove
				} else if (b.id === action.id) {
					return boardToAdd
				} else {
					return b
				}
			})
			return { ...state, Boards: final }
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
	const moveItem = (id, task, title) => {
		dispatch({ type: 'MOVE', id, task, title })
	}
	return (
		<>
			<header className="header">
				<div className="add">
					<label htmlFor="boardTitle" />
					<input
						id="boardTitle"
						value={boardTitle}
						onChange={e => setBoardTitle(e.target.value)}
					/>
					<button onClick={() => dispatch({ type: 'ADD', title: boardTitle })}>
						ADD BOARD
					</button>
				</div>
			</header>
			<div className="App">
				{state.Boards.map((b, i) => (
					<Board
						b={b}
						dispatch={dispatch}
						key={i}
						boards={state}
						moveItem={moveItem}
					/>
				))}
			</div>
		</>
	)
}
function Board({
	b: { title, task, editing, cards },
	dispatch,
	boards,
	moveItem,
}) {
	return (
		<div className="board">
			<h2>{title}</h2>
			{cards.map((c, i) => (
				<div key={i}>
					<Menu>
						<MenuButton>{c.task}</MenuButton>
						<MenuList>
							{boards.Boards.map(board => {
								return (
									<MenuItem onSelect={() => moveItem(board.id, c.task, title)}>
										{board.title}
									</MenuItem>
								)
							})}
						</MenuList>
					</Menu>
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
						<span onClick={() => dispatch({ type: 'EDIT', title, task })}>
							{'✅'}
						</span>
						<span onClick={() => dispatch({ type: 'TOGGLE', title })}>
							Cancel
						</span>
					</>
				)}
				<div
					disabled={editing}
					onClick={() => dispatch({ type: 'TOGGLE', title })}>
					{'➕'}
				</div>
			</div>
		</div>
	)
}
export default App
