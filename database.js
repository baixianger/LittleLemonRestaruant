import * as SQLite from "expo-sqlite/legacy";

const db = SQLite.openDatabase("little_lemon");

export async function createTable() {
  return new Promise((resolve, reject) => {
    db.transaction(
      (tx) => {
        tx.executeSql(
          "create table if not exists menuitems (id integer primary key not null, name text, price text, description text, image text, category text);",
          [],
          () => {console.log("✅表格创建成功"); },
          (txObj, error) => {console.error("❌表格创建失败 :", error.message);reject(error); }
          );
      },
      reject,
      resolve
    );
  });
}

export async function dropTable() {
  db.transaction((tx) => {
      tx.executeSql(
        `DROP TABLE IF EXISTS menuitems;`, 
        [], 
        ()=>{console.log('✅删表成功');}, 
        (_, error) => {console.error('❌删表失败 :', error);}
      );
    });
}

export async function getMenuItems() {
  return new Promise(resolve => {
    db.transaction((tx) => {
      tx.executeSql(
        `SELECT * FROM menuitems;`, 
        [], 
        (_, { rows }) => {console.log('✅读取行成功, 行数 : ', rows._array.length); resolve(rows._array);}, 
        (_, error) => {console.log('❌读取行失败 :', error.message);}
        );
    });
  });
}


export function saveMenuItems(menuItems) {
  db.transaction((tx) => {
    menuItems.forEach((item) => {
      const sql = `INSERT INTO menuitems (id, name, price, description, image, category) VALUES (?, ?, ?, ?, ?, ?);`;
      tx.executeSql(
        sql, 
        [item.id, item.name, item.price, item.description, item.image, item.category], 
        () => {console.log('✅插入数据成功:', item.id, item.name, item.price, item.image);}, 
        (_, error) => {console.log('❌插入数据失败 :', item.id, error);}
        );
    });
  });
}


export async function filterByQueryAndCategories(query, activeCategories) {
  return new Promise((resolve, reject) => {
    // resolve(SECTION_LIST_MOCK_DATA);
    const queryFilter = query ? `name LIKE ?` : '1=1';
    const categoryFilter = activeCategories.length > 0 ? `category IN (${activeCategories.map(() => '?').join(', ')})` : '1=1';
    const sql = `
      SELECT * FROM menuitems
      WHERE ${queryFilter} AND ${categoryFilter};
    `;
    const params = [];
    if (query) {
      params.push(`%${query}%`);
    }
    params.push(...activeCategories);

    // console.log('SQL语句是 : ', sql);
    // console.log('参数是 : ', params);
    
    db.transaction((tx)=>{
      tx.executeSql(
        sql, 
        params, 
        (_, {rows})=>{console.log('✅搜索成功, 返回行数 :', rows._array.length, '返回项 : ', rows._array.map(item => item.name)); resolve(rows._array);}, 
        (_, error) => { console.log('❌搜索失败 :', error);}
        );
    });
  });
}

export async function testDB(sql, params) {
  return new Promise(resolve => {
    db.transaction((tx) => {
      tx.executeSql(sql, params, (_, { rows }) => {
        resolve(rows._array);
      });
    });
  });
}





