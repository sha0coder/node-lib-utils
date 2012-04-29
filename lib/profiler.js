
function profile(msg,time) {
    var now = new Date().getTime();
    if (time > 0)
        console.log("%s %d ms.",msg,(now-time));

    return now;
}

exports.profile = profile

