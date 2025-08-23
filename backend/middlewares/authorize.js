// middlewares/authorize.js
function authorize(entity, action) {
    return (req, res, next) => {
        const role = req.user.role || req.user.Role; // uzmi iz tokena
        console.log('Role:', role, 'Entity:', entity, 'Action:', action);

        const permissions = {
            admin: {
                User: ['create','read','update','delete'],
                Client: ['create','read','update','delete'],
                Offer: ['create','read','update','delete'],
                Service: ['create','read','update','delete'],
                Materials: ['create','read','update','delete']
            },
            zaposlenik: {
                User: ['read'],
                Client: ['create','read','update','delete'],
                Offer: ['create','read','update','delete'],
                Service: ['read']
            }
        };

        // Provjeri ima li rola pravo na akciju
        if (!permissions[role] || !permissions[role][entity]?.includes(action)) {
            return res.status(403).json({ message: 'Nemate ovlasti za ovu akciju' });
        }

        next();
    };
}

module.exports = authorize;
