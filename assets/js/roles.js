const db = require('../../db/connection');

function getRolesList(){
    return new Promise((resolve,reject) => {
        const sql = `SELECT * FROM roles`;
        db.query(sql,(err,rows) => {
            if(err){
                reject(err);
                return;
            }
            const list = rows.map(row => ({name:`${row.title}`,value:row.id}));
            resolve({
                ok:true,
                data: list
            });
        });
    });
}

module.exports = getRolesList;