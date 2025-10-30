function ipLogger(req, res, next) {
    const ip = req.headers['x-forwarded-for'] || req.socket.remoteAddress;
    console.log("Client IP:", ip);
    next();
}

module.exports = ipLogger;