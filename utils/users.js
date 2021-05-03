const users = [];

// Join user to chat
function userJoin(connection, name) {
  const user = { connection, name};

  users.push(user);

  return user;
}

// Get current user
function getCurrentUser(connection) {
  return users.find(user => user.connection === connection);
}

/*
function updateUser(connection, name) {
    let found = users.find(user => user.connection === connection);

    
}*/

// User leaves chat
function userLeave(connection) {
  const index = users.findIndex(user => user.connection === connection);

  if (index !== -1) {
    return users.splice(index, 1)[0];
  }
}

// Get room users
/* function getRoomUsers(room) {
  return users.filter(user => user.room === room);
} */

// Get room users
function getAllUsers() {
    return users;
}
  
function getAllUserNames() {
  let nameslist = [];
  users.forEach(user => nameslist.push(user.name));

  return nameslist;
}

module.exports = {
  userJoin,
  getCurrentUser,
  userLeave,
  getAllUsers,
  getAllUserNames
};