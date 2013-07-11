Accounts.loginServiceConfiguration.remove({
    service: "facebook"
});
console.log("Are we here?");
Accounts.loginServiceConfiguration.insert({
    service: "facebook",
    appId: "613948438636088",
    secret: "4488a2c042014fba1cca1f86039a558e"
});