// middleware/iranRedirect.js
module.exports = function iranRedirect(req, res, next) {
    console.log('[iranRedirect] middleware loaded');
    console.log('[iranRedirect] incoming request:', req.method, req.url);
    const ip = req.headers['x-forwarded-for'] || req.connection.remoteAddress;
    console.log('[iranRedirect] path:', req.path, '| ip:', ip);

    // If already on /fa or /fa/... do nothing
    if (req.path.startsWith('/fa')) {
        console.log('[iranRedirect] already on /fa, skip redirect');
        return next();
    }

    // List of Iran IP ranges (CIDR) can be used for more accuracy
    // For now, use a simple substring check for demonstration
    if (ip && (
        ip.startsWith('5.') || ip.startsWith('2.144.') || ip.startsWith('2.145.') || ip.startsWith('2.146.') || ip.startsWith('2.147.') || ip.startsWith('2.148.') || ip.startsWith('2.149.') || ip.startsWith('2.150.') || ip.startsWith('2.151.') || ip.startsWith('2.152.') || ip.startsWith('2.153.') || ip.startsWith('2.154.') || ip.startsWith('2.155.') || ip.startsWith('2.156.') || ip.startsWith('2.157.') || ip.startsWith('2.158.') || ip.startsWith('2.159.') || ip.startsWith('37.255.') || ip.startsWith('46.224.') || ip.startsWith('46.225.') || ip.startsWith('46.226.') || ip.startsWith('46.227.') || ip.startsWith('46.228.') || ip.startsWith('46.229.') || ip.startsWith('46.230.') || ip.startsWith('46.231.') || ip.startsWith('46.232.') || ip.startsWith('46.233.') || ip.startsWith('46.234.') || ip.startsWith('46.235.') || ip.startsWith('46.236.') || ip.startsWith('46.237.') || ip.startsWith('46.238.') || ip.startsWith('46.239.') || ip.startsWith('78.38.') || ip.startsWith('79.127.') || ip.startsWith('80.191.') || ip.startsWith('81.12.') || ip.startsWith('81.31.') || ip.startsWith('82.99.') || ip.startsWith('83.120.') || ip.startsWith('84.241.') || ip.startsWith('85.15.') || ip.startsWith('85.133.') || ip.startsWith('86.57.') || ip.startsWith('87.107.') || ip.startsWith('87.247.') || ip.startsWith('88.135.') || ip.startsWith('89.32.') || ip.startsWith('89.165.') || ip.startsWith('91.98.') || ip.startsWith('91.99.') || ip.startsWith('91.184.') || ip.startsWith('91.185.') || ip.startsWith('91.186.') || ip.startsWith('91.187.') || ip.startsWith('91.188.') || ip.startsWith('91.189.') || ip.startsWith('91.190.') || ip.startsWith('91.191.') || ip.startsWith('91.192.') || ip.startsWith('91.193.') || ip.startsWith('91.194.') || ip.startsWith('91.195.') || ip.startsWith('91.196.') || ip.startsWith('91.197.') || ip.startsWith('91.198.') || ip.startsWith('91.199.') || ip.startsWith('91.200.') || ip.startsWith('91.201.') || ip.startsWith('91.202.') || ip.startsWith('91.203.') || ip.startsWith('91.204.') || ip.startsWith('91.205.') || ip.startsWith('91.206.') || ip.startsWith('91.207.') || ip.startsWith('91.208.') || ip.startsWith('91.209.') || ip.startsWith('91.210.') || ip.startsWith('91.211.') || ip.startsWith('91.212.') || ip.startsWith('91.213.') || ip.startsWith('91.214.') || ip.startsWith('91.215.') || ip.startsWith('91.216.') || ip.startsWith('91.217.') || ip.startsWith('91.218.') || ip.startsWith('91.219.') || ip.startsWith('91.220.') || ip.startsWith('91.221.') || ip.startsWith('91.222.') || ip.startsWith('91.223.') || ip.startsWith('91.224.') || ip.startsWith('91.225.') || ip.startsWith('91.226.') || ip.startsWith('91.227.') || ip.startsWith('91.228.') || ip.startsWith('91.229.') || ip.startsWith('91.230.') || ip.startsWith('91.231.') || ip.startsWith('91.232.') || ip.startsWith('91.233.') || ip.startsWith('91.234.') || ip.startsWith('91.235.') || ip.startsWith('91.236.') || ip.startsWith('91.237.') || ip.startsWith('91.238.') || ip.startsWith('91.239.') || ip.startsWith('91.240.') || ip.startsWith('91.241.') || ip.startsWith('91.242.') || ip.startsWith('91.243.') || ip.startsWith('91.244.') || ip.startsWith('91.245.') || ip.startsWith('91.246.') || ip.startsWith('91.247.') || ip.startsWith('91.248.') || ip.startsWith('91.249.') || ip.startsWith('91.250.') || ip.startsWith('91.251.') || ip.startsWith('91.252.') || ip.startsWith('91.253.') || ip.startsWith('91.254.') || ip.startsWith('91.255.'))
    ) {
        console.log('[iranRedirect] redirecting to /fa' + req.originalUrl);
        return res.redirect(302, '/fa' + req.originalUrl);
    }
    console.log('[iranRedirect] not iran ip or not matched, continue');
    next();
};
