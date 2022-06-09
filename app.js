/*
    Author: devCodeCamp
    Description: Most Wanted Starter Code
*/
//////////////////////////////////////////* Beginning Of Starter Code *//////////////////////////////////////////

"use strict";
//? Utilize the hotkey to hide block level comment documentation
////* Mac: Press "CMD"+"K" and then "CMD"+"/"
////* PC: Press "CTRL"+"K" and then "CTRL"+"/"

/**
 * This is the main logic function being called in index.html.
 * It operates as the entry point for our entire application and allows
 * our user to decide whether to search by name or by traits.
 * @param {Array} people        A collection of person objects.
 */
function app(people) {
    // promptFor() is a custom function defined below that helps us prompt and validate input more easily
    // Note that we are chaining the .toLowerCase() immediately after the promptFor returns its value
    let searchType = promptFor(
        "Do you know the name of the person you are looking for? Enter 'yes' or 'no'",
        yesNo
    ).toLowerCase();
    let searchResults;
    // Routes our application based on the user's input
    switch (searchType) {
        case "yes":
            searchResults = searchByName(people);
            break;
        case "no":
            //! TODO #4: Declare a searchByTraits (multiple traits) function //////////////////////////////////////////
            //! TODO #4a: Provide option to search for single or multiple //////////////////////////////////////////
            searchResults = searchByTraits(people);
            break;
        default:
            // Re-initializes the app() if neither case was hit above. This is an instance of recursion.
            app(people);
            break;
    }
    // Calls the mainMenu() only AFTER we find the SINGLE PERSON
    mainMenu(searchResults, people);
}
// End of app()

/**
 * After finding a single person, we pass in the entire person-object that we found,
 * as well as the entire original dataset of people. We need people in order to find
 * descendants and other information that the user may want.
 * @param {Object[]} person     A singular object inside of an array.
 * @param {Array} people        A collection of person objects.
 * @returns {String}            The valid string input retrieved from the user.
 */
function mainMenu(person, people) {
    // A check to verify a person was found via searchByName() or searchByTrait()
    if (!person[0]) {
        alert("Could not find that individual.");
        // Restarts app() from the very beginning
        return app(people);
    }
    let displayOption = prompt(
        `Found ${person[0].firstName} ${person[0].lastName}. Do you want to know their 'info', 'family', or 'descendants'?\nType the option you want or type 'restart' or 'quit'.`
    );
    // Routes our application based on the user's input
    switch (displayOption) {
        case "info":
            let personInfo = displayPerson(person[0]);
            alert(personInfo);
            break;
        case "family":
            //! TODO #2: Declare a findPersonFamily function //////////////////////////////////////////
            // HINT: Look for a people-collection stringifier utility function to help
            let personFamily = findPersonFamily(person[0], people);
            displayPeople(personFamily);
            break;
        case "descendants":
            //! TODO #3: Declare a findPersonDescendants function //////////////////////////////////////////
            // HINT: Review recursion lecture + demo for bonus user story
            let personDescendants = findPersonDescendants(person[0], people);
            alert(personDescendants);
            break;
        case "restart":
            // Restart app() from the very beginning
            app(people);
            break;
        case "quit":
            // Stop application execution
            return;
        case "test":
            let results = findPersonFamily(person[0], people);
            displayPeople(results);
            break;
        default:
            // Prompt user again. Another instance of recursion
            return mainMenu(person, people);
    }
}
// End of mainMenu()

/**
 * This function is used when searching the people collection by
 * a person-object's firstName and lastName properties.
 * @param {Array} people        A collection of person objects.
 * @returns {Array}             An array containing the person-object (or empty array if no match)
 */
function searchByName(people) {
    let firstName = promptFor("What is the person's first name?", chars);
    let lastName = promptFor("What is the person's last name?", chars);

    // The foundPerson value will be of type Array. Recall that .filter() ALWAYS returns an array.
    let foundPerson = people.filter(function (person) {
        if (person.firstName === firstName && person.lastName === lastName) {
            return true;
        }
    });
    return foundPerson;
}
// End of searchByName()

/**
 * This function will be useful for STRINGIFYING a collection of person-objects
 * first and last name properties in order to easily send the information
 * to the user in the form of an alert().
 * @param {Array} people        A collection of person objects.
 */
function displayPeople(people) {
    alert(
        people
            .map(function (person) {
                return `${person.firstName} ${person.lastName}`;
            })
            .join("\n")
    );
}
// End of displayPeople()

/**
 * This function will be useful for STRINGIFYING a person-object's properties
 * in order to easily send the information to the user in the form of an alert().
 * @param {Object} person       A singular object.
 * @returns {string}            A string of person's information.
 */
function displayPerson(person) {
    let personInfo = "";
    for (let property in person) {
        if (property === "parents" || property === "currentSpouse") {
            continue;
        }
        personInfo += `${property}: ${person[property]}\n`;
    }
    // let personInfo = `First Name: ${person.firstName}\n`;
    // personInfo += `Last Name: ${person.lastName}\n`;
    return personInfo;
}
// End of displayPerson()

/**
 * This function's purpose is twofold:
 * First, to generate a prompt with the value passed in to the question parameter.
 * Second, to ensure the user input response has been validated.
 * @param {String} question     A string that will be passed into prompt().
 * @param {Function} valid      A callback function used to validate basic user input.
 * @returns {String}            The valid string input retrieved from the user.
 */
function promptFor(question, valid) {
    do {
        var response = prompt(question).trim();
    } while (!response || !valid(response));
    return response;
}
// End of promptFor()

