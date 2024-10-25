
// Remove whitespaces from any string-

function remove_whitespaces(str) {

    let remove_whitespaces_from_string = str.replace(/ /g, "");
    // or
    // let remove_whitespaces_from_string = str.split(" ").join("");
    return remove_whitespaces_from_string;

};

// let rw = remove_whitespaces(" remove  _all  _whitespaces ");
// console.log(rw);


// Second, minute and hour
function convertSeconds(sec) {
    var hrs = Math.floor(sec / 3600);
    var min = Math.floor((sec - (hrs * 3600)) / 60);
    var seconds = sec - (hrs * 3600) - (min * 60);
    seconds = Math.round(seconds * 100) / 100;

    var result = (hrs < 10 ? "0" + hrs : hrs);
    result += ":" + (min < 10 ? "0" + min : min);
    result += ":" + (seconds < 10 ? "0" + seconds : seconds);
    return result;
};

function shuffle(array) {
    var currentIndex = array.length, temporaryValue, randomIndex;

    // While there remain elements to shuffle...
    while (0 !== currentIndex) {

        // Pick a remaining element...
        randomIndex = Math.floor(Math.random() * currentIndex);
        currentIndex -= 1;

        // And swap it with the current element.
        temporaryValue = array[currentIndex];
        array[currentIndex] = array[randomIndex];
        array[randomIndex] = temporaryValue;
    };

    return array;
};

// To check if string has text or empty-
function is_text_or_empty(string) {
    // console.log("String is" + string);
    if (string === "") {
        return "no_text";
    }
    else {
        return string;
    };
};

// let k = "";
// console.log(is_text_or_empty(k));

// Functions to push any object(element) of first array to another array in respective order-

function push_object_to_a_another_object(object, obj_to_push) {

    // # Note- (1). Do not use ...args to push many elements using Object assign unless it will push only latest element instead push more key value pairs in one object.
    // (2). Don't push objects of same key because the latest object will override existing element having same key.

    return Object.assign(object, obj_to_push);

    // Example-
    // let ar = { "name": "Krish Khare" , "Birthday": "20/08/2003" };
    // let a1 = { "wife_name": "Riya Gupta" ,"wife_Birthday": "23/08/200?" };
    // let k = push_object_to_a_another_object(ar, a1);
    // console.log(k);
};


// function push_obj_of_a_array_of_object_to_another_array_of_object_in_respective_order(object_elements_to_push, arr_of_obj, new_obj_key_name_to_push) {

//     // like arr1[objA, objB, objC] & arr2[obj1, obj2, obj3] => arr2[obj1 + objA, obj2 + objB] or

//     // let search_queries_with_dates = [];
//     // for (let i = 0; i < searched_people.length; i++) {
//     //     const searched_people_element = searched_people[i];
//     //     let date_key_value = {"date": search_queries_date[i]}
//     //     Object.assign(searched_people_element, date_key_value);
//     //     search_queries_with_dates.push(searched_people_element);
//     // };

//     // Time taken-
//     // let d1 = new Date();
//     // console.log(d1);
//     // console.log(d1.getMilliseconds());
//     //

//     let new_arr_of_obj = [];

//     for (let i = 0; i < arr_of_obj.length; i++) {
//         const obj_element = arr_of_obj[i];

//         // let obj1_key_value_pair_to_push = {  new_obj_key_name_to_push: object_elements_to_push[i] }; // It is not taking function's parameter as key name instead using parameter as key name of pushing object.

//         let obj1_key_value_pair_to_push = {};
//         // object[key] = value;
//         obj1_key_value_pair_to_push[new_obj_key_name_to_push] = object_elements_to_push[i];


//         Object.assign(obj_element, obj1_key_value_pair_to_push);
//         new_arr_of_obj.push(obj_element);
//     };

//     // Time taken-
//     // let d2 = new Date();
//     // console.log(d2)
//     // console.log(d2.getMilliseconds())
//     // console.log("Time taken:", d2-d1);
//     //

//     return new_arr_of_obj;
// };

// Upper function is working perfectly-

function push_elements_of_arr_of_obj_in_another_arr_of_obj_in_respective_order(arr_of_obj, arr_of_obj_to_push) {

    // like arr1[objA, objB, objC] & arr2[obj1, obj2, obj3] => arr2[obj1 + objA, obj2 + objB] or

    // Time taken-
    // let d1 = new Date();
    // console.log(d1);
    // console.log(d1.getMilliseconds());
    //

    let new_arr_of_obj = [];

    for (let i = 0; i < arr_of_obj.length; i++) {
        const obj_element = arr_of_obj[i];

        // let obj1_key_value_pair_to_push = {  new_obj_key_name_to_push: object_elements_to_push[i] }; // It is not taking function's parameter as key name instead using parameter as key name of pushing object.

        // let obj1_key_value_pair_to_push = {};
        // object[key] = value;
        // obj1_key_value_pair_to_push[new_obj_key_name_to_push] = object_elements_to_push[i];


        Object.assign(obj_element, arr_of_obj_to_push[i]);
        new_arr_of_obj.push(obj_element);
    };

    // Time taken-
    // let d2 = new Date();
    // console.log(d2)
    // console.log(d2.getMilliseconds())
    // console.log("Time taken:", d2-d1);
    //

    return new_arr_of_obj;
};

// Function return 5 digit random numbers-
function random_five_digit(params) {
    return Math.floor(Math.random() * 99999 - 10000 + 1) + 100000;
}

// setInterval(()=>{
//     console.log(random_five_digit());
// }, 2000)


module.exports = {
    remove_whitespaces,
    convertSeconds,
    shuffle,
    is_text_or_empty,
    push_object_to_a_another_object,
    push_elements_of_arr_of_obj_in_another_arr_of_obj_in_respective_order,
    random_five_digit
};