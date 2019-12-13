const jwt = require('jsonwebtoken');
const ErrorResponse = require('../utils/errorResponse');
const asyncHandler = require('./async');
const User = require('../models/User');

// Protect routes
exports.protect = asyncHandler(async (req, res, next) => {
	let token;

	if (
		req.headers.authorization &&
		req.headers.authorization.startsWith('Bearer')
	) {
		// Set Token in Header from Bearer token
		token = req.headers.authorization.split(' ')[1];
		// Set Token from Cookie
	} else if (req.cookies.token) {
		token = req.cookies.token;
	}

	// Make sure Token Exists
	if (!token) {
		return next(new ErrorResponse('Not Authorized To Access This Route', 401));
	}

	try {
		// Verify token
		const decoded = jwt.verify(token, process.env.JWT_SECRET);
		console.log(decoded);
		req.user = await User.findById(decoded.id);
		next();
	} catch (err) {
		return next(new ErrorResponse('Not Authorized To Access This Route', 401));
	}
});

// Grant Access to Specific Roles
exports.authorize = (...roles) => {
	return (req, res, next) => {
		if (!roles.includes(req.user.role)) {
			return next(
				new ErrorResponse(
					`User role ${req.user.role} is not Authorized to Access This Route`,
					403
				)
			);
		}
		next();
	};
};
