window.FocusPrompts = window.FocusPrompts || {};

window.FocusPrompts.TicTacToe = {
    id: "TicTacToe",
    name: "Tic-Tac-Toe",
    icon: "❌⭕",
    
    render: () => {
        const box = document.getElementById('insta-focus-box');
        let board = ["", "", "", "", "", "", "", "", ""];
        let gameActive = true;

        // Render the HTML structure
        box.innerHTML = `
            <h2>Beat the AI</h2>
            <p>Win against the computer to unlock.</p>
            <div id="ttt-board"></div>
            <p id="ttt-status">Your Turn (X)</p>
            <button id="insta-focus-btn" style="display:none; margin-top:10px;">Continue</button>
        `;

        const boardEl = document.getElementById('ttt-board');
        const statusEl = document.getElementById('ttt-status');

        // Helper: Draw the board based on the array
        const renderBoard = () => {
            boardEl.innerHTML = '';
            board.forEach((cell, idx) => {
                const div = document.createElement('div');
                div.className = 'ttt-cell';
                if (cell === 'X') div.classList.add('x-move');
                if (cell === 'O') div.classList.add('o-move');
                div.innerText = cell;
                div.onclick = () => playerMove(idx);
                boardEl.appendChild(div);
            });
        };

        // 1. Player Move
        const playerMove = (idx) => {
            if (board[idx] !== "" || !gameActive) return;
            
            board[idx] = "X";
            renderBoard();

            if (checkWin("X")) {
                gameWin();
                return;
            }
            
            if (!board.includes("")) {
                statusEl.innerText = "Draw! Resetting...";
                setTimeout(resetGame, 1500);
                return;
            }

            statusEl.innerText = "AI is thinking...";
            gameActive = false; // Block clicks
            setTimeout(aiMove, 600); // Small delay for realism
        };

        // 2. AI Move (Simple Random)
        const aiMove = () => {
            let emptyIndices = board.map((v, i) => v === "" ? i : null).filter(v => v !== null);
            
            if (emptyIndices.length > 0) {
                // Pick random empty spot
                const randomIdx = emptyIndices[Math.floor(Math.random() * emptyIndices.length)];
                board[randomIdx] = "O";
                renderBoard();

                if (checkWin("O")) {
                    statusEl.innerText = "AI Won! Try again.";
                    gameActive = false;
                    setTimeout(resetGame, 1500);
                } else {
                    statusEl.innerText = "Your Turn (X)";
                    gameActive = true;
                }
            }
        };

        // 3. Win Logic
        const checkWin = (player) => {
            const wins = [
                [0,1,2],[3,4,5],[6,7,8], // Rows
                [0,3,6],[1,4,7],[2,5,8], // Cols
                [0,4,8],[2,4,6]          // Diagonals
            ];
            return wins.some(combo => 
                board[combo[0]] === player && 
                board[combo[1]] === player && 
                board[combo[2]] === player
            );
        };

        const gameWin = () => {
            statusEl.innerText = "You Won!";
            statusEl.style.color = "#4caf50";
            gameActive = false;
            // Unlock immediately or show button
            setTimeout(() => {
                window.FocusUI.unlock();
            }, 1000);
        };

        const resetGame = () => {
            board = ["", "", "", "", "", "", "", "", ""];
            gameActive = true;
            statusEl.innerText = "Your Turn (X)";
            statusEl.style.color = "white";
            renderBoard();
        };

        // Start
        renderBoard();
    }
};