import * as functions from "../fixtures/functions.js";

describe('API', () => {

	before(() => {
		// Creates a new id to be used during the whole run.
		const filename = 'cypress/fixtures/id.json'

		cy.request('https://deckofcardsapi.com/api/deck/new/shuffle/?deck_count=1').then((response) => {
			cy.wrap(response.body.deck_id).as('deckId')
		})

		cy.readFile(filename).then((JsonText) => {

			cy.get('@deckId').then((deckId) => {
				cy.log(deckId)
				JsonText.id = deckId
				// write the deck id for the run
				cy.writeFile(filename, JSON.stringify(JsonText))
			})
		})

	})

	beforeEach(() => {
		functions.readId('id')
	})

	it('Create a deck', () => {
		//In this test I just create e new deck separated from the one created on "before" Section

		cy.request('https://deckofcardsapi.com/api/deck/new/shuffle/?deck_count=1').then((response) => {
			cy.request('https://deckofcardsapi.com/api/deck/new/shuffle/?deck_count=1').then((response) => {
			expect(response.status).to.eq(200)
			expect(response.body).to.have.property('success', true)
			expect(response.body).to.have.property('deck_id')
			expect(response.body).to.have.property('shuffled', true)
			expect(response.body).to.have.property('remaining', 52)
			let id = response.body.deck_id

			let JSONValidation = {"success":true,"deck_id":id,"remaining":52,"shuffled":true}
			expect(response.body).to.deep.equal(JSONValidation)

			cy.wrap(response).as('deckTest')
		})

		cy.get('@deckTest').then((deckTest) => {
			let deckJson = functions.stringify(deckTest.body)
			cy.log(deckJson)
		})
		})
	})

	it('Shuffle the deck', () => {
		// In this test i grab the id from the before and use it to shuffle the deck
		cy.get('@id').then((id) => {

			cy.request('https://deckofcardsapi.com/api/deck/' + id + '/shuffle/').then((response) => {
				expect(response.status).to.eq(200)
				expect(response.body).to.have.property('success', true)
				expect(response.body).to.have.property('deck_id', id)
				expect(response.body).to.have.property('shuffled', true)
			})
		})

	})

	it('Draw 3 cards from deck', () => {
		// In this test I grab the id from the before and use it to draw 3 cards from the deck
		cy.get('@id').then((id) => {
			cy.request('https://deckofcardsapi.com/api/deck/' + id + '/draw/?count=3').then((response) => {
				expect(response.status).to.eq(200)
				expect(response.body).to.have.property('success', true)
				expect(response.body).to.have.property('deck_id', id)
				expect(response.body).to.have.property('remaining', 49)
				expect(response.body.cards).to.have.length(3)
			})
		})
	})

	it('Make 2 piles with 5 cards each from deck', () => {

		cy.get('@id').then((id) => {

			function stringify(obj) {
				//function to convert the object to a string
				return JSON.stringify(obj)
			}

			function getCardsFromList(array) {
				//function to get the cards from the decks
				var cards = []
				for (var i = 0; i < array.length; i++) {
					cards.push(array[i].code)
				}
				return cards
			}

			cy.request('https://deckofcardsapi.com/api/deck/' + id + '/draw/?count=5').then((response) => {
				// draw 5 cards to form deck 1
				expect(response.status).to.eq(200)
				expect(response.body).to.have.property('success', true)
				expect(response.body).to.have.property('deck_id', id)
				expect(response.body).to.have.property('remaining', 44)
				expect(response.body.cards).to.have.length(5)

				cy.wrap(response.body.cards).as('cards1')
			})

			cy.request('https://deckofcardsapi.com/api/deck/' + id + '/draw/?count=5').then((response) => {
				// draw 5 cards to form deck 2
				expect(response.status).to.eq(200)
				expect(response.body).to.have.property('success', true)
				expect(response.body).to.have.property('deck_id', id)
				expect(response.body).to.have.property('remaining', 39)
				expect(response.body.cards).to.have.length(5)

				cy.wrap(response.body.cards).as('cards2')
			})

			cy.get('@cards1').then((cards1) => {
				cy.get('@cards2').then((cards2) => {
					// create the 2 lists with the cards from the 2 decks
					cy.log(stringify(getCardsFromList(cards1)))
					cy.log(stringify(getCardsFromList(cards2)))
				})
			})

			//Shuffle deck 1
			cy.get('@cards1').then((cards1) => {
				cy.request('https://deckofcardsapi.com/api/deck/new/shuffle/?cards=' + getCardsFromList(cards1)).then((response1) => {
					expect(response1.status).to.eq(200)
					expect(response1.body).to.have.property('success', true)
					expect(response1.body).to.have.property('deck_id')
					expect(response1.body).to.have.property('shuffled', true)
					expect(response1.body).to.have.property('remaining', 5)

					//Draw 2 cards from deck 1
					cy.request('https://deckofcardsapi.com/api/deck/' + response1.body.deck_id + '/draw/?count=2').then((response2) => {
						expect(response2.status).to.eq(200)
						expect(response2.body).to.have.property('success', true)
						expect(response2.body).to.have.property('deck_id', response1.body.deck_id)
						expect(response2.body).to.have.property('remaining', 3)
						expect(response2.body.cards).to.have.length(2)

						//List the 2 cards drawn from deck 1
						cy.log(stringify(getCardsFromList(response2.body.cards)))
					})
				})
			})

			//Draw 3 cards from deck 2
			cy.get('@cards2').then((cards2) => {
				cy.request('https://deckofcardsapi.com/api/deck/new/shuffle/?cards=' + getCardsFromList(cards2)).then((response3) => {
					expect(response3.status).to.eq(200)
					expect(response3.body).to.have.property('success', true)
					expect(response3.body).to.have.property('deck_id')
					expect(response3.body).to.have.property('shuffled', true)
					expect(response3.body).to.have.property('remaining', 5)

					//Draw 3 cards from deck 2
					cy.request('https://deckofcardsapi.com/api/deck/' + response3.body.deck_id + '/draw/?count=3').then((response4) => {
						expect(response4.status).to.eq(200)
						expect(response4.body).to.have.property('success', true)
						expect(response4.body).to.have.property('deck_id', response3.body.deck_id)
						expect(response4.body).to.have.property('remaining', 2)
						expect(response4.body.cards).to.have.length(3)

						//List the 3 cards drawn from deck 2
						cy.log(stringify(getCardsFromList(response4.body.cards)))
					})
				})
			})
		})
	})
})
