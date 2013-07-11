Meteor.startup(function(){
    var bootstrapCategories = [
        {collectionName: "Flashcards", logMethod: "json"},
        {collectionName: "Courses", logMethod: "json"},
        {collectionName: "Items", logMethod: "json"},
        {collectionName: "FlashcardVotes", logMethod: "json"},
        {collectionName: "FlashcardCommentVotes", logMethod: "json"},
        {collectionName: "CourseVotes", logMethod: "json"},
        {collectionName: "CourseCommentVotes", logMethod: "json"},
        {collectionName: "Collections", logMethod: "json"},
        {collectionName: "TheBrain", logMethod: "json"}

    ]

    importCategories(bootstrapCategories);
    importUsers();
    bootstrapData = null;
});

function importUsers() {
    _.each(bootstrapData["users"], function(user) {
        if (Meteor.users.find(user._id).count() === 0) {
            Accounts.createUser(user);
        }
    });
}

function importCategories(bootstrapCategories) {
    for (var i = 0; i < bootstrapCategories.length; i++) {
        importCategory(bootstrapCategories[i]);
    }
};

function importCategory(category) {
    object = getReferenceToObjectByString(category.collectionName);
    if (isCollectionEmpty(object)) {

        printDebugInfo(category);
        insertBootstrapData(category, object);

    }
};

function getReferenceToObjectByString(collectionName) {
    return eval(collectionName);
};

function isCollectionEmpty(object) {
    if (object.find().count() === 0) {
        return true;
    }
    else {
        return false;
    }
};

function printDebugInfo(category) {
    decappedCollectionName = decapitalizeFirstLetter(category.collectionName);

    debug = "Inserting " + category.collectionName;

    if (category.logMethod === "json") {
        debug = debug + " " + JSON.stringify(bootstrapData[decappedCollectionName]);
    }
    else if (category.logMethod === "length") {
        debug = debug + " " + bootstrapData[decappedCollectionName].length + " " + category.collectionName;
    }

    console.log(debug);
};

function insertBootstrapData(category, object) {
    decappedCollectionName = decapitalizeFirstLetter(category.collectionName);

    _.each(bootstrapData[decappedCollectionName], function(e){
        object.insert(e);
    });
};

function decapitalizeFirstLetter(string) {
    return string.charAt(0).toLowerCase() + string.slice(1);
};
