db.getSiblingDB('admin')
    .createUser({
        user: 'admin',
        pwd: 'admin',
        roles: ['readWrite']
    });
