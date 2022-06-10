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
            searchResults = searchByTraits(people);
            alert("Here's what we found:");
            displayPeople(searchResults);
            let traitsSearch = promptFor(
                "Would You like to continue narrow your search by additional traits? Enter 'yes' or 'no'",
                yesNo
            );
            // A while function was the simplest way I could think of to iterate over the search criteria based on user preference.
            while (traitsSearch === "yes") {
                searchResults = searchByTraits(searchResults);
                alert("Here's what we found:");
                displayPeople(searchResults);
                traitsSearch = promptFor(
                    "Would You like to continue narrow your search by additional traits? Enter 'yes' or 'no'",
                    yesNo
                );
            }
            // In the future I'd like to add a selection method from here, so the user doesn't have to enter the name.
            app(people);
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
            let personFamily = findPersonFamily(person[0], people);
            if (personFamily === "") {
                alert(
                    `${person[0].firstName} ${person[0].lastName} does not currently have a spouse, parents, or siblings.`
                );
            } else {
                alert(personFamily);
            }
            break;
        case "descendants":
            let personDescendants = findPersonDescendants(person[0], people);
            if (!personDescendants[0]) {
                alert(
                    `${person[0].firstName} ${person[0].lastName} does not currenly have descendants.`
                );
            } else {
                displayPeople(personDescendants);
            }
            break;
        case "restart":
            // Restart app() from the very beginning
            app(people);
            break;
        case "quit":
            // Stop application execution
            return;
        case "test":
            let results = iterateOverString("hello world");
            console.log(results);
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
 * that match the requested DOB by the user
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
 * that match the requested height by the user
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
 * that match the requested weight by the user
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
 * that match the requested eye color by the user
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
 * that match the requested occupation by the user
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
 * This function takes in a collection of people objects
 * and a single person object for filtering and finding family members.
 * It returns a string concated with the relationships, first, and last names.
 * @param {Object} person
 * @param {Array} people
 * @returns {String}
 */
function findPersonFamily(person, people) {
    let results = "";
    let spouseId = person.currentSpouse;
    let parentsId = person.parents;
    if (spouseId !== null) {
        results += findSpouse(people, spouseId);
    }
    if (!parentsId[0]) {
        return results;
    }
    results += findParents(parentsId, people);
    results += findSiblings(person, parentsId, people);
    return results;
}
/**
 * This function takes in a collection of people objects
 * and the Spouse ID used to find the appropriate object.
 * It returns a string with the relationship, first, and last name.
 * @param {Array} people
 * @param {Number} spouseId
 * @returns {String}
 */
function findSpouse(people, spouseId) {
    let spouseObj = people.find(function (element) {
        if (spouseId === element.id) return true;
    });
    let spouse = `Spouse: ${spouseObj.firstName} ${spouseObj.lastName}\n`;
    return spouse;
}

/**
 * This function takes in a collection of people objects
 * and the Parents ID used to filter the collection.
 * It returns a string with the relationship, first, and last names.
 * @param {Array} parentsId
 * @param {Array} people
 * @returns {String}
 */
function findParents(parentsId, people) {
    let parentsArr = people.filter(function (element) {
        if (parentsId[0] === element.id || parentsId[1] === element.id) {
            return true;
        }
    });
    let parents = parentsArr
        .map(function (person) {
            return `Parent: ${person.firstName} ${person.lastName}`;
        })
        .join("\n");
    return parents;
}

/**
 * This function takes in a collection of people objects,
 * the Parents ID, and the person used to filter the collection.
 * It returns a string with the relationship, first, and last names.
 * @param {Array} person
 * @param {Array} parentsId
 * @param {Array} people
 * @returns {String}
 */
function findSiblings(person, parentsId, people) {
    let siblingsArr = people.filter(function (element) {
        if (
            person.id !== element.id &&
            (element.parents.includes(parentsId[0]) ||
                element.parents.includes(parentsId[1]))
        ) {
            return true;
        }
    });
    let siblings = siblingsArr.map(function (person) {
        return `\nSibling: ${person.firstName} ${person.lastName}`;
    });
    return siblings;
}
// End of Finding Family functions (4 total)

/**
 * This function takes in a collection of people
 * and a person, used to filter recusively through the collection
 * to find all the descendants of the original person.
 * It returns an array with the descendants.
 * @param {Object} person
 * @param {Array} people
 * @returns {Array}
 */
function findPersonDescendants(person, people) {
    // Descendants need to be found through who includes person's ID in their parent array
    // Then needs to resursively check to see if that child's ID is in anyone's parent array
    // Have to have a check, where if the person's ID is not in a parent array,
    // it returns until we get to the top level.
    let currentChildren = people.filter(function (element) {
        if (element.parents.includes(person.id)) {
            return true;
        }
    });
    let descendantsArray = currentChildren;
    if (!currentChildren[0]) {
        return descendantsArray;
    }
    for (let i = 0; i < currentChildren.length; i++) {
        descendantsArray = descendantsArray.concat(
            findPersonDescendants(currentChildren[i], people)
        );
    }
    return descendantsArray;
}
// End of Finding Descendants function

function traitSortSelection(people) {
    let userPref = promptFor(
        "Would you like to search by one trait at a time or multiple? Enter 'one' or 'multiple'",
        oneMultiple
    ).toLowerCase();
    switch (userPref) {
        case "one":
            oneTraitSort(people);
            app(people);
            break;
        case "multiple":
            break;
        default:
            alert("There seems to be an error. Lets try this again.");
            app(people);
            break;
    }
}

function oneTraitSort(people) {
    searchResults = searchByTraits(people);
    alert("Here's what we found:");
    displayPeople(searchResults);
    let traitsSearch = promptFor(
        "Would You like to continue narrow your search by additional traits? Enter 'yes' or 'no'",
        yesNo
    );
    // A while function was the simplest way I could think of to iterate over the search criteria based on user preference.
    while (traitsSearch === "yes") {
        searchResults = searchByTraits(searchResults);
        alert("Here's what we found:");
        displayPeople(searchResults);
        traitsSearch = promptFor(
            "Would You like to continue narrow your search by additional traits? Enter 'yes' or 'no'",
            yesNo
        );
    }
}

function multipleTraitSort(people) {
    let userInput = prompt(
        "Please enter what traits you would like to search by:\ngender\ndob\nheight\nweight\neyeColor\noccupation."
    );
    let traitsArr = iterateOverString(userInput);

    switch (userInput) {
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

function iterateOverString(string) {
    let traitsArr = [];
    let currentTrait = "";
    for (let index = 0; index < string.length; index++) {
        if (string[index] === " ") {
            traitsArr.push(currentTrait);
            currentTrait = "";
        } else {
            currentTrait += string[index];
        }
    }
    traitsArr.push(currentTrait);
    return traitsArr;
}
