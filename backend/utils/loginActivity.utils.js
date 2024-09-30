const loginActivity = [];

export const logLoginActivity = (userId, ip, location, device) => {
    const activity = {
        userId: userId,
        ip: ip || 'Unknown IP',
        location: location || { city: 'Unknown', country: 'Unknown' },
        device: device || 'Unknown Device',
        time: new Date().toISOString(),
    };

    // Push the activity to the array (you can modify this to save to a database if needed)
    loginActivity.push(activity);

    return activity; // Optionally return the activity for further use
};
;