/**
 * This helper function checks to see if the value passed into input is a "yes" or "no."
 * @param {String} input        A string that will be normalized via .toLowerCase().
 * @returns {Boolean}           The result of our condition evaluation.
 */
function yesNo(input) {
    return input.toLowerCase() === "yes" || input.toLowerCase() === "no";
}
// End of yesNo()

/**
 * This helper function operates as a default callback for promptFor's validation.
 * Feel free to modify this to suit your needs.
 * @param {String} input        A string.
 * @returns {Boolean}           Default validation -- no logic yet.
 */
function chars(input) {
    return true; // Default validation only
}
// End of chars()

//////////////////////////////////////////* End Of Starter Code *//////////////////////////////////////////
// Any additional functions can be written below this line 👇. Happy Coding! 😁

/**
 * This function will take in user input in order to filter
 * the people data set down to a smaller collection of objects
 * that match the user's query.
 * @param {Array} people     A collection of people objects
 * @returns {Array}          A collection of people objects
 */
function searchByTraits(people) {
    let userIntput = prompt(
        "Please enter what specific trait you would like to search by:\ngender\ndob\nheight\nweight\neyeColor\noccupation."
    );
    let results;
    switch (userIntput) {
        case "gender":
            results = searchByGender(people);
            break;
        case "dob":
            results = searchByDob(people);
            break;
        case "height":
            results = searchByHeight(people);
            break;
        case "weight":
            results = searchByWeight(people);
            break;
        case "eyeColor":
            results = searchByEyeColor(people);
            break;
        case "occupation":
            results = searchByOccupation(people);
            break;
        default:
            return searchByTraits(people);
    }
    return results;
}
/**
 * This function takes in a collection of people-objects
 * inside the array and returns a collection of people-objects
 * that match the requested gender by the user
 * @param {Array} people     A collection of people objects
 * @returns {Array}          A collection of people objects
 */
function searchByGender(people) {
    let userInput = prompt(
        "Please select a gender to search by:\nmale\nfemale"
    );
    let results = people.filter(function (element) {
        if (userInput === element.gender) {
            return true;
        }
    });
    return results;
}
/**
 * This function takes in a collection of people-objects
 * inside the array and returns a collection of people-objects
 * that match the requested gender by the user
 * @param {Array} people     A collection of people objects
 * @returns {Array}          A collection of people objects
 */
function searchByDob(people) {
    let userInput = prompt("Please enter the DOB using M/DD/YYYY format: ");
    let results = people.filter(function (element) {
        if (userInput === element.dob) {
            return true;
        }
    });
    return results;
}
/**
 * This function takes in a collection of people-objects
 * inside the array and returns a collection of people-objects
 * that match the requested gender by the user
 * @param {Array} people     A collection of people objects
 * @returns {Array}          A collection of people objects
 */
function searchByHeight(people) {
    let userInput = parseInt(
        prompt("Please enter the height in inches (numbers only): ")
    );
    let results = people.filter(function (element) {
        if (userInput === element.height) {
            return true;
        }
    });
    return results;
}
/**
 * This function takes in a collection of people-objects
 * inside the array and returns a collection of people-objects
 * that match the requested gender by the user
 * @param {Array} people     A collection of people objects
 * @returns {Array}          A collection of people objects
 */
function searchByWeight(people) {
    let userInput = parseInt(
        prompt("Please enter the weight in pounds(numbers only): ")
    );
    let results = people.filter(function (element) {
        if (userInput === element.weight) {
            return true;
        }
    });
    return results;
}
/**
 * This function takes in a collection of people-objects
 * inside the array and returns a collection of people-objects
 * that match the requested gender by the user
 * @param {Array} people     A collection of people objects
 * @returns {Array}          A collection of people objects
 */
function searchByEyeColor(people) {
    let userInput = prompt(
        "Please enter an eye color to search by:\nbrown\nblack\nhazel\nblue\ngreen"
    );
    let results = people.filter(function (element) {
        if (userInput === element.eyeColor) {
            return true;
        }
    });
    return results;
}
/**
 * This function takes in a collection of people-objects
 * inside the array and returns a collection of people-objects
 * that match the requested gender by the user
 * @param {Array} people     A collection of people objects
 * @returns {Array}          A collection of people objects
 */
function searchByOccupation(people) {
    let userInput = prompt(
        "Please enter the occupation(use lowercase only):\ndoctor\nassistant\npolitician\nnurse\nlandscaper\nprogrammer\narchitect\nstudent "
    );
    let results = people.filter(function (element) {
        if (userInput === element.occupation) {
            return true;
        }
    });
    return results;
}
// End of Search by Traits functions (7 total)

/**
 *
 */
function findPersonFamily(person, people) {
    let results = [];
    let spouseId = person.currentSpouse;
    let parentsId = person.parents;
    if (spouseId !== null) {
        let spouseObj = people.find(function (element) {
            if (spouseId === element.id) {
                return true;
            }
        });
        results.push(spouseObj);
    }
    if (!parentsId[0]) {
        return results;
    }
    let parentsArr = people.filter(function (element) {
        if (parentsId[0] === element.id || parentsId[1] === element.id) {
            return true;
        }
    });
    results = results.concat(parentsArr);
    // Need to find siblings now.
    let siblingsArr = people.filter(function (element) {
        if (
            person.id !== element.id &&
            (element.parents.includes(parentsId[0]) ||
                element.parents.includes(parentsId[1]))
        ) {
            return true;
        }
    });
    results = results.concat(siblingsArr);
    return results;
}
