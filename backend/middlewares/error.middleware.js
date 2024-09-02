const errorMiddleware = (err, req, res, next) => {
    // Ensure statusCode and message have default values
    const statusCode = err.statusCode || 500;
    const message = err.message || "Something went wrong";

    console.log(`Error: ${message}, Status Code: ${statusCode}`); // For debugging

    res.status(statusCode).json({
        success: false,
        message: message,
        stack: process.env.NODE_ENV === 'production' ? undefined : err.stack
    });
};

export default errorMiddleware;
