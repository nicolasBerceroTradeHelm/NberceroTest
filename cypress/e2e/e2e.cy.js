import * as checkers from "../fixtures/checkers.js";

describe('E2E', () => {
    it('Checkers', () => {
        cy.visit('https://www.gamesforthebrain.com/game/checkers/')
        //Restart the game
        checkers.clickRestart()

        //Make 1st move
        // type Row(left to right) then Column (bottom to top)
        checkers.movePieceFromXtoY([4,3],[5,4])

        //Make 2nd move
        checkers.movePieceFromXtoY([6,3],[7,4])

        //Checks if there is a enemy piece on the space
        checkers.validateLostPiece(6,3)

        //Start a new game
        checkers.clickRestart()


    })

})