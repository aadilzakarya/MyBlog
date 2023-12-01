
import { config } from 'dotenv';
const UserDetails = require('./user');

UserDetails.register({ username: 'leo', active: false }, 'meow');
UserDetails.register({ username: 'momo', active: false }, 'meow');

