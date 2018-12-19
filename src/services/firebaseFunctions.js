const axios = require('axios');
const FIREBASE_URl = 'https://us-central1-react-to-do-hooks.cloudfunctions.net/api';

module.exports = {
    getItems: () => {
        return axios.get(`${FIREBASE_URl}/getItems`);
    },

    addItem: (item) => {
        return axios.post(`${FIREBASE_URl}/addItem`, { item });
    },

    updateItem: (key, updatedItem) => {
        const updatedItemJSON = JSON.stringify(updatedItem);
        return axios.put(`${FIREBASE_URl}/updateItem`, {
            key,
            updatedItem: updatedItemJSON,
        });
    },

    deleteItem: (key) => {
        return axios.delete(`${FIREBASE_URl}/deleteItem`, { data: { key } });
    }
} 