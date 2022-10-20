export const clickRestart = () => {
    cy.get('[href="./"]').click()
} 

export const movePieceFromXtoY = ( start, finish ) => {

    // Function to more easly transalte grid locations (x,y)
    function flipRow(row) {
        return String(8 - row)
    }

    function flipColumn(column) {
        return String(column - 1)
    }
    let selectorStart = `[name="space${flipRow(start[0]) + flipColumn(start[1])}"]`
    let selectorFinish = `[name="space${flipRow(finish[0]) + flipColumn(finish[1])}"]`

    //click on the starting postion of the piece
    cy.get(selectorStart).click()
    //click on the ending postion of the piece and wait for the computer to move
    cy.get(selectorFinish).click().wait(4000)

    //validate that the piece moved (spaces from where pieces moved gain a new attribute)
    cy.get('[class="line"]').eq(8-start[1]).children('img').eq(start[0]-1)
        .invoke('attr', "src").then((src) => {
            //Checks that the piece moved or that the piece was captured
            if(src === "me1.gif") {
                cy.log("**Piece Lost**")
            }else{
                expect(src).to.include("https://www.gamesforthebrain.com/game/checkers/gray.gif")
            }
        })
}

export const validateLostPiece = ( row , column ) => {

    cy.get('[class="line"]').eq(8-column).children('img').eq(row-1)
        .invoke('attr', "src").then((src) => {
            //Checks that the piece moved or that the piece was captured
            expect(src).to.eq("me1.gif")
        })

}