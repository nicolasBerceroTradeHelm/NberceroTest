export const readId = (idValue) => {
    // This method reads the id that is saved on id.json
    cy.fixture('id').then((jsonID) => {
        var id = jsonID[idValue]
        cy.wrap(id).as('id')
    }) 
} 

export function stringify(obj) {
    //function to convert the object to a string
    return JSON.stringify(obj)
}

export function getCardsFromList(array) {
    //function to get the cards from the decks
    var cards = []
    for (var i = 0; i < array.length; i++) {
        cards.push(array[i].code)
    }
    return cards
}