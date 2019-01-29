/* eslint-disable func-style */
/* eslint-disable require-jsdoc */
/* eslint-disable capitalized-comments */
/* eslint-disable max-statements */
/* eslint-disable no-console */
// TODO: 
//   add multiple API fetches for long lists
// Ignore basic lands
// Add link to scryfall page
// Warn if card isn't commander legal
// Total prices and add to category headers
javascript: (function () {
    const card_list = document.querySelectorAll('.cardlink');
    const scryfall_bulk = "https://api.scryfall.com/cards/collection";
    const SCRYFALL_MAX_CARDS = 75
    let total_price = 0.0;
    let cards = {};
    card_list.forEach((card) => {
        cards[card.text] = card;
    });
    function chunkArray(myArray, chunk_size) {
        let results = [];
        while (myArray.length) {
            results.push(myArray.splice(0, chunk_size))
        }

        return results;
    }
    function buildRequest(cards) {
        return fetch(scryfall_bulk, {
            "body": JSON.stringify({"identifiers": cards}),
            "headers": {"Content-Type": "application/json"},
            "method": "POST"
        }).then((resp) => resp.json())
    }

    function updatePage(response) {
        response.data.forEach((card_info) => {
            let name = card_info.name;
            if (name.search('//') != -1) {
                name = name.slice(0, name.search('//') - 1);
            }
            let price = parseFloat(card_info.usd);
            cards[name].innerText = `${name} ($${price})`;
            if (!isNaN(price)) {
                total_price += price;
            }
        })
        console.log(response);
        console.log(`Total price: ${total_price}`);
        // alert("Total Price: (assuming one of each) " + total_price.toString());
    }

    let getValues = function (card_names) {
        let body = [];
        for (const name of card_names) {
            body.push({"name": name});
        }
        let requests = chunkArray(body, SCRYFALL_MAX_CARDS)
        // Promise.all(requests.map(buildRequest)
        //     .then(updatePage)
        // )
        Promise.all(requests.map(data =>
            buildRequest(data)
                .then(updatePage)
        ))

    }
    getValues(Object.keys(cards));
})